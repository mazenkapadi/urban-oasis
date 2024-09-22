const CurrentWeather = ({ weatherData }) => {
  if (!weatherData || !weatherData.weather) {
    return <p>Oops! No weather data available</p>;
  }
  return (
    <div className="w-full max-w-md mt-6 bg-gray-100 text-[#2b2d42] p-6 rounded-lg shadow-lg text-center">
      <h2 className="text-2xl font-bold mb-4">{weatherData.name}</h2>
      <img
        src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
        alt={weatherData.weather[0].description}
        className="mx-auto mb-4"
      />
      <p className="text-lg">
        <span className="font-semibold">Temperature:</span>{" "}
        {weatherData.main.temp}°C
      </p>
      <p className="text-lg">
        <span className="font-semibold">Weather:</span>{" "}
        {weatherData.weather[0].description}
      </p>
      <p className="text-lg">
        <span className="font-semibold">Humidity:</span>{" "}
        {weatherData.main.humidity}%
      </p>
    </div>
  );
};

export default CurrentWeather;
