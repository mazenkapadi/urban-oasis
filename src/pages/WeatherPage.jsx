import CurrentWeather from "../components/CurrentWeather";

function WeatherPage() {
  return (
    <div>
      <h1 className="text-2xl mb-6">CurrentWeather</h1>
      <h1 className="text-3xl mb-6">
        This is a temporary page till a detailed event page is created
      </h1>
      <p className="text-3xl mb-6">Data shown is for a specified city.</p>
      <p className="text-3xl mb-6">
        Name of the city should be present in the event which user will
        click/select for looking details so the weather api will get data of
        that city
      </p>

      <CurrentWeather city="New York" />
    </div>
  );
}

export default WeatherPage;
