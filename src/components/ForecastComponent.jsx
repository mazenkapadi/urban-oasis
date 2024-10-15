import { useState, useEffect } from "react";

const ForecastComponent = ({ city, eventDate }) => {
  const [filteredForecast, setFilteredForecast] = useState(null);
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

  const fetchWeather = async (city) => {
    if (!city || !eventDate) return;

    try {
      console.log("Fetching weather data...");
      console.log("city", city);
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
      );
      const forecastResponse = await response.json();
      console.log(forecastResponse);

      const date = parseEventDate(eventDate);
      console.log("Parsed Event Date:", date);

      const formattedEventDate = formatDate(date);
      // console.log("Formatted Event Date:", formattedEventDate);
      const filteredData = forecastResponse.list.filter((forecast) => {
        // console.log("Formatted Event Date:", formattedEventDate);
        const dt_txt = new Date(forecast.dt_txt);
        const formattedDate = formatDate(dt_txt);
        // console.log("forecast.dt_txt:", formattedDate);
        // console.log(filteredData);
        return formattedDate === formattedEventDate; // Compare only the date part
      });

      if (filteredData.length > 0) {
        console.log("filteredData.length>0");

        const eventTime = date.getTime();
        console.log("eventTime:", eventTime);
        const nearestForecast = forecastResponse.list.reduce(
          (nearest, forecast) => {
            const forecastTime = new Date(forecast.dt_txt).getTime();
            console.log("forecastTime:", forecastTime);
            if (forecastTime <= eventTime) {
              // Only consider forecasts before the event time
              if (
                !nearest ||
                eventTime - forecastTime <
                  eventTime - new Date(nearest.dt_txt).getTime()
              ) {
                return forecast;
              }
            }
            return nearest;
          }
        );
        console.log("Filtered Forecast Data:", nearestForecast);
        setFilteredForecast(nearestForecast);
      } else {
        console.log("No forecast data for the event date.");
        setFilteredForecast(null); // No forecast data for the event date
      }
    } catch (e) {
      console.error("Error fetching forecast data:", e);
    }
  };

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
        {/* {filteredForecast.map((forecast, index) => ( */}
        <div
          // key={index}
          className="bg-neutral-white p-4 rounded-lg min-w-[150px] flex-shrink-0"
        >
          <p className="text-neutral-black">
            {new Date(filteredForecast.dt_txt).toLocaleString()}
          </p>
          <img
            src={`https://openweathermap.org/img/wn/${filteredForecast.weather[0].icon}@2x.png`}
            alt={filteredForecast.weather[0].description}
            className="mx-auto"
          />
          <p className="text-neutral-black">{filteredForecast.main.temp}°C</p>
          <p className="text-neutral-black">
            {filteredForecast.weather[0].description}
          </p>
        </div>
        {/* ))} */}
      </div>
    </div>
  );
};

export default ForecastComponent;

// To parse date from db format to weather format
const parseEventDate = (dt) => {
  const formattedDateString = dt.replace("UTC", "GMT").replace("at", "").trim();
  return new Date(formattedDateString);
};

// To convert the parsed date to match the forecast dates
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(date.getDate()).padStart(2, "0");
  // const hours = String(date.getHours()).padStart(2, "0");
  // const minutes = String(date.getMinutes()).padStart(2, "0");
  // const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day}`; // Format as YYYY-MM-DD for comparison
};
