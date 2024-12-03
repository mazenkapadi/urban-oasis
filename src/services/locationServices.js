import { googleMapsConfig } from "../locationConfig.js";

export const fetchCitySuggestions = async (input) => {
    const API_URL = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
        input
    )}&key=${googleMapsConfig.apiKey}&language=${googleMapsConfig.language}&region=${googleMapsConfig.region}&types=${googleMapsConfig.types}`;

    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Failed to fetch city suggestions.");
        const data = await response.json();
        return data.predictions || [];
    } catch (error) {
        console.error("Error fetching city autocomplete suggestions:", error);
        return [];
    }
};

export const geocodeCityToLatLng = async (placeId) => {
    const API_URL = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${googleMapsConfig.apiKey}`;

    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Failed to fetch geocode data.");
        const data = await response.json();
        if (data.result && data.result.geometry) {
            const { lat, lng } = data.result.geometry.location;
            return { lat, lng };
        }
        return null;
    } catch (error) {
        console.error("Error fetching geocode data:", error);
        return null;
    }
};
