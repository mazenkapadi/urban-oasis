import PropTypes from 'prop-types';

const UserPreferences = ({preferences, togglePreference}) => {
    return (
        <div >
            <h2 className="text-xl font-bold mb-4" >Email Preferences</h2 >
            <form className="space-y-6" >
                {/* Attending Events */}
                <div >
                    <h3 className="text-lg font-semibold mb-2" >Attending Events</h3 >
                    <div className="space-y-2" >
                        <label className="flex items-center" >
                            <input
                                type="checkbox"
                                checked={preferences.attendingEvents.updates}
                                onChange={() => togglePreference('attendingEvents', 'updates')}
                                className="mr-2"
                            />
                            Receive updates and announcements for attendees
                        </label >
                        <label className="flex items-center" >
                            <input
                                type="checkbox"
                                checked={preferences.attendingEvents.unsubscribe}
                                onChange={() => togglePreference('attendingEvents', 'unsubscribe')}
                                className="mr-2"
                            />
                            Unsubscribe from all updates
                        </label >
                    </div >
                </div >

                {/* Notifications */}
                <div >
                    <h3 className="text-lg font-semibold mb-2" >Notifications</h3 >
                    <div className="space-y-2" >
                        <label className="flex items-center" >
                            <input
                                type="checkbox"
                                checked={preferences.notifications.tickets}
                                onChange={() => togglePreference('notifications', 'tickets')}
                                className="mr-2"
                            />
                            Alerts about friends’ activity and events near me
                        </label >
                        <label className="flex items-center" >
                            <input
                                type="checkbox"
                                checked={preferences.notifications.organizer}
                                onChange={() => togglePreference('notifications', 'organizer')}
                                className="mr-2"
                            />
                            Updates from favorite hosts
                        </label >
                        <label className="flex items-center" >
                            <input
                                type="checkbox"
                                checked={preferences.notifications.reminders}
                                onChange={() => togglePreference('notifications', 'reminders')}
                                className="mr-2"
                            />
                            Event reminders (RSVPs, liked events, and onsales)
                        </label >
                    </div >
                </div >

                {/* Hosting Events */}
                <div >
                    <h3 className="text-lg font-semibold mb-2" >Hosting Events</h3 >
                    <div className="space-y-2" >
                        <label className="flex items-center" >
                            <input
                                type="checkbox"
                                checked={preferences.organizingEvents.updates}
                                onChange={() => togglePreference('organizingEvents', 'updates')}
                                className="mr-2"
                            />
                            Updates for event hosts
                        </label >
                        <label className="flex items-center" >
                            <input
                                type="checkbox"
                                checked={preferences.organizingEvents.reminders}
                                onChange={() => togglePreference('organizingEvents', 'reminders')}
                                className="mr-2"
                            />
                            Important reminders for hosting events
                        </label >
                        <label className="flex items-center" >
                            <input
                                type="checkbox"
                                checked={preferences.organizingEvents.unsubscribe}
                                onChange={() => togglePreference('organizingEvents', 'unsubscribe')}
                                className="mr-2"
                            />
                            Unsubscribe from all hosting notifications
                        </label >
                    </div >
                </div >

                {/* Save Preferences Button */}
                <button
                    id="save_preferences_button"
                    onClick={(e) => {
                        e.preventDefault();
                        alert('Preferences saved!');
                    }}
                    className="bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition w-1/2 max-w-xs"
                >
                    Save Preferences
                </button >
            </form >

        </div >
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
