const ForecastComponent = ({ forecastData }) => {
  if (!forecastData || !forecastData.list) {
    return <p>Oops! No forecast data available for that country</p>;
  }
  return (
    <div className="w-full mt-6 p-6 rounded-lg ">
      <h2 className="text-2xl font-bold mb-4">Forecast</h2>
      <div className="flex overflow-x-auto space-x-4 ">
        {forecastData.list.map((forecast, index) => (
          <div
            key={index}
            className="bg-gray-100 p-4 rounded-lg min-w-[150px] flex-shrink-0"
          >
            <p>{new Date(forecast.dt_txt).toLocaleString()}</p>
            <img
              src={`https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`}
              alt={forecast.weather[0].description}
              className="mx-auto"
            />
            <p>{forecast.main.temp}°C</p>
            <p>{forecast.weather[0].description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForecastComponent;
