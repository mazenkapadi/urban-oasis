import React, { useState, useEffect, useRef } from "react";

const GeoSearchBar = ({ onGeoSearch, onClear }) => {
    const [cityInput, setCityInput] = useState("");
    const inputRef = useRef(null);
    const autocompleteRef = useRef(null);

    const debounce = (func, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), delay);
        };
    };

    const handlePlaceChange = () => {
        if (!autocompleteRef.current) return;
        const place = autocompleteRef.current.getPlace();
        if (place.geometry) {
            const newGeoLocation = {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
            };
            setCityInput(place.formatted_address || "");
            onGeoSearch && onGeoSearch(newGeoLocation);
        }
    };

    const debouncedHandlePlaceChange = debounce(handlePlaceChange, 300);

    const initAutocomplete = () => {
        if (!window.google) {
            console.error("Google Maps API not loaded!");
            return;
        }
        if (inputRef.current && !autocompleteRef.current) {
            autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current);
            autocompleteRef.current.addListener("place_changed", debouncedHandlePlaceChange);
        }
    };

    useEffect(() => {
        if (!autocompleteRef.current) {
            initAutocomplete();
        }
    }, []);

    const handleKeyDown = (e) => {
        if (e.key === "Backspace" && !cityInput.trim()) {
            setCityInput("");
            onClear && onClear();
        }
    };

    return (
        <div className="relative w-full">
            <input
                type="text"
                ref={inputRef}
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Zipcode or City"
                className="w-full h-12 px-4 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring focus:ring-blue-300 focus:outline-none"
            />
        </div>
    );
};

export default GeoSearchBar;
