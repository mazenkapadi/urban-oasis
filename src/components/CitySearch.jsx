import React, { useState } from "react";
import { fetchCitySuggestions } from "../services/locationServices";

const CitySearch = ({ onCitySelect }) => {
    const [input, setInput] = useState("");
    const [suggestions, setSuggestions] = useState([]);

    const handleInputChange = async (e) => {
        setInput(e.target.value);
        if (e.target.value) {
            const results = await fetchCitySuggestions(e.target.value);
            setSuggestions(results);
        } else {
            setSuggestions([]);
        }
    };

    const handleCitySelect = (suggestion) => {
        setInput(suggestion.description);
        setSuggestions([]);
        if (onCitySelect) {
            onCitySelect(suggestion);
        }
    };

    return (
        <div>
            <input
                type="text"
                value={input}
                onChange={handleInputChange}
                placeholder="Enter city"
                className="border rounded px-4 py-2"
            />
            <ul className="absolute bg-white shadow rounded mt-2 w-full">
                {suggestions.map((suggestion) => (
                    <li
                        key={suggestion.place_id}
                        className="p-2 cursor-pointer hover:bg-gray-200"
                        onClick={() => handleCitySelect(suggestion)}
                    >
                        {suggestion.description}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CitySearch;
