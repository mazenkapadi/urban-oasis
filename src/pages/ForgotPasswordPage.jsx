import React, { useState } from 'react';
import AuthLeftComponent from "../components/AuthLeftComponent.jsx";
import { useNavigate } from "react-router-dom";

function SignInPage() {

    const navigate = useNavigate();
    const [ email, setEmail ] = useState('');
    const [ loading, setLoading ] = useState(false);

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
            <div className="flex items-center w-screen" >
                <AuthLeftComponent />
                <div className="w-full h-screen bg-blue-800 p-4 flex items-center justify-center" >
                    <div
                        className="signInBox box-border rounded-lg bg-gray-900 p-6 flex items-center justify-center w-full max-w-sm md:max-w-md h-auto" >
                        <div className="content w-full" >
                            <h2 className="text-3xl font-bold text-white pb-4 px-2" >Forgot Password</h2 >
                            <div className="p-2" >
                                <label className="block text-gray-300 pb-10" htmlFor="email" >If the email address you
                                    provided is associated with an account, you will receive a password reset email
                                    shortly. </label >
                                <input
                                    className="shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="email"
                                    type="email"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div >
                            <div className="flex flex-col items-center justify-center px-2" >
                                <button
                                    className="bg-white text-black font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline w-full mt-4 transition-colors duration-300 ease-in-out ${loading ? 'bg-gray-400' : 'hover:bg-black hover:text-white'}"
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

export default SignInPage;
