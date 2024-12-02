import React, { useState } from "react";

const EventSearchBar = ({ onEventSearch }) => {
    const [eventInput, setEventInput] = useState("");

    const handleSearch = () => {
        if (onEventSearch) {
            onEventSearch(eventInput);
        }
    };

    return (
        <div className="relative w-full max-w-lg mx-auto">
            <input
                type="text"
                value={eventInput}
                onChange={(e) => setEventInput(e.target.value)}
                placeholder="Search for events..."
                className="w-full py-2 px-4 border rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            <button
                onClick={handleSearch}
                className="absolute right-0 top-0 bottom-0 bg-red-500 text-white px-4 rounded-r-lg hover:bg-red-600"
            >
                Search
            </button>
        </div>
    );
};

export default EventSearchBar;
