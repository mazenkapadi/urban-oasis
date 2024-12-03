import React, { useState, useEffect, useRef } from "react";
import { googleMapsConfig } from "../locationConfig";

const GeoSearchBar = ({ onGeoSearch, onClear }) => {
    const [cityInput, setCityInput] = useState("");
    const inputRef = useRef(null); // Reference to the input field
    const autocompleteRef = useRef(null); // Reference to the autocomplete object
    const autocompleteListener = useRef(null); // Reference to the event listener

    // Initialize the autocomplete object
    const initAutocomplete = () => {
        if (autocompleteRef.current) {
            // Remove previous listeners
            google.maps.event.removeListener(autocompleteListener.current);
        }

        // Initialize a new autocomplete object
        autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current);
        autocompleteListener.current = google.maps.event.addListener(
            autocompleteRef.current,
            "place_changed",
            handlePlaceChange
        );
    };

    // Handle the place selection
    const handlePlaceChange = () => {
        const place = autocompleteRef.current.getPlace();
        if (place.geometry) {
            const newGeoLocation = {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
            };
            setCityInput(place.formatted_address); // Update the displayed value
            onGeoSearch && onGeoSearch(newGeoLocation); // Notify parent of the new geoLocation
        }
    };

    // Handle backspace to clear the input field and reset filters
    const handleKeyDown = (e) => {
        if (e.key === "Backspace" && !cityInput.trim()) {
            // Clear the input field and reset the autocomplete object
            setCityInput("");
            google.maps.event.removeListener(autocompleteListener.current); // Remove listener
            initAutocomplete(); // Reinitialize autocomplete
            onClear && onClear(); // Notify parent to clear filters
        }
    };

    // Initialize autocomplete on mount
    useEffect(() => {
        if (inputRef.current) {
            initAutocomplete();
        }
        // Cleanup on unmount
        return () => {
            if (autocompleteListener.current) {
                google.maps.event.removeListener(autocompleteListener.current);
            }
        };
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
