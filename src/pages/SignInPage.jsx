import { useState } from 'react';
import signIn from "../services/auth/signIn.js";
import AuthLeftComponent from "../components/AuthLeftComponent.jsx";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/16/solid/index.js";

function SignInPage() {
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ error, setError ] = useState(null);
    const [ showPassword, setShowPassword ] = useState(false);


    const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    }

    const validateEmail = (email) => EMAIL_REGEX.test(email);

    const handleSignInWithEmail = async () => {

        if (!email) {
            setError('Email is required');
            return;
        }

        if (!validateEmail(email)) {
            setError('Invalid email format');
            return;
        }

        if (!password) {
            setError('Password is required');
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

    return (
        <>
            <div className="flex items-center w-screen" >
                <AuthLeftComponent />
                <div className="w-2/3 h-screen bg-blue-800 p-4 flex items-center justify-center" >
                    <div
                        className="signInBox box-border rounded-lg bg-gray-900 p-6 flex items-center justify-center w-full max-w-sm md:max-w-md h-auto" >
                        <div className="content w-full" >
                            <h2 className="text-3xl font-bold text-white mb-6 px-2" >Sign In</h2 >

                            {error && <div className="text-red-500 text-sm p-2" >{error}</div >}

                            <div className="p-2" >
                                <label className="block text-gray-300 pb-1" htmlFor="email" >Email</label >
                                <input
                                    className="shadow appearance-none border border-gray-600 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="email"
                                    type="email"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div >

                            <div className="p-2" >
                                <div className="pb-1" >
                                    <div className="flex justify-between" >
                                        <label className="text-gray-300" htmlFor="password" >Password</label >
                                        <a href="/forgotPassword" className="text-sm text-blue-500" >Forgot your
                                            password?</a >
                                    </div >
                                </div >
                                <div className="relative" >
                                    <input
                                        // className="shadow appearance-none border border-gray-600 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        className="shadow appearance-none border border-gray-600 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10" // Add padding-right for the button
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button className="absolute right-3 top-2 text-sm text-black"
                                            onClick={toggleShowPassword}
                                    >
                                        {showPassword ? <EyeSlashIcon className="h-5 w-5" /> :
                                            <EyeIcon className="h-5 w-5" />}
                                    </button >
                                </div >
                            </div >

                            <div className="flex flex-col items-center justify-center px-2" >
                                <button
                                    className="bg-white text-black font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline w-full mt-4"
                                    aria-label="Sign In"
                                    onClick={handleSignInWithEmail}
                                >
                                    Sign In
                                </button >

                                <p className="text-sm text-gray-400 mt-4 mb-2" >
                                    Already have an account? <a href="/signUp" className="text-blue-500" >Sign Up</a >
                                </p >

                                <div className="flex items-center w-full mb-2 " >
                                    <hr className="flex-grow border-t border-gray-400" />
                                    <span className="mx-4 text-gray-400" >or</span >
                                    <hr className="flex-grow border-t border-gray-400" />
                                </div >

                                <button
                                    className="bg-white text-black font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline w-full flex items-center justify-center"
                                    aria-label="Sign In with Google"
                                    onClick={handleSignInWithGoogle}
                                >
                                    <img src="../../public/assets/google.svg" alt="Google logo" className="pr-0.5" width="24"
                                         height="24" />
                                    <p className="ml-2" >Sign In with Google</p >
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
