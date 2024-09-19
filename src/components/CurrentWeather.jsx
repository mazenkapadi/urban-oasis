// import React from "react";

import { useEffect, useState } from "react";
const CurrentWeather = ({ city }) => {
  const [currentWeather, setCurrentWeather] = useState(null);
  // const [forecast, setForecast] = useState(null);

  const getCurrentWeather = async () => {
    await fetch(
      `${import.meta.env.VITE_WEATHER_API_URL}/current.json?key=${
        import.meta.env.VITE_WEATHER_API_KEY
      }&q=${city}
&aqi=no`
    )
      .then(async (response) => {
        // console.log(response);
        const weatherResponse = await response.json();
        console.log(weatherResponse);
        setCurrentWeather(weatherResponse);
      })
      .catch(console.log);
  };
  useEffect(() => {
    if (city) {
      getCurrentWeather();
    }
  }, [city]);

  if (!currentWeather) {
    return <div>Loading...</div>;
  }
  return (
    <div className="max-w-sm mx-auto bg-white shadow-md rounded-lg overflow-hidden">
      <div className="bg-blue-600 text-white p-4">
        <h2 className="text-2xl font-bold">{currentWeather.location.name}</h2>
        <p className="text-sm">{`${currentWeather.location.region}, ${currentWeather.location.country}`}</p>
        <p className="text-sm">{currentWeather.location.localtime}</p>
      </div>
      <div className="p-6">
        <div className="flex items-center justify-center space-x-4">
          <img
            src={`https:${currentWeather.current.condition.icon}`}
            alt={currentWeather.current.condition.text}
            className="w-12 h-12"
          />
          <div>
            <p className="text-4xl font-semibold">
              {currentWeather.current.temp_c}°C
            </p>
            <p className="text-lg">{currentWeather.current.condition.text}</p>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex justify-between">
            <span className="font-medium">Feels like:</span>
            <span>{currentWeather.current.feelslike_c}°C</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Humidity:</span>
            <span>{currentWeather.current.humidity}%</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Wind:</span>
            <span>
              {currentWeather.current.wind_kph} kph{" "}
              {currentWeather.current.wind_dir}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Gusts:</span>
            <span>{currentWeather.current.gust_kph} kph</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Pressure:</span>
            <span>{currentWeather.current.pressure_mb} mb</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;
