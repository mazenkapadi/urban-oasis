import { useState, useEffect } from "react";
import { GoogleMap, MarkerF, useLoadScript } from "@react-google-maps/api";

const containerStyle = {
  width: "50%",
  height: "500px",
};

const GoogleMapComponent = ({ placeId }) => {
    const [mapLoaded, setMapLoaded] = useState(false);
    const [location, setLocation] = useState({ lat: 0, lng: 0 });

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GM_KEY,
    });

    useEffect(() => {
        const fetchLocation = async () => {
            console.log("placeId",placeId);
            if (!placeId) return;

            try {
                const response = await fetch(
                    `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&key=${import.meta.env.VITE_GM_KEY}`
                );
                const data = await response.json();

                if (data.status === "OK") {
                    const locationData = data.result.geometry.location;
                    setLocation({
                        lat: locationData.lat,
                        lng: locationData.lng,
                    });
                } else {
                    console.error('Failed to get place details:', data.status);
                }
            } catch (error) {
                console.error('Error fetching place details:', error);
            }
        };

        fetchLocation();
    }, [placeId]);

    if (loadError) return <div>Error loading maps</div>;
    if (!isLoaded) return <div>Loading Maps...</div>;

    const handleMapLoad = () => {
        setMapLoaded(true);
    };

    const handleMapClick = () => {
        const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}&markers=${location.lat},${location.lng}`;
        window.open(googleMapsUrl, "_blank");
    };

    return (
        <div className="w-full h-[500px]">
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={location}
                zoom={12}
                onLoad={handleMapLoad}
                onClick={handleMapClick}
            >
                {mapLoaded && <MarkerF position={location} />}
            </GoogleMap>
        </div>
    );

};

export default GoogleMapComponent;
