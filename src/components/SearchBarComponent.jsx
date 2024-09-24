import React, { useState } from "react";

const SearchBarComponent = () => {
    const [searchInput, setSearchInput] = useState("");
    const [searchDate, setSearchDate] = useState("");
    const [zipcode, setZipcode] = useState("");

    const handleSearch = () => {
        console.log("Searching for:", searchInput, "on date:", searchDate, "in zipcode:", zipcode);
    };

    const handleZipcodeChange = (e) => {
        const value = e.target.value;
        // Allow only numbers and restrict length to 5 digits
        if (/^\d{0,5}$/.test(value)) {
            setZipcode(value);
        }
    };

    return (
        <div className="flex items-center space-x-4 rounded-lg p-4">
            {/* Zipcode Input */}
            <div className="flex items-center bg-white rounded-lg px-4 py-2">
                <input
                    id="zipcode"
                    type="text"
                    placeholder="Zipcode"
                    value={zipcode}
                    onChange={handleZipcodeChange}
                    className="bg-transparent border-none outline-none text-gray-700 w-24 text-center"
                />
            </div>

            {/* Date Picker */}
            <div className="flex items-center bg-white rounded-lg px-4 py-2">
                <input
                    id="date"
                    type="date"
                    value={searchDate}
                    onChange={(e) => setSearchDate(e.target.value)}
                    className="bg-transparent border-none outline-none text-gray-700 text-center"
                />
            </div>

            {/* Search Input */}
            <div className="flex-grow">
                <input
                    id="searchInput"
                    type="text"
                    placeholder="Search events"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="w-full p-2 rounded-lg outline-none bg-white text-gray-700"
                />
            </div>

            {/* Search Button */}
            <button
                id="searchButton"
                className="bg-red-500 text-white rounded-lg px-6 py-2 hover:bg-red-600 transition-all"
                onClick={handleSearch}
            >
                Search
            </button>
        </div>
    );
};

export default SearchBarComponent;
