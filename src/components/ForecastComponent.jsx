import { useState, useEffect } from "react";

const ForecastComponent = ({ city, eventDate }) => {
  const [forecastData, setForecastData] = useState(null);
  const [filteredForecast, setFilteredForecast] = useState(null);
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

  const fetchWeather = async (city) => {
    if (!city) return;

    try {
      console.log("Fetching weather data...");

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
      );
      const forecastResponse = await response.json();
      setForecastData(forecastResponse);
      console.log(forecastResponse);
      const filteredData = forecastResponse.list.filter((forecast) => {
        const forecastDate = new Date(forecast.dt_txt).toLocaleDateString();
        const formattedEventDate = new Date(eventDate).toLocaleDateString();
        return forecastDate === formattedEventDate;
      });
      if (filteredData.length > 0) {
        setFilteredForecast(filteredData);
      } else {
        setFilteredForecast(null); // No forecast data for the event date
      }
    } catch (e) {
      console.error("Error fetching forecast data:", e);
      setForecastData(null);
    }
  };

  // useEffect to call fetchWeather when city changes
  useEffect(() => {
    if (city && eventDate) {
      fetchWeather(city);
    }
  }, [city, eventDate]);

  if (!filteredForecast) {
    return null; // Return null or a loading indicator
  }

  return (
    <div className="w-full mt-2 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-text-gray">Forecast</h2>
      <div className="flex overflow-x-auto space-x-4">
        {filteredForecast.map((forecast, index) => (
          <div
            key={index}
            className="bg-neutral-white p-4 rounded-lg min-w-[150px] flex-shrink-0"
          >
            <p className="text-neutral-black">
              {new Date(forecast.dt_txt).toLocaleString()}
            </p>
            <img
              src={`https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`}
              alt={forecast.weather[0].description}
              className="mx-auto"
            />
            <p className="text-neutral-black">{forecast.main.temp}°C</p>
            <p className="text-neutral-black">
              {forecast.weather[0].description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForecastComponent;
