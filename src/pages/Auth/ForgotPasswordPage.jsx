import React, {useEffect, useState} from 'react';
import AuthLeftComponent from "../../components/AuthLeftComponent.jsx";
import { useNavigate } from "react-router-dom";
import PasswordReset from "../../services/auth/ResetPassword.js";
import themeManager from "../../utils/themeManager.jsx";

function ForgotPasswordPage() {

    const navigate = useNavigate();
    const [ email, setEmail ] = useState('');
    const [ loading, setLoading ] = useState(false);
    const [ darkMode, setDarkMode ] = useState(themeManager.isDarkMode);

    useEffect(() => {
        const handleThemeChange = (isDark) => setDarkMode(isDark);
        themeManager.addListener(handleThemeChange);

        return () => {
            themeManager.removeListener(handleThemeChange);
        };
    }, []);

    //TODO: Fix resetPasswordHandler

    const handleResetPassword = async () => {
        if (!email) {
            alert("Email is required")
            return
        }

        try {
            await PasswordReset.resetPassword(email);
            navigate('/signin');
        } catch (error) {
            console.error('Error resetting password', error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <div className="flex w-screen h-screen" >
                <div className="flex-[3]" >
                    <AuthLeftComponent />
                </div >

                <div className={`flex-[2] h-screen ${darkMode ? "bg-Dark-D2" : "bg-Light-L2"} p-4 flex items-center justify-center`} >
                    <div
                        className={`signInBox box-border rounded-lg ${darkMode ? "bg-primary-dark" : "bg-Light-L1"} p-6 flex items-center justify-center w-full max-w-sm md:max-w-md h-auto`} >
                        <div className="content w-full" >
                            <h2 className={`text-3xl font-bold pb-4 px-2 ${darkMode ? "text-primary-light" : "text-primary-dark"}`} >Forgot Password</h2 >
                            <div className="p-2" >
                                <label className={`block pb-10 ${darkMode ? "text-Light-L1" : "text-Dark-D1"}`} htmlFor="email" >If the email address you
                                    provided is associated with an account, you will receive a password reset email
                                    shortly. </label >
                                <input
                                    className={`shadow appearance-none border rounded w-full py-2 px-3 ${darkMode ? "border-Light-L1 text-Dark-D1" : "border-Dark-D1 text-Dark-D1"} leading-tight focus:outline-none focus:shadow-outline`}
                                    id="email"
                                    type="email"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div >
                            <div className="flex flex-col items-center justify-center px-2" >
                                <button
                                    className={`${darkMode ? "bg-Dark-D2 text-primary-light" : "bg-Light-L2 text-primary-dark"} font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline w-full mt-4 transition-colors duration-300 ease-in-out ${loading ? 'bg-Dark-D1' : 'hover:bg-Dark-D2 hover:text-primary-light'}`}
                                    aria-label="Sign In"
                                    onClick={handleResetPassword}
                                    disabled={loading}
                                >
                                    {loading ? 'Sending...' : 'Reset Password'}
                                </button >
                            </div >
                        </div >
                    </div >
                </div >
            </div >
        </>
    );
}

export default ForgotPasswordPage;
