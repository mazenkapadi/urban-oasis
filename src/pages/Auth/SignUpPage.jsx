import React, {useEffect, useState} from 'react';
import signUp from "../../services/auth/signUp.js";
import SignIn from "../../services/auth/signIn.js";
import AuthLeftComponent from "../../components/AuthLeftComponent.jsx";
import {useNavigate} from "react-router-dom";
import {EyeIcon, EyeSlashIcon} from '@heroicons/react/24/outline';
import themeManager from "../../utils/themeManager.jsx";
import Tooltip from "@mui/material/Tooltip";

function SignUpPage() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [darkMode, setDarkMode] = useState(themeManager.isDarkMode);
    const [showEmailTooltip, setShowEmailTooltip] = useState(false);
    const [showPwdTooltip, setShowPwdTooltip] = useState(false);
    const [showPwdConfirmTooltip, setShowPwdConfirmTooltip] = useState(false);
    const [showFirstTooltip, setShowFirstTooltip] = useState(false);
    const [showLastTooltip, setShowLastTooltip] = useState(false);
    const [showInvalidEmailTooltip, setShowInvalidEmailTooltip] = useState(false);
    const [showInvalidPasswordTooltip, setShowInvalidPasswordTooltip] = useState(false);
    const [showMatchTooltip, setShowMatchTooltip] = useState(false);
    const [showConfirmFirestoreTooltip, setShowConfirmFirestoreTooltip] = useState(false);

    useEffect(() => {
        const handleThemeChange = (isDark) => setDarkMode(isDark);
        themeManager.addListener(handleThemeChange);

        return () => {
            themeManager.removeListener(handleThemeChange);
        };
    }, []);

    const toggleShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const PASSWORD_REGEX = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,32}$/;

    const validateEmail = (email) => EMAIL_REGEX.test(email);
    const validatePassword = (password) => PASSWORD_REGEX.test(password);

    const handleSignUpWithEmail = async () => {
        if (!firstName) {
            setShowFirstTooltip(true);
        } else {
            setShowFirstTooltip(false);
        }

        if (!lastName) {
            setShowLastTooltip(true);
        } else {
            setShowLastTooltip(false);
        }

        if (!confirmPassword) {
            setShowPwdConfirmTooltip(true);
        } else {
            setShowPwdConfirmTooltip(false);
            if (password !== confirmPassword) {
                setShowMatchTooltip(true);
            } else {
                setShowMatchTooltip(false);
            }
        }


        if (!password) {
            setShowPwdTooltip(true);
        } else {
            setShowPwdTooltip(false);
            if (!validatePassword(password)) {
                setShowInvalidPasswordTooltip(true);
            } else {
                setShowInvalidPasswordTooltip(false);
                if (password !== confirmPassword) {
                    setShowMatchTooltip(true);
                } else {
                    setShowMatchTooltip(false);
                }
            }

        }

        if (!email) {
            setShowEmailTooltip(true);
        } else {
            setShowEmailTooltip(false);
            if (!validateEmail(email)) {
                setShowInvalidEmailTooltip(true);
            } else {
                setShowInvalidEmailTooltip(false);
            }
        }


        try {
            const user = await signUp.signUpWithEmail(firstName, lastName, email, password);
            if (user) {
                navigate('/#');
            }
            setShowConfirmFirestoreTooltip(false);
        } catch {
            setShowConfirmFirestoreTooltip(true);
        }


    };

    const handleSignInWithGoogle = async () => {
        try {
            const user = await SignIn.signInWithGoogle();
            if (user) {
                navigate('/');
            }
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <>
            <div className="flex w-screen h-screen">
                <div className="flex-[3]">
                    <AuthLeftComponent/>
                </div>
                <div
                    className={`flex-[2] h-screen p-4 flex items-center justify-center ${darkMode ? 'bg-Dark-D2' : 'bg-primary-light'}`}>
                    <div
                        className={`signUpBox box-border rounded-lg ${darkMode ? "bg-primary-dark" : "bg-Light-L1"} p-6 flex items-center justify-center w-full max-w-sm md:max-w-md h-auto`}>
                        <div className="content w-full">
                            <h2 className={`text-3xl font-bold mb-6 px-2 ${darkMode ? "text-primary-light" : "text-primary-dark"}`}>Sign
                                Up</h2>

                            {error && <div className="text-red-500 text-sm p-2">{error}</div>}

                            <div className="p-2">
                                <div className="flex space-x-4">
                                    {/* First Name */}
                                    <div className="flex-1">
                                        <label className={`block pb-1 ${darkMode ? "text-Light-L1" : "text-Dark-D1"}`}
                                               htmlFor="firstName">First Name</label>
                                        <Tooltip
                                            title="First Name is required"
                                            open={showFirstTooltip}
                                            arrow
                                            placement="left"
                                        >
                                            <input
                                                className={`shadow appearance-none border ${darkMode ? "border-Light-L1 text-Dark-D1" : "border-Dark-D1 text-Dark-D1"} rounded-lg w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline`}
                                                id="firstName"
                                                type="text"
                                                placeholder="First Name"
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                            />
                                        </Tooltip>

                                    </div>

                                    {/* Last Name */}
                                    <div className="flex-1">
                                        <label className={`block pb-1 ${darkMode ? "text-Light-L1" : "text-Dark-D1"}`}
                                               htmlFor="lastName">Last Name</label>
                                        <Tooltip
                                            title="Last Name is required"
                                            open={showLastTooltip}
                                            arrow
                                            placement="right"
                                        >
                                            <input
                                                className={`shadow appearance-none border ${darkMode ? "border-Light-L1 text-Dark-D1" : "border-Dark-D1 text-Dark-D1"} rounded-lg w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline`}
                                                id="lastName"
                                                type="text"
                                                placeholder="Last Name"
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                            />
                                        </Tooltip>

                                    </div>
                                </div>
                            </div>

                            <div className="p-2">
                                <label className={`block pb-1 ${darkMode ? "text-Light-L1" : "text-Dark-D1"}`}
                                       htmlFor="email">Email</label>
                                <Tooltip
                                    title="Email is required"
                                    open={showEmailTooltip}
                                    arrow
                                    placement="right"
                                >
                                    <Tooltip
                                        title="Email is invalid"
                                        open={showInvalidEmailTooltip}
                                        arrow
                                        placement="right"
                                    >
                                        <input
                                            className={`shadow appearance-none border ${darkMode ? "border-Light-L1 text-Dark-D1" : "border-Dark-D1 text-Dark-D1"} rounded-lg w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline`}
                                            id="email"
                                            type="email"
                                            placeholder="your@email.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </Tooltip>
                                </Tooltip>


                            </div>

                            <div className="p-2">
                                <label className={`block pb-1 ${darkMode ? "text-Light-L1" : "text-Dark-D1"}`}
                                       htmlFor="password">Password</label>
                                <div className="relative">
                                    <Tooltip
                                        title="Password is required"
                                        open={showPwdTooltip}
                                        arrow
                                        placement="right"
                                    >
                                        <Tooltip
                                            title="Password is invalid"
                                            open={showInvalidPasswordTooltip}
                                            arrow
                                            placement="right"
                                        >
                                            <Tooltip
                                                title="Passwords must match"
                                                open={showMatchTooltip}
                                                arrow
                                                placement="left"
                                            >
                                                <input
                                                    className={`shadow appearance-none border ${darkMode ? "border-Light-L1 text-Dark-D1" : "border-Dark-D1 text-Dark-D1"} rounded-lg w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline`}
                                                    id="password"
                                                    type="password"
                                                    placeholder="••••••"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                />
                                            </Tooltip>
                                        </Tooltip>
                                    </Tooltip>

                                </div>
                            </div>

                            <div className="p-2">
                                <label className={`block pb-1 ${darkMode ? "text-Light-L1" : "text-Dark-D1"}`}
                                       htmlFor="confirmPassword">Confirm Password</label>
                                <div className="relative">
                                    <Tooltip
                                        title="Confirm Password is required"
                                        open={showPwdConfirmTooltip}
                                        arrow
                                        placement="right"
                                    >
                                        <Tooltip
                                            title="Password is invalid"
                                            open={showInvalidPasswordTooltip}
                                            arrow
                                            placement="right"
                                        >
                                            <Tooltip
                                                title="Passwords must match"
                                                open={showMatchTooltip}
                                                arrow
                                                placement="left"
                                            >
                                                <input
                                                    className={`shadow appearance-none border ${darkMode ? "border-Light-L1 text-Dark-D1" : "border-Dark-D1 text-Dark-D1"} rounded-lg w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline`}
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
                                                        <EyeSlashIcon className="h-5 w-5 text-gray-400"/>
                                                    ) : (
                                                        <EyeIcon className="h-5 w-5 text-gray-400"/>
                                                    )}
                                                </button>
                                            </Tooltip>
                                        </Tooltip>

                                    </Tooltip>

                                </div>
                            </div>

                            <div className="flex flex-col items-center justify-center px-2">
                                <Tooltip
                                    title="Could not create user"
                                    open={showConfirmFirestoreTooltip}
                                    arrow
                                    placement="right"
                                >
                                    <button
                                        className={`${darkMode ? "bg-Dark-D2 text-primary-light hover:bg-primary-light hover:text-primary-dark" : "bg-primary-light text-primary-dark hover:bg-primary-dark hover:text-primary-light"} font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline w-full mt-4 transition-colors duration-300 `}
                                        aria-label="Sign Up"
                                        onClick={handleSignUpWithEmail}
                                    >
                                        Sign Up
                                    </button>
                                </Tooltip>


                                <p className={`text-sm my-4 ${darkMode ? "text-primary-light" : "text-primary-dark"}`}>
                                    Already have an account? <a href="/signIn" className="text-accent-blue">Sign in</a>
                                </p>

                                <div className="flex items-center w-full my-2">
                                    <hr className={`flex-grow border-t ${darkMode ? "border-Light-L1" : "border-Dark-D1"}`}/>
                                    <span
                                        className={`mx-4 ${darkMode ? "border-Light-L1 text-Light-L1" : "border-Dark-D1 text-Dark-D1"}`}>or</span>
                                    <hr className={`flex-grow border-t ${darkMode ? "border-Light-L1" : "border-Dark-D1"}`}/>
                                </div>

                                <button
                                    className={`${darkMode ? "bg-Dark-D2 text-primary-light hover:bg-primary-light hover:text-primary-dark" : "bg-primary-light text-primary-dark hover:bg-primary-dark hover:text-primary-light"} font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline w-full flex items-center justify-center transition-colors duration-300`}
                                    aria-label="Sign Up with Google"
                                    onClick={handleSignInWithGoogle}
                                >
                                    <img src="/google.svg" alt="Google logo" className="pr-0.5" width="24" height="24"/>
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
