import { useState } from "react";
import { GoogleMap, MarkerF, useLoadScript } from "@react-google-maps/api";

// Define the container styles for the map
const containerStyle = {
    width: "50%",
    height: "500px",
};

const GoogleMaps = ({latitude, longitude}) => {
    const [ mapLoaded, setMapLoaded ] = useState(false); // State to track if the map has fully loaded

    // Load the Google Maps script with the API key
    const {isLoaded, loadError} = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GM_KEY,
    });

    // Check if there's an error or the script is not loaded
    if (loadError) return <div >Error loading maps</div >;
    if (!isLoaded) return <div >Loading Maps...</div >;

    // Set the center of the map using the provided latitude and longitude
    const center = {
        lat: latitude || 0,
        lng: longitude || 0,
    };

    // Map load event handler
    const handleMapLoad = () => {
        setMapLoaded(true);
    };
    const handleMapClick = () => {
        const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&markers=${latitude},${longitude}`;
        window.open(googleMapsUrl, "_blank");
    };

    return (
        <div className="w-full h-[500px]" >
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={12}
                onLoad={handleMapLoad}
                onClick={handleMapClick} // Trigger when map loads
            >
                {mapLoaded && <MarkerF position={center} />}
            </GoogleMap >
        </div >
    );
};

export default GoogleMaps;
