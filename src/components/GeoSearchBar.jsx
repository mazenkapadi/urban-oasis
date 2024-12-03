import React, { useState } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { googleMapsConfig } from "../locationConfig";

const GeoSearchBar = ({ onGeoSearch }) => {
    const [cityInput, setCityInput] = useState(null);

    const handleLocationChange = (value) => {
        setCityInput(value);
        const placeId = value?.value?.place_id;

        if (placeId) {
            const service = new google.maps.places.PlacesService(document.createElement("div"));
            service.getDetails(
                { placeId, fields: ["geometry"] },
                (place, status) => {
                    if (status === google.maps.places.PlacesServiceStatus.OK) {
                        const location = place.geometry.location;
                        const newGeoLocation = { lat: location.lat(), lng: location.lng() };
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
        <div className="flex items-center space-x-4 p-6 bg-transparent relative">
            <GooglePlacesAutocomplete
                apiKey={googleMapsConfig.apiKey}
                selectProps={{
                    value: cityInput,
                    onChange: handleLocationChange,
                    placeholder: "Zipcode or City",
                    className: "text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-400 focus:outline-none", // Apply Tailwind classes
                    styles: {
                        control: (provided) => ({
                            ...provided,
                            backgroundColor: "white",
                            borderColor: "lightgray",
                            boxShadow: "none",
                            borderRadius: "6px",
                            padding: "3px",
                        }),
                    },
                }}
            />
        </div>
    );
};

export default GeoSearchBar;
