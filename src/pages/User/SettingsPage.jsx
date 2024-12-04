import React, { useState, useEffect } from 'react';
import { handleEmailChange } from '../../services/auth/UpdateEmail.js';
import PasswordReset from '../../services/auth/ResetPassword.js';
import { handleAccountClosure } from '../../services/auth/CloseAccount.js';
import UserPreferences from '../../components/User/UserPreferences.jsx';
import { auth } from '../../firebaseConfig.js';
import { useNavigate } from 'react-router-dom';
import themeManager from "../../utils/themeManager.jsx";

const SettingsPage = () => {
    const navigate = useNavigate();
    const [ currentEmail, setCurrentEmail ] = useState('');
    const [ isModalOpen, setIsModalOpen ] = useState(false);
    const [ newEmail, setNewEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ isPasswordResetSent, setIsPasswordResetSent ] = useState(false);
    const [ modalError, setModalError ] = useState('');
    const [ successMessage, setSuccessMessage ] = useState('');
    const [ preferences, setPreferences ] = useState({
        attendingEvents: {
            updates: false,
            requests: false,
            unsubscribe: false,
        },
        notifications: {
            tickets: false,
            organizer: false,
            collections: false,
            onsales: false,
            likedEvents: false,
        },
        organizingEvents: {
            updates: false,
            tips: false,
            recap: false,
            unsubscribe: false,
            reminders: false,
            confirmations: false,
        },
    });
    const [ darkMode, setDarkMode ] = useState(themeManager.isDarkMode);

    useEffect(() => {
        const handleThemeChange = (isDark) => setDarkMode(isDark);
        themeManager.addListener(handleThemeChange);

        return () => {
            themeManager.removeListener(handleThemeChange);
        };
    }, []);

    // Fetch the current email of the authenticated user
    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            setCurrentEmail(user.email);
        }
    }, []);

    // Handle Password Reset using the PasswordReset class
    const handlePasswordChange = async () => {
        try {
            const result = await PasswordReset.resetPassword(currentEmail); // Call the resetPassword method from PasswordReset class
            console.log(result.message); // Log the success message
            setIsPasswordResetSent(true); // Set the state to indicate email was sent
        } catch (error) {
            console.error(error.message); // Log any error that occurs during the process
        }
    };

    const handleAccountClosureClick = () => {
        handleAccountClosure(currentEmail, password, () => navigate('/')); // Navigate to main page after success
    };

    const closeModal = () => {
        setNewEmail('');
        setPassword('');
        setModalError(''); // Clear modal error
        setIsModalOpen(false); // Close modal
    };

    const buttonClass = "bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition w-1/2 max-w-xs";

    return (
        <div className={`p-8 ${darkMode ? "bg-Dark-D1 text-primary-light" : "bg-Light-L1 text-primary-dark"} min-h-screen`} >
            {/* Change Email Section */}
            <div className="space-y-8" >
                <div >
                    <h2 className="text-xl font-bold mb-4" >Change Email</h2 >
                    <div className="flex items-center space-x-4" >
                        <div >
                            <label className={`block ${darkMode ? "text-primary-light" : "text-primary-dark"}`} htmlFor="current_email" >Account Email Address</label >
                            <p id="current_email" >{currentEmail}</p >
                        </div >
                        <button
                            id="change_email_button"
                            onClick={() => setIsModalOpen(true)}
                            className={buttonClass}
                        >
                            Change
                        </button >
                    </div >
                </div >

                {/* Success message */}
                {successMessage && (
                    <div className="mt-4 text-green-500" id="success_message" >
                        {successMessage}
                    </div >
                )}

                {/* Change Password Section */}
                <div >
                    <h2 className="text-xl font-bold mb-4" >Change Password</h2 >
                    <div className="flex flex-col space-y-4" >
                        <p >Click below to receive an email to reset your password.</p >
                        <button
                            id="password_reset_button"
                            onClick={handlePasswordChange} // Using the PasswordReset class
                            className={buttonClass}
                        >
                            {isPasswordResetSent ? 'Resend Email' : 'Change Password'}
                        </button >
                    </div >
                </div >


                {/* User Preferences Component */}
                <UserPreferences preferences={preferences}
                                 togglePreference={(category, key) => setPreferences(prev => ({
                                     ...prev,
                                     [category]: {
                                         ...prev[category],
                                         [key]: !prev[category][key],
                                     },
                                 }))} />

                {/* Close Account Section */}
                <div >
                    <h2 className="text-xl font-bold mb-4" >**DANGER ZONE**</h2 >
                    <h2 className="text-xl font-bold mb-4 pl-1" >Close Account</h2 >
                    <button
                        id="close_account_button"
                        onClick={handleAccountClosureClick}
                        className="bg-red-600 hover:bg-red-800 text-white px-4 py-2 rounded-md  transition w-1/2 max-w-xs"
                    >
                        Close Account
                    </button >
                </div >
            </div >

            {/* Modal for Changing Email */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" >
                    <div className="bg-gray-800 rounded-lg shadow-lg p-8 max-w-md w-full relative" >
                        <button
                            id="modal_close_button"
                            onClick={closeModal}
                            className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                        >
                            &times;
                        </button >
                        <h3 className="text-xl font-bold mb-4 text-white" >Change your email address</h3 >
                        <div className="space-y-4" >
                            <input
                                id="new_email_input"
                                type="email"
                                placeholder="New email address"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                className="w-full border border-gray-600 rounded-md p-2 bg-gray-800 text-white"
                            />
                            <input
                                id="password_input"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full border border-gray-600 rounded-md p-2 bg-gray-800 text-white"
                            />
                            <button
                                id="save_email_button"
                                onClick={() => handleEmailChange(currentEmail, newEmail, password, setModalError, setSuccessMessage, closeModal)}
                                className={buttonClass}
                            >
                                Save
                            </button >

                            {/* Error message inside modal */}
                            {modalError && (
                                <div className="text-red-500 mt-2" id="modal_error_message" >
                                    {modalError}
                                </div >
                            )}
                        </div >
                    </div >
                </div >
            )}
        </div >
    );
};

export default SettingsPage;
