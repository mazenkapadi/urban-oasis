import React from 'react';

const HostEventCard = ({ event, status }) => {
    const {
        basicInfo: { title: eventName },
        eventDetails: { eventDateTime, capacity },
        attendeesCount,
    } = event;

    const statusText = status === 'Future' ? 'Future Event' : 'Past Event';
    const statusBgColor = status === 'Future' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';
    const cardBgColor = status === 'Future' ? 'bg-white' : 'bg-gray-50';

    return (
        <div className={`relative shadow-md hover:shadow-lg transition-shadow duration-200 rounded-lg p-4 ${cardBgColor} max-w-md mx-auto`}>
            {/* Status Badge positioned at the top right */}
            <span className={`absolute top-2 right-2 px-2 py-0.5 rounded text-xs font-medium ${statusBgColor}`}>
                {statusText}
            </span>

            <h3 className="text-lg font-semibold text-gray-800 truncate">{eventName}</h3>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-3 space-y-1 sm:space-y-0">
                <p className="text-gray-600">
                    Attendees: <span className="font-medium">{attendeesCount || 0}</span> / {capacity || 'Unlimited'}
                </p>
                <p className="text-gray-600 sm:ml-4">
                    Date: <span className="font-medium">{new Date(eventDateTime.toDate()).toLocaleDateString()}</span>
                </p>
            </div>
        </div>
    );
};

export default HostEventCard;
