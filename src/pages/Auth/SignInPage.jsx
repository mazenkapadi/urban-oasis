import React, {useEffect, useState} from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';
import signIn from "../../services/auth/signIn.js";
import AuthLeftComponent from "../../components/AuthLeftComponent.jsx";
import { useNavigate } from "react-router-dom";
import themeManager from "../../utils/themeManager.jsx";

function SignInPage() {
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ error, setError ] = useState(null);
    const [ showPassword, setShowPassword ] = useState(false);
    const navigate = useNavigate();
    const [ darkMode, setDarkMode ] = useState(themeManager.isDarkMode);

    useEffect(() => {
        const handleThemeChange = (isDark) => setDarkMode(isDark);
        themeManager.addListener(handleThemeChange);

        return () => {
            themeManager.removeListener(handleThemeChange);
        };
    }, []);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleSignInWithEmail = async () => {
        if (!email || !password) {
            setError('Email and password are required');
            return;
        }
        try {
            await signIn.signInWithEmail(email, password);
            navigate('/');
            setError(null);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleSignInWithGoogle = async () => {
        try {
            await signIn.signInWithGoogle();
            navigate('/');
            setError(null);
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

                <div className={`flex-[2] h-screen p-4 flex items-center justify-center ${darkMode ? 'bg-Dark-D2' : 'bg-primary-light'}`}>
                    <div className={`signInBox box-border rounded-lg ${darkMode ? "bg-primary-dark" : "bg-Light-L1"} p-6 flex items-center justify-center w-full max-w-sm md:max-w-md h-auto`}>
                        <div className="content w-full">
                            <h2 className={`text-3xl font-bold mb-6 px-2 ${darkMode ? "text-primary-light" : "text-primary-dark"}`}>Sign In</h2>

                            {error && <div className="text-red-500 text-sm p-2">{error}</div>}

                            <div className="p-2">
                                <label className={`block pb-1 ${darkMode ? "text-Light-L1" : "text-Dark-D1"}`} htmlFor="email">Email</label>
                                <input
                                    className={`shadow appearance-none border ${darkMode ? "border-Light-L1 text-Dark-D1" : "border-Dark-D1 text-Dark-D1"} rounded-lg w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline`}
                                    id="email"
                                    type="email"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="p-2">
                                <div className="pb-1">
                                    <div className="flex justify-between">
                                        <label className={`${darkMode ? "text-Light-L1" : "text-Dark-D1"}`} htmlFor="password">Password</label>
                                        <a href="/forgotPassword" className="text-sm text-accent-blue">Forgot your password?</a>
                                    </div>
                                </div>
                                <div className="relative">
                                    <input
                                        className={`shadow appearance-none border ${darkMode ? "border-Light-L1 text-Dark-D1" : "border-Dark-D1 text-Dark-D1"} rounded-lg w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline`}
                                        id="password"
                                        type={showPassword ? 'text' : 'password'} // Toggle between text and password
                                        placeholder="••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={toggleShowPassword}
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showPassword ? (
                                            <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                                        ) : (
                                            <EyeIcon className="h-5 w-5 text-gray-400" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col items-center justify-center px-2">
                                <button
                                    className={`${darkMode ? "bg-Dark-D2 text-primary-light hover:bg-primary-light hover:text-primary-dark" : "bg-primary-light text-primary-dark hover:bg-primary-dark hover:text-primary-light"} font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline w-full mt-4 transition-colors duration-300 `}
                                    aria-label="Sign In"
                                    onClick={handleSignInWithEmail}
                                >
                                    Sign In
                                </button>

                                <p className={`text-sm my-4 ${darkMode ? "text-primary-light" : "text-primary-dark"}`}>
                                    Don’t have an account? <a href="/signUp" className="text-accent-blue">Sign Up</a>
                                </p>

                                <div className="flex items-center w-full my-2">
                                    <hr className={`flex-grow border-t ${darkMode ? "border-Light-L1" : "border-Dark-D1"}`} />
                                    <span className={`mx-4 ${darkMode ? "border-Light-L1 text-Light-L1" : "border-Dark-D1 text-Dark-D1"}`}>or</span>
                                    <hr className={`flex-grow border-t ${darkMode ? "border-Light-L1" : "border-Dark-D1"}`} />
                                </div>

                                <button
                                    className={`${darkMode ? "bg-Dark-D2 text-primary-light hover:bg-primary-light hover:text-primary-dark" : "bg-primary-light text-primary-dark hover:bg-primary-dark hover:text-primary-light"} font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline w-full flex items-center justify-center transition-colors duration-300`}
                                    aria-label="Sign In with Google"
                                    onClick={handleSignInWithGoogle}
                                >
                                    <img src="/google.svg" alt="Google logo" className="pr-0.5" width="24" height="24" />
                                    <p className="ml-2">Sign In with Google</p>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SignInPage;
