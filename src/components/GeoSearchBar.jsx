import { useState } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { googleMapsConfig } from "../locationConfig";

const GeoSearchBar = ({onGeoSearch}) => {
    const [ cityInput, setCityInput ] = useState(null);

    const handleLocationChange = (value) => {
        setCityInput(value);
        const placeId = value?.value?.place_id;

        if (placeId) {
            const service = new google.maps.places.PlacesService(document.createElement("div"));
            service.getDetails(
                {placeId, fields: [ "geometry" ]},
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
        <div className="relative w-full" >
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
                            height: "3rem",
                            padding: "0 1rem",
                            border: "1px solid lightgray",
                            borderRadius: "0.5rem",
                            backgroundColor: "white",
                            borderColor: "lightgray",
                            boxShadow: "none",

                        }),
                    },
                }}
            />
        </div >
    );
};

export default GeoSearchBar;