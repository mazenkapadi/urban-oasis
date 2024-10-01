import { useState, useEffect } from "react";

const LocationComponent = () => {
  const [city, setCity] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchCityName(latitude, longitude);
        },
        (err) => {
          setError(err.message);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, []);

  const fetchCityName = async (latitude, longitude) => {
    try {
      const apiKey = import.meta.env.VITE_GEO_API_KEY;
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`
      );
      const data = await response.json();
      if (data.results.length > 0) {
        const cityName =
          data.results[0].components.city ||
          data.results[0].components.town ||
          data.results[0].components.village;
        setCity(cityName || "Unknown location");
      }
    } catch (error) {
      setError("Failed to fetch city name.", error);
    }
  };

  return (
    <div className="p-2 bg-neutral-100 rounded-lg shadow-md">
      {city ? (
        <></>
      ) : (
        <h1 className="text-xs text-primary">Your Current Location</h1>
      )}
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : city ? (
        <p className="text-text text-xs">City: {city}</p>
      ) : (
        <p className="text-detail text-xs">...</p>
      )}
    </div>
  );
};

export default LocationComponent;
