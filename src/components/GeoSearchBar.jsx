import React, { useState, useEffect, useRef } from "react";

const GeoSearchBar = ({ onGeoSearch, onClear }) => {
    const [cityInput, setCityInput] = useState("");
    const inputRef = useRef(null); // Reference to the input field
    const autocompleteRef = useRef(null); // Reference to the autocomplete object

    // Initialize the autocomplete object
    const initAutocomplete = () => {
        if (!window.google) {
            console.error("Google Maps API not loaded!");
            return;
        }
        if (inputRef.current) {
            autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current);
            autocompleteRef.current.addListener("place_changed", handlePlaceChange);
        }
    };

    // Handle the place selection
    const handlePlaceChange = () => {
        if (!autocompleteRef.current) return;
        const place = autocompleteRef.current.getPlace();
        if (place.geometry) {
            const newGeoLocation = {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
            };
            setCityInput(place.formatted_address || ""); // Update the displayed value
            onGeoSearch && onGeoSearch(newGeoLocation); // Notify parent
        }
    };

    // Handle backspace to clear the input field and reset filters
    const handleKeyDown = (e) => {
        if (e.key === "Backspace" && !cityInput.trim()) {
            setCityInput("");
            onClear && onClear(); // Notify parent to clear filters
        }
    };

    // Initialize autocomplete on mount
    useEffect(() => {
        initAutocomplete();
    }, []);

    return (
        <div className="relative w-full">
            <input
                type="text"
                ref={inputRef}
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                onKeyDown={handleKeyDown} // Handle backspace
                placeholder="Zipcode or City"
                className="w-full h-12 px-4 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring focus:ring-blue-300 focus:outline-none"
            />
        </div>
    );
};

export default GeoSearchBar;