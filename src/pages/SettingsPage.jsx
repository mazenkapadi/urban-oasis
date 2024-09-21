import React, { useState } from 'react';

const SettingsPage = () => {
    const [email, setEmail] = useState('kittymeow@gmail.com');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newEmail, setNewEmail] = useState('');
    const [password, setPassword] = useState('');
    const [preferences, setPreferences] = useState({
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

    const handleEmailChange = () => {
        alert(`Email changed to ${newEmail}`);
        setIsModalOpen(false);
    };

    const handlePasswordChange = () => {
        alert('Password has been set/changed');
    };

    const handlePreferencesSave = () => {
        alert('Preferences saved!');
    };

    const handleAccountClosure = () => {
        alert("Account has been closed. We're sorry to see you go.");
    };

    const togglePreference = (category, key) => {
        setPreferences((prev) => ({
            ...prev,
            [category]: {
                ...prev[category],
                [key]: !prev[category][key],
            },
        }));
    };

    const buttonClass = "bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition w-1/2 max-w-xs";

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 space-y-8">
                {/* Change Email Section */}
                <div>
                    <h2 className="text-xl font-bold mb-4">Change Email</h2>
                    <div className="flex items-center space-x-4">
                        <div>
                            <label className="block text-gray-700">Account Email Address</label>
                            <p className="text-gray-800">{email}</p>
                        </div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className={buttonClass}
                        >
                            Change
                        </button>
                    </div>
                </div>

                {/* Set/Change Password Section */}
                <div>
                    <h2 className="text-xl font-bold mb-4">Set Password</h2>
                    <div className="flex flex-col space-y-4">
                        <p className="text-gray-600">A password has not been set for your account.</p>
                        <input
                            type="password"
                            placeholder="Enter new password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="border border-gray-300 rounded-md p-2"
                        />
                        <button
                            onClick={handlePasswordChange}
                            className={buttonClass}
                        >
                            Set Password
                        </button>
                    </div>
                </div>

                {/* Email Preferences Section */}
                <div>
                    <h2 className="text-xl font-bold mb-4">Email Preferences</h2>
                    <form className="space-y-6">
                        {/* Attending Events */}
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Attending Events</h3>
                            <div className="space-y-2">
                                <label className="block">
                                    <input
                                        type="checkbox"
                                        checked={preferences.attendingEvents.updates}
                                        onChange={() => togglePreference('attendingEvents', 'updates')}
                                        className="mr-2"
                                    />
                                    Stay updated on the latest UrbanOasis features, announcements, and special offers curated just for you.
                                </label>
                                <label className="block">
                                    <input
                                        type="checkbox"
                                        checked={preferences.attendingEvents.requests}
                                        onChange={() => togglePreference('attendingEvents', 'requests')}
                                        className="mr-2"
                                    />
                                    Requests for additional information on an event after you have attended
                                </label>
                                <label className="block">
                                    <input
                                        type="checkbox"
                                        checked={preferences.attendingEvents.unsubscribe}
                                        onChange={() => togglePreference('attendingEvents', 'unsubscribe')}
                                        className="mr-2"
                                    />
                                    Unsubscribe from all UrbanOasis' newsletters and updates for attendees
                                </label>
                            </div>
                        </div>

                        {/* Notifications */}
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Notifications</h3>
                            <div className="space-y-2">
                                <label className="block">
                                    <input
                                        type="checkbox"
                                        checked={preferences.notifications.tickets}
                                        onChange={() => togglePreference('notifications', 'tickets')}
                                        className="mr-2"
                                    />
                                    When friends buy tickets or register for events near me
                                </label>
                                <label className="block">
                                    <input
                                        type="checkbox"
                                        checked={preferences.notifications.organizer}
                                        onChange={() => togglePreference('notifications', 'organizer')}
                                        className="mr-2"
                                    />
                                    Receive updates when your favorite hosts announces a new event
                                </label>
                                <label className="block">
                                    <input
                                        type="checkbox"
                                        checked={preferences.notifications.collections}
                                        onChange={() => togglePreference('notifications', 'collections')}
                                        className="mr-2"
                                    />
                                    Reminders about the events you have RSVP'd
                                </label>
                                <label className="block">
                                    <input
                                        type="checkbox"
                                        checked={preferences.notifications.onsales}
                                        onChange={() => togglePreference('notifications', 'onsales')}
                                        className="mr-2"
                                    />
                                    Reminders about event onsales
                                </label>
                                <label className="block">
                                    <input
                                        type="checkbox"
                                        checked={preferences.notifications.likedEvents}
                                        onChange={() => togglePreference('notifications', 'likedEvents')}
                                        className="mr-2"
                                    />
                                    Reminders about events I've liked
                                </label>
                            </div>
                        </div>

                        {/* Organizing Events */}
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Hosting Events</h3>
                            <div className="space-y-2">
                                <label className="block">
                                    <input
                                        type="checkbox"
                                        checked={preferences.organizingEvents.updates}
                                        onChange={() => togglePreference('organizingEvents', 'updates')}
                                        className="mr-2"
                                    />
                                    Updates about new UrbanOasis features and announcements for hosts
                                </label>
                                <label className="block">
                                    <input
                                        type="checkbox"
                                        checked={preferences.organizingEvents.tips}
                                        onChange={() => togglePreference('organizingEvents', 'tips')}
                                        className="mr-2"
                                    />
                                    Monthly tips and tools for hosting events
                                </label>
                                <label className="block">
                                    <input
                                        type="checkbox"
                                        checked={preferences.organizingEvents.recap}
                                        onChange={() => togglePreference('organizingEvents', 'recap')}
                                        className="mr-2"
                                    />
                                    Event Sales Recap
                                </label>
                                <label className="block">
                                    <input
                                        type="checkbox"
                                        checked={preferences.organizingEvents.unsubscribe}
                                        onChange={() => togglePreference('organizingEvents', 'unsubscribe')}
                                        className="mr-2"
                                    />
                                    Unsubscribe from all UrbanOasis newsletters and updates for hosts
                                </label>
                                <label className="block">
                                    <input
                                        type="checkbox"
                                        checked={preferences.organizingEvents.reminders}
                                        onChange={() => togglePreference('organizingEvents', 'reminders')}
                                        className="mr-2"
                                    />
                                    Important reminders for my upcoming events
                                </label>
                                <label className="block">
                                    <input
                                        type="checkbox"
                                        checked={preferences.organizingEvents.confirmations}
                                        onChange={() => togglePreference('organizingEvents', 'confirmations')}
                                        className="mr-2"
                                    />
                                    Order confirmations from my attendees
                                </label>
                            </div>
                        </div>

                        <button
                            onClick={handlePreferencesSave}
                            className={buttonClass}
                        >
                            Save Preferences
                        </button>
                    </form>
                </div>

                {/* Close Account Section */}
                <div>
                    <h2 className="text-xl font-bold mb-4">Close Account</h2>
                    <p className="text-gray-600 mb-4">You must have a password associated with your account prior to being able to close it.</p>
                    <button
                        onClick={handleAccountClosure}
                        className={buttonClass}
                    >
                        Close Account
                    </button>
                </div>
            </div>

            {/* Modal for Changing Email */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full relative">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                        >
                            &times;
                        </button>
                        <h3 className="text-xl font-bold mb-4">Change your email address</h3>
                        <div className="space-y-4">
                            <input
                                type="email"
                                placeholder="Email address"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                className="w-full border border-gray-300 rounded-md p-2"
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full border border-gray-300 rounded-md p-2"
                            />
                            <button
                                onClick={handleEmailChange}
                                className={buttonClass}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SettingsPage;
