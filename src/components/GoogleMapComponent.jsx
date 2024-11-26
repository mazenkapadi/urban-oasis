import {useState, useEffect} from "react";
import {GoogleMap, MarkerF, useJsApiLoader, useLoadScript} from "@react-google-maps/api";
import {googleMapsConfig} from "../locationConfig.js";

const containerStyle = {
    width: "100%",
    height: "100%",
};

const GoogleMapComponent = ({lat, lon}) => {
    const [mapLoaded, setMapLoaded] = useState(false);
    const [location, setLocation] = useState({ lat: 0, lng: 0 });


    useEffect(() => {
        setLocation({
            lat: lat,
            lng: lon,
        });
    }, [lat, lon]);


    const {isLoaded} = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: googleMapsConfig.apiKey,
        libraries: ['places'],
    });

    if (!isLoaded) return <div>Loading Maps...</div>;

    const handleMapLoad = () => {
        setMapLoaded(true);
    };

    const handleMapClick = () => {
        const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}&markers=${lat},${lon}`;
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
                {mapLoaded && <MarkerF position={location}/>}
            </GoogleMap>
        </div>
    );

};

export default GoogleMapComponent;
