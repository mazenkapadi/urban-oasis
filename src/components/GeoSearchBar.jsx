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
        <div className="relative w-full max-w-lg">
            <GooglePlacesAutocomplete
                apiKey={googleMapsConfig.apiKey}
                selectProps={{
                    value: cityInput,
                    onChange: handleLocationChange,
                    placeholder: "Zipcode or City",
                    styles: {
                        control: (provided) => ({
                            ...provided,
                            backgroundColor: "white",
                            borderColor: "lightgray",
                            boxShadow: "none",
                            borderRadius: "6px",
                            padding: "3px",
                            fontSize: "16px",
                        }),
                    },
                }}
            />
        </div>
    );
};

export default GeoSearchBar;
