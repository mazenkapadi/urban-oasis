import React, { useState } from 'react';
import signIn from "../services/auth/signIn.js";
import LeftComponent from "../components/LeftComponent.jsx";

function SignInPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleSignInWithEmail = async () => {
        if (!email || !password) {
            setError('Email and password are required');
            return;
        }

        try {
            await signIn.signInWithEmail(email, password);
            setError(null);
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <>
            <div className="flex items-center w-screen">
                <LeftComponent />
                <div className="w-full h-screen bg-blue-800 p-4 flex items-center justify-center">
                    <div className="signInBox box-border rounded-lg bg-gray-900 p-6 flex items-center justify-center w-full max-w-sm md:max-w-md h-auto">
                        <div className="content w-full">
                            <h2 className="text-3xl font-bold text-white mb-6 px-2">Forgot Password</h2>
                            <div className="p-2">
                                <label className="block text-gray-300 pb-1" htmlFor="email">Email</label>
                                <input
                                    className="shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="email"
                                    type="email"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col items-center justify-center px-2">
                                <button
                                    className="bg-white text-black font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline w-full mt-4"
                                    aria-label="Sign In"
                                    onClick={handleSignInWithEmail}
                                >
                                    Send a Rest Link
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
