// import React, { useState, useEffect, useRef } from "react";
//
// const GeoSearchBar = ({ onGeoSearch, onClear }) => {
//     const [cityInput, setCityInput] = useState("");
//     const inputRef = useRef(null);
//     const autocompleteRef = useRef(null);
//
//     const debounce = (func, delay) => {
//         let timeout;
//         return (...args) => {
//             clearTimeout(timeout);
//             timeout = setTimeout(() => func(...args), delay);
//         };
//     };
//
//     const handlePlaceChange = () => {
//         if (!autocompleteRef.current) return;
//         const place = autocompleteRef.current.getPlace();
//         if (place.geometry) {
//             const newGeoLocation = {
//                 lat: place.geometry.location.lat(),
//                 lng: place.geometry.location.lng(),
//             };
//             setCityInput(place.formatted_address || "");
//             onGeoSearch && onGeoSearch(newGeoLocation);
//         }
//     };
//
//     const debouncedHandlePlaceChange = debounce(handlePlaceChange, 300);
//
//     const initAutocomplete = () => {
//         if (!window.google) {
//             console.error("Google Maps API not loaded!");
//             return;
//         }
//         if (inputRef.current && !autocompleteRef.current) {
//             autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current);
//             autocompleteRef.current.addListener("place_changed", debouncedHandlePlaceChange);
//         }
//     };
//
//     useEffect(() => {
//         if (!autocompleteRef.current) {
//             initAutocomplete();
//         }
//     }, []);
//
//     const handleKeyDown = (e) => {
//         if (e.key === "Backspace" && !cityInput.trim()) {
//             setCityInput("");
//             onClear && onClear();
//         }
//     };
//
//     return (
//         <div className="relative w-full">
//             <input
//                 type="text"
//                 ref={inputRef}
//                 value={cityInput}
//                 onChange={(e) => setCityInput(e.target.value)}
//                 onKeyDown={handleKeyDown}
//                 placeholder="Zipcode or City"
//                 className="w-full h-12 px-4 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring focus:ring-blue-300 focus:outline-none"
//             />
//         </div>
//     );
// };
//
// export default GeoSearchBar;

import React, {useState} from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import {googleMapsConfig} from "../locationConfig";

const GeoSearchBar = ({onGeoSearch}) => {
    const [cityInput, setCityInput] = useState(null);

    const handleLocationChange = (value) => {
        setCityInput(value);
        const placeId = value?.value?.place_id;

        if (placeId) {
            const service = new google.maps.places.PlacesService(document.createElement("div"));
            service.getDetails(
                {placeId, fields: ["geometry"]},
                (place, status) => {
                    if (status === google.maps.places.PlacesServiceStatus.OK) {
                        const location = place.geometry.location;
                        const newGeoLocation = {lat: location.lat(), lng: location.lng()};
                        if (onGeoSearch) {
                            onGeoSearch(newGeoLocation);
                        }
                    } else {
                        console.error("Failed to fetch location details:", status);
                    }
                }
            );
        }
    };

    return (
        <div className="relative w-full">
            {/*className="flex items-center space-x-4 p-6 bg-transparent relative"*/}
            <GooglePlacesAutocomplete
                apiKey={googleMapsConfig.apiKey}
                selectProps={{
                    value: cityInput,
                    onChange: handleLocationChange,
                    placeholder: "Zipcode or City",
                    className: "w-full h-12 px-4 text-gray-700 focus:ring focus:ring-blue-300 focus:outline-none",
                    styles: {
                        control: (provided) => ({
                            ...provided,
                            height: "3rem", // Ensure height matches h-12
                            padding: "0 1rem", // Match padding
                            border: "1px solid lightgray",
                            borderRadius: "0.5rem", // Rounded corners
                            backgroundColor: "white",
                            borderColor: "lightgray",
                            boxShadow: "none",

                        }),
                    },
                }}
            />
        </div>
    );
};

export default GeoSearchBar;