import React from 'react';
import PropTypes from 'prop-types';

const UserPreferences = ({ preferences, togglePreference }) => {
    return (
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
                                className="mr-2 bg-gray-800"
                            />
                            Stay updated on the latest UrbanOasis features, announcements, and special offers curated just for you.
                        </label>
                        <label className="block">
                            <input
                                type="checkbox"
                                checked={preferences.attendingEvents.requests}
                                onChange={() => togglePreference('attendingEvents', 'requests')}
                                className="mr-2 bg-gray-800"
                            />
                            Requests for additional information on an event after you have attended
                        </label>
                        <label className="block">
                            <input
                                type="checkbox"
                                checked={preferences.attendingEvents.unsubscribe}
                                onChange={() => togglePreference('attendingEvents', 'unsubscribe')}
                                className="mr-2 bg-gray-800"
                            />
                            Unsubscribe from all UrbanOasis newsletters and updates for attendees
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
                                className="mr-2 bg-gray-800"
                            />
                            When friends buy tickets or register for events near me
                        </label>
                        <label className="block">
                            <input
                                type="checkbox"
                                checked={preferences.notifications.organizer}
                                onChange={() => togglePreference('notifications', 'organizer')}
                                className="mr-2 bg-gray-800"
                            />
                            Receive updates when your favorite hosts announce a new event
                        </label>
                        <label className="block">
                            <input
                                type="checkbox"
                                checked={preferences.notifications.collections}
                                onChange={() => togglePreference('notifications', 'collections')}
                                className="mr-2 bg-gray-800"
                            />
                            Reminders about the events you have RSVP'd
                        </label>
                        <label className="block">
                            <input
                                type="checkbox"
                                checked={preferences.notifications.onsales}
                                onChange={() => togglePreference('notifications', 'onsales')}
                                className="mr-2 bg-gray-800"
                            />
                            Reminders about event onsales
                        </label>
                        <label className="block">
                            <input
                                type="checkbox"
                                checked={preferences.notifications.likedEvents}
                                onChange={() => togglePreference('notifications', 'likedEvents')}
                                className="mr-2 bg-gray-800"
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
                                className="mr-2 bg-gray-800"
                            />
                            Updates about new UrbanOasis features and announcements for hosts
                        </label>
                        <label className="block">
                            <input
                                type="checkbox"
                                checked={preferences.organizingEvents.tips}
                                onChange={() => togglePreference('organizingEvents', 'tips')}
                                className="mr-2 bg-gray-800"
                            />
                            Monthly tips and tools for hosting events
                        </label>
                        <label className="block">
                            <input
                                type="checkbox"
                                checked={preferences.organizingEvents.recap}
                                onChange={() => togglePreference('organizingEvents', 'recap')}
                                className="mr-2 bg-gray-800"
                            />
                            Event Sales Recap
                        </label>
                        <label className="block">
                            <input
                                type="checkbox"
                                checked={preferences.organizingEvents.unsubscribe}
                                onChange={() => togglePreference('organizingEvents', 'unsubscribe')}
                                className="mr-2 bg-gray-800"
                            />
                            Unsubscribe from all UrbanOasis newsletters and updates for hosts
                        </label>
                        <label className="block">
                            <input
                                type="checkbox"
                                checked={preferences.organizingEvents.reminders}
                                onChange={() => togglePreference('organizingEvents', 'reminders')}
                                className="mr-2 bg-gray-800"
                            />
                            Important reminders for my upcoming events
                        </label>
                        <label className="block">
                            <input
                                type="checkbox"
                                checked={preferences.organizingEvents.confirmations}
                                onChange={() => togglePreference('organizingEvents', 'confirmations')}
                                className="mr-2 bg-gray-800"
                            />
                            Order confirmations from my attendees
                        </label>
                    </div>
                </div>

                {/* Save Preferences Button */}
                <button
                    id="save_preferences_button"
                    onClick={() => alert('Preferences saved!')}
                    className="bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition w-1/2 max-w-xs"
                >
                    Save Preferences
                </button>
            </form>
        </div>
    );
};

// Add PropTypes validation
UserPreferences.propTypes = {
    preferences: PropTypes.shape({
        attendingEvents: PropTypes.shape({
            updates: PropTypes.bool.isRequired,
            requests: PropTypes.bool.isRequired,
            unsubscribe: PropTypes.bool.isRequired,
        }).isRequired,
        notifications: PropTypes.shape({
            tickets: PropTypes.bool.isRequired,
            organizer: PropTypes.bool.isRequired,
            collections: PropTypes.bool.isRequired,
            onsales: PropTypes.bool.isRequired,
            likedEvents: PropTypes.bool.isRequired,
        }).isRequired,
        organizingEvents: PropTypes.shape({
            updates: PropTypes.bool.isRequired,
            tips: PropTypes.bool.isRequired,
            recap: PropTypes.bool.isRequired,
            unsubscribe: PropTypes.bool.isRequired,
            reminders: PropTypes.bool.isRequired,
            confirmations: PropTypes.bool.isRequired,
        }).isRequired,
    }).isRequired,
    togglePreference: PropTypes.func.isRequired,
};

export default UserPreferences;
