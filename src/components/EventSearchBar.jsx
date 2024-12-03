import React, { useState } from "react";

const EventSearchBar = ({ onEventSearch }) => {
    const [eventInput, setEventInput] = useState("");

    const handleInputChange = (e) => {
        setEventInput(e.target.value);
        if (onEventSearch) {
            onEventSearch(e.target.value); // Update the parent as the input changes
        }
    };

    return (
        <div className="relative w-full max-w-lg mx-auto">
            <input
                type="text"
                value={eventInput}
                onChange={handleInputChange}
                placeholder="Search for events..."
                className="w-full py-2 px-4 border rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
        </div>
    );
};

export default EventSearchBar;
