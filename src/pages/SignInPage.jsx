import React, { useState } from "react";
import signIn from "../services/auth/signIn";
import PasswordReset from "../services/auth/ResetPassword.js";


function SignInPage() {
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    // const [ resetEmail, setResetEmail ] = useState('');
    const [ error, setError ] = useState(null);

    const handleSignInWithEmail = async () => {
        if (!email && !password) {
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

    const handleSignInWithGoogle = async () => {
        try {
            await signIn.signInWithGoogle();
            setError(null);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleForgotPassword = async () => {
        try {
            await PasswordReset.resetPassword(email);
            setError(null);
        } catch (error) {
            setError(error.message);
        }
    }

    // const handleForgotPassword = async () => {
    //     if (!email) {
    //         setError('sPlease enter an email associated with your account');
    //         return;
    //     }
    //     try {
    //         await passwordReset.resetPassword(email);
    //         setError(null);
    //     } catch (error) {
    //         setError(error.message);
    //     }
    // };

    return (
        <>
            <div className="flex flex-col h-screen bg-gray-500" >
                <div className="bg-green-200 p-8 m-4 rounded-lg text-center" >
                    Welcome to Farmingdale!
                </div >
                <div className="bg-yellow-200 p-8 m-4 rounded-lg text-center" >
                    We would like to have you over soon!
                </div >
            </div >
        </>
    )
}


export default SignInPage;
