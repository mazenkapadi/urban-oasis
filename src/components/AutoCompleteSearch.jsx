import React, { useEffect, useState } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // Main style for DateRangePicker
import "react-date-range/dist/theme/default.css"; // Theme style for DateRangePicker
import { useNavigate, useLocation } from "react-router-dom";
import { googleMapsConfig } from "../locationConfig";
import { ClockIcon } from "@heroicons/react/24/outline";

const RECENT_SEARCH_KEY = "RECENT_SEARCHES";

const AutocompleteSearch = ({ onGeoSearch }) => {
    const [cityInput, setCityInput] = useState(null);
    const [geoLocation, setGeoLocation] = useState(null);
    const [dateRange, setDateRange] = useState({
        startDate: null,
        endDate: null,
    });
    const [eventInput, setEventInput] = useState("");
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [recentSearches, setRecentSearches] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();

    // Load recent event searches from localStorage
    useEffect(() => {
        const savedSearches = JSON.parse(localStorage.getItem(RECENT_SEARCH_KEY) || "[]");
        setRecentSearches(savedSearches);
    }, []);

    const saveRecentSearch = (query) => {
        const updatedSearches = [query, ...recentSearches.filter((item) => item !== query)].slice(0, 5);
        setRecentSearches(updatedSearches);
        localStorage.setItem(RECENT_SEARCH_KEY, JSON.stringify(updatedSearches));
    };

    const handleSearch = async (query) => {
        const searchQuery = query || eventInput;
        const { startDate, endDate } = dateRange;

        const searchParams = new URLSearchParams(location.search);
        searchParams.set("query", searchQuery || "");

        if (geoLocation) {
            searchParams.set("geoLocation", `${geoLocation.lat},${geoLocation.lng}`);
            searchParams.set("city", cityInput?.label || "");
        }
        if (startDate && endDate) {
            searchParams.set("startDate", startDate.toISOString());
            searchParams.set("endDate", endDate.toISOString());
        }

        navigate(`/events?${searchParams.toString()}`);

        if (onGeoSearch) {
            onGeoSearch(geoLocation);
        }

        if (query) saveRecentSearch(query);
    };

    const handleDateChange = (ranges) => {
        setDateRange({
            startDate: ranges.selection.startDate,
            endDate: ranges.selection.endDate,
        });
    };

    const handleLocationChange = (value) => {
        setCityInput(value);
        const placeId = value?.value?.place_id;

        if (placeId) {
            const service = new google.maps.places.PlacesService(document.createElement("div"));
            service.getDetails(
                { placeId, fields: ["geometry"] },
                (place, status) => {
                    if (status === google.maps.places.PlacesServiceStatus.OK) {
                        const location = place.geometry.location;
                        setGeoLocation({ lat: location.lat(), lng: location.lng() });
                    }
                }
            );
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Backspace" && cityInput) {
            setCityInput(null);
            setGeoLocation(null);
        }
    };

    const renderRecentSearches = () => {
        return recentSearches.map((search, index) => (
            <div
                key={index}
                className="autocomplete-item flex items-center cursor-pointer px-4 py-2 hover:bg-gray-100"
                onClick={() => {
                    setEventInput(search);
                    handleSearch(search);
                }}
            >
                <ClockIcon className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-gray-700">{search}</span>
            </div>
        ));
    };

    return (
        <div className="flex items-center space-x-4 p-4 bg-transparent relative">
            {/* Zipcode or City Input with Google Places Autocomplete */}
            <div className="relative w-full" style={{ maxWidth: "300px" }}>
                <GooglePlacesAutocomplete
                    apiKey={googleMapsConfig.apiKey}
                    selectProps={{
                        value: cityInput,
                        onChange: handleLocationChange,
                        placeholder: "Zipcode or City",
                        styles: {
                            control: (provided) => ({
                                ...provided,
                                backgroundColor: "white",
                                borderColor: "lightgray",
                                boxShadow: "none",
                                borderRadius: "6px",
                                padding: "3px",
                                fontSize: "16px",
                                width: "100%",
                                minWidth: "300px"
                            }),
                            input: (provided) => ({
                                ...provided,
                                color: "black", // Ensure text is black
                            }),
                            menu: (provided) => ({
                                ...provided,
                                zIndex: 9999, // Ensure menu is above other elements
                                backgroundColor: "white",
                            }),
                            option: (provided) => ({
                                ...provided,
                                color: "black", // Suggestions text color
                                backgroundColor: "white", // Suggestions background color
                                "&:hover": {
                                    backgroundColor: "#f1f1f1", // Hover effect for suggestions
                                },
                            }),
                        },
                        onKeyDown: handleKeyDown, // Added to handle backspace
                    }}
                />
            </div>

            {/* Date Range Picker */}
            <div className="relative w-full max-w-xs">
                <button
                    className="w-full py-2 px-4 border rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-blue-400 focus:outline-none whitespace-nowrap overflow-hidden font-normal"
                    onClick={() => setShowDatePicker(!showDatePicker)}
                >
                    {dateRange.startDate && dateRange.endDate
                        ? `${dateRange.startDate.toLocaleDateString()} - ${dateRange.endDate.toLocaleDateString()}`
                        : "All Dates"}
                </button>

                {showDatePicker && (
                    <div className="absolute top-14 z-50 bg-white shadow-lg p-8">
                        <DateRangePicker
                            ranges={[
                                {
                                    startDate: dateRange.startDate || new Date(),
                                    endDate: dateRange.endDate || new Date(),
                                    key: "selection",
                                },
                            ]}
                            onChange={handleDateChange}
                        />
                    </div>
                )}
            </div>

            {/* Event Search Input */}
            <div className="relative w-full max-w-xs">
                <input
                    type="text"
                    value={eventInput}
                    onChange={(e) => setEventInput(e.target.value)}
                    placeholder="Search events..."
                    className="w-full py-2 px-4 border rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
                {eventInput && (
                    <div className="absolute top-full left-0 bg-white shadow-lg w-full max-h-40 overflow-y-auto z-10">
                        {renderRecentSearches()}
                    </div>
                )}
            </div>

            {/* Search Button */}
            <button
                className="bg-red-500 text-white rounded-lg px-6 py-2 hover:bg-red-600 transition-all"
                onClick={() => handleSearch(eventInput)}
            >
                Search
            </button>
        </div>
    );
};

export default AutocompleteSearch;
