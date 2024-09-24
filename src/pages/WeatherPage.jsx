
import { useState } from "react";
import SearchBar from "../components/WeatherSearchComponent";
import CurrentWeather from "../components/CurrentWeatherComponent";
import ForecastComponent from "../components/ForecastComponent";

const WeatherPage = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [error, setError] = useState("");

  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
  const fetchWeather = async (cityName) => {
    if (!cityName) return;

    try {
      console.log("Fetching weather data...");

      await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`
      )
        .then(async (response) => {
          const weatherResponse = await response.json();
          setWeatherData(weatherResponse);
          console.log(weatherResponse);
        })
        .catch((e) => {
          console.error("Error fetching weather data:", e);
          setError("Failed to fetch weather data.");
        });

      // Fetch forecast
      await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`
      )
        .then(async (response) => {
          const forecastResponse = await response.json();
          setForecastData(forecastResponse);
          setError("");
          console.log(forecastResponse);
        })
        .catch((e) => {
          console.error("Error fetching forecast data:", e);
          setError("Failed to fetch forecast data.");
        });
    } catch (err) {
      console.error(err);
      setError("City not found or invalid API request");
      setWeatherData(null);
      setForecastData(null);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-6">
        Current and Forecast Weather using Search
      </h1>

      {/* Search Bar Component */}
      <SearchBar setCity={setCity} fetchWeather={fetchWeather} />

      {/* Error Message */}
      {error && <p className="text-red-500 mt-4">{error}</p>}

      {/* Current Weather Component */}
      {weatherData && <CurrentWeather weatherData={weatherData} />}

      {/* Forecast Component */}
      {forecastData && <ForecastComponent forecastData={forecastData} />}
    </div>
  );
};

export default WeatherPage;
