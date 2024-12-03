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
        <div className="relative">
            <input
                type="text"
                value={eventInput}
                onChange={handleInputChange}
                placeholder="Search for events..."
                className="w-full"
            />
        </div>
    );
};

export default EventSearchBar;
