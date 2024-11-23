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
    // const [eventLong, setEventLong] = useState(0);
    // const [eventLat, setEventLat] = useState(0);

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

    // useEffect(() => {
    //     if (isLoaded && eventPlaceId) {
    //         geocodePlaceId(eventPlaceId);
    //     }
    // }, [isLoaded, eventPlaceId]);
    //
    // const geocodePlaceId = async (placeId) => {
    //     try {
    //         const service = new google.maps.places.PlacesService(document.createElement('div'));
    //         const request = {
    //             placeId: placeId,
    //             fields: ['geometry'],
    //         };
    //
    //         service.getDetails(request, (place, status) => {
    //             if (status === google.maps.places.PlacesServiceStatus.OK) {
    //                 const location = place.geometry.location;
    //                 setEventLat(location.lat());
    //                 setEventLong(location.lng());
    //             } else {
    //                 console.error('Error geocoding place ID:', status);
    //             }
    //         });
    //     } catch (error) {
    //         console.error('Error geocoding place ID:', error);
    //     }
    // };

    // const { isLoaded, loadError } = useLoadScript({
    //     googleMapsApiKey: import.meta.env.VITE_GM_KEY,
    // });
    //
    // useEffect(() => {
    //     const fetchLocation = async () => {
    //         console.log("placeId",placeId);
    //         if (!placeId) return;
    //
    //         try {
    //             const response = await fetch(
    //                 `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&key=${import.meta.env.VITE_GM_KEY}`
    //             );
    //             const data = await response.json();
    //
    //             if (data.status === "OK") {
    //                 const locationData = data.result.geometry.location;
    //                 setLocation({
    //                     lat: locationData.lat,
    //                     lng: locationData.lng,
    //                 });
    //             } else {
    //                 console.error('Failed to get place details:', data.status);
    //             }
    //         } catch (error) {
    //             console.error('Error fetching place details:', error);
    //         }
    //     };
    //
    //     fetchLocation();
    // }, [placeId]);
    //
    // if (loadError) return <div>Error loading maps</div>;
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
