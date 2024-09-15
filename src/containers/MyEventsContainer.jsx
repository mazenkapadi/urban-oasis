import React from 'react';

const MyEventsContainer = () => {
    const events = [
        'Event 1 - Date',
        'Event 2 - Date',
        'Event 3 - Date',
    ]; // Replace with Firestore fetch later

    return (
        <div className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-2">My Events</h2>
            <ul className="list-disc pl-5">
                {events.map((event, index) => (
                    <li key={index} className="text-gray-700">{event}</li>
                ))}
            </ul>
        </div>
    );
};

export default MyEventsContainer;
