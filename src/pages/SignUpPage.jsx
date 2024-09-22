import React, { useState } from 'react';
import signUp from "../services/auth/signUp.js";
import SignIn from "../services/auth/signIn.js";
import AuthLeftComponent from "../components/AuthLeftComponent.jsx";
import { useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

function SignUpPage() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const toggleShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const PASSWORD_REGEX = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,32}$/;

    const validateEmail = (email) => EMAIL_REGEX.test(email);
    const validatePassword = (password) => PASSWORD_REGEX.test(password);

    const handleSignUpWithEmail = async () => {
        if (!email || !password || !confirmPassword || !firstName || !lastName) {
            setError('All fields are required');
            return;
        }

        if (!validateEmail(email)) {
            setError('Invalid email');
            return;
        }

        if (!validatePassword(password)) {
            setError('Passwords must be at least 8 characters and include a number, uppercase letter, lowercase letter, and a special character');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const user = await signUp.signUpWithEmail(firstName, lastName, email, password);
            if (user) {
                navigate('/ContactInfoPage');
            }
            setError(null);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleSignInWithGoogle = async () => {
        try {
            const user = await SignIn.signInWithGoogle();
            if (user) {
                navigate('/ContactInfoPage'); // Redirect to profile
            }
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <>
            <div className="flex w-screen h-screen">
                <div className="flex-[3]">
                    <AuthLeftComponent />
                </div>
                <div className="flex-[2] h-screen bg-blue-800 p-4 flex items-center justify-center">
                    <div className="signUpBox box-border rounded-lg bg-gray-900 p-6 flex items-center justify-center w-full max-w-sm md:max-w-md h-auto">
                        <div className="content w-full">
                            <h2 className="text-3xl font-bold text-white mb-6 px-2">Sign Up</h2>

                            {error && <div className="text-red-500 text-sm p-2">{error}</div>}

                            <div className="p-2">
                                <div className="flex space-x-4">
                                    {/* First Name */}
                                    <div className="flex-1">
                                        <label className="block text-gray-300 pb-1" htmlFor="firstName">First Name</label>
                                        <input
                                            className="shadow appearance-none border border-gray-600 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            id="firstName"
                                            type="text"
                                            placeholder="First Name"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                        />
                                    </div>

                                    {/* Last Name */}
                                    <div className="flex-1">
                                        <label className="block text-gray-300 pb-1" htmlFor="lastName">Last Name</label>
                                        <input
                                            className="shadow appearance-none border border-gray-600 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            id="lastName"
                                            type="text"
                                            placeholder="Last Name"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="p-2">
                                <label className="block text-gray-300 pb-1" htmlFor="email">Email</label>
                                <input
                                    className="shadow appearance-none border border-gray-600 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="email"
                                    type="email"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="p-2">
                                <label className="block text-gray-300 pb-1" htmlFor="password">Password</label>
                                <div className="relative">
                                    <input
                                        className="shadow appearance-none border border-gray-600 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="p-2">
                                <label className="block text-gray-300 pb-1" htmlFor="confirmPassword">Confirm Password</label>
                                <div className="relative">
                                    <input
                                        className="shadow appearance-none border border-gray-600 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="confirmPassword"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        placeholder="••••••"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={toggleShowConfirmPassword}
                                        className="absolute right-3 top-2 text-gray-300"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeSlashIcon className="h-5 w-5" />
                                        ) : (
                                            <EyeIcon className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col items-center justify-center px-2">
                                <button
                                    className="bg-white text-black font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline w-full mt-4 transition-colors duration-300 hover:bg-black hover:text-white"
                                    aria-label="Sign Up"
                                    onClick={handleSignUpWithEmail}
                                >
                                    Sign Up
                                </button>

                                <p className="text-sm text-gray-400 my-4">
                                    Already have an account? <a href="/signIn" className="text-blue-500">Sign in</a>
                                </p>

                                <div className="flex items-center w-full my-2">
                                    <hr className="flex-grow border-t border-gray-400" />
                                    <span className="mx-4 text-gray-400">or</span>
                                    <hr className="flex-grow border-t border-gray-400" />
                                </div>

                                <button
                                    className="bg-white text-black font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline w-full flex items-center justify-center transition-colors duration-300 hover:bg-black hover:text-white"
                                    aria-label="Sign Up with Google"
                                    onClick={handleSignInWithGoogle}
                                >
                                    <img src="../../public/assets/google.svg" alt="Google logo" className="pr-0.5" width="24" height="24" />
                                    <p className="ml-2">Sign Up with Google</p>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SignUpPage;
