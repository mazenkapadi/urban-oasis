import React, {useEffect, useState} from 'react';
import themeManager from "../../utils/themeManager.jsx";

const HostEventCard = ({ event, status }) => {
    const {
        basicInfo: { title: eventName },
        eventDetails: { eventDateTime, capacity },
        attendeesCount,
    } = event;
    const [ darkMode, setDarkMode ] = useState(themeManager.isDarkMode);

    useEffect(() => {
        const handleThemeChange = (isDark) => setDarkMode(isDark);
        themeManager.addListener(handleThemeChange);

        return () => {
            themeManager.removeListener(handleThemeChange);
        };
    }, []);

    const statusText = status === 'Future' ? 'Future Event' : 'Past Event';
    const statusBgColor = status === 'Future' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';
    const cardBgColor = darkMode ? 'bg-Dark-D2' : 'bg-Light-L2';


    return (
        <div className={`relative shadow-md hover:shadow-lg transition-shadow duration-200 rounded-lg p-4 ${cardBgColor} max-w-md mx-auto`}>
            <span className={`absolute top-2 right-2 px-2 py-0.5 rounded text-xs font-medium ${statusBgColor}`}>
                {statusText}
            </span>

            <h3 className={`text-lg font-semibold truncate ${darkMode ? "text-primary-light" : "text-primary-dark"}`}>{eventName}</h3>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-3 space-y-1 sm:space-y-0">
                <p className={`${darkMode ? "text-Light-L1" : "text-Dark-D1"}`}>
                    Attendees: <span className="font-medium">{attendeesCount || 0}</span> / {capacity || 'Unlimited'}
                </p>
                <p className={`${darkMode ? "text-Light-L1" : "text-Dark-D1"} sm:ml-4`}>
                    Date: <span className="font-medium">{new Date(eventDateTime.toDate()).toLocaleDateString()}</span>
                </p>
            </div>
        </div>
    );
};

export default HostEventCard;
