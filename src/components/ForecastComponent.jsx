import { useState, useEffect } from "react";
import { Switch, FormControlLabel } from '@mui/material';

const ForecastComponent = ({lat, lon, eventDate}) => {
    const [ filteredForecast, setFilteredForecast ] = useState(null);
    const [unit, setUnit] = useState("metric"); // "metric" for Celsius, "imperial" for Fahrenheit

    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

    const convertTemperature = (temp, unit) => {
        if (unit === "imperial") {
            return (temp * 9) / 5 + 32; 
        }
        return temp; 
    };

    const handleUnitChange = (event) => {
        setUnit(event.target.checked ? "imperial" : "metric");
    };
    

    const fetchWeather = async (lat, lon) => {
        if (!lat || !lon || !eventDate) return;

        try {
            console.log("Fetching weather data...");
            console.log("lat", lat);
            console.log("lon", lon);
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
            );
            const forecastResponse = await response.json();
            console.log(forecastResponse);

            const date = parseEventDate(eventDate);
            console.log("Parsed Event Date:", date);

            const formattedEventDate = formatDate(date);
            const filteredData = forecastResponse.list.filter((forecast) => {
                const dt_txt = new Date(forecast.dt_txt);
                const formattedDate = formatDate(dt_txt);
                return formattedDate === formattedEventDate;
            });

            if (filteredData.length > 0) {
                console.log("filteredData.length>0");

                const eventTime = date.getTime();
                console.log("eventTime:", eventTime);
                const nearestForecast = forecastResponse.list.reduce(
                    (nearest, forecast) => {
                        const forecastTime = new Date(forecast.dt_txt).getTime();
                        // console.log("forecastTime:", forecastTime);
                        if (forecastTime <= eventTime) {
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
                setFilteredForecast(null);
            }
        } catch (e) {
            console.error("Error fetching forecast data:", e);
        }
    };

    useEffect(() => {
        if (lat && lon && eventDate) {
            fetchWeather(lat, lon);
        }
    }, [ lat, lon, eventDate ]);

    if (!filteredForecast) {
        return null; // Return null or a loading indicator
    }

    return (
        <div className="w-full mt-2 rounded-lg" >
            {/* <h2 className="text-h4 text-primary-light font-archivo font-semibold" >Forecast</h2 > */}
            <div className="flex overflow-x-auto space-x-4" >
                <div
                    className="rounded-lg min-w-[130px] flex-shrink-0"
                >
                    {/* <p className="text-body text-primary-light font-archivo" >
                        {new Date(filteredForecast.dt_txt).toLocaleString()}
                    </p > */}
                    <img
                        src={`https://openweathermap.org/img/wn/${filteredForecast.weather[0].icon}@2x.png`}
                        alt={filteredForecast.weather[0].description}
                        className="mx-auto h-20"
                    />
                    <div className="justify-between flex items-center space-x-2">
                        <p className="text-body text-primary-light font-archivo">
                            {convertTemperature(filteredForecast.main.temp, unit).toFixed(1)}°
                            {unit === "metric" ? "C" : "F"}
                        </p>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={unit === "imperial"} // If unit is Fahrenheit, the switch is checked
                                        onChange={handleUnitChange}
                                        name="unit-toggle"
                                        color="primary"
                                    />
                                }
                                label={unit === "metric" ? "°F" : "°C"}
                                className="text-body text-primary-light font-archivo"
                            />
                    </div>

                    
                    {/* <p className="text-body text-primary-light font-archivo" > */}
                        {/* {filteredForecast.weather[0].description}
                    </p > */}
                    
                </div >
            </div >
        </div >
    );
};

export default ForecastComponent;

const parseEventDate = (dt) => {
    const formattedDateString = dt.replace("UTC", "GMT").replace("at", "").trim();
    return new Date(formattedDateString);
};

const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};