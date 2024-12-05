import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    InstantSearch,
    Configure,
    Hits,
    Pagination,
    useHits,
} from "react-instantsearch";
import { searchClient } from "../algoliaConfig";
import FiltersComponent from "../components/FiltersComponent";
import HitComponent from "../components/HitComponent";
import HeaderComponent from "../components/HeaderComponent";
import { ListBulletIcon, Squares2X2Icon } from "@heroicons/react/24/outline";
import { formatDateForFilter } from "../utils/dateHelpers";
import FilteredHits from "../components/FilteredHits.jsx";
import themeManager from "../utils/themeManager.jsx";

const ViewAllEventsPage = () => {
    const [activeFilters, setActiveFilters] = useState({});
    const [viewMode, setViewMode] = useState("grid");
    const [geoLocation, setGeoLocation] = useState(null); // Store user-specified lat/lng
    const [searchQuery, setSearchQuery] = useState(""); // Store event search query
    const [radius, setRadius] = useState(100 * 1000); // Default radius: 100 km
    const [dateRange, setDateRange] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const [ darkMode, setDarkMode ] = useState(themeManager.isDarkMode);

    useEffect(() => {
        const handleThemeChange = (isDark) => setDarkMode(isDark);
        themeManager.addListener(handleThemeChange);

        return () => {
            themeManager.removeListener(handleThemeChange);
        };
    }, []);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);

        const geoLocationParam = searchParams.get("geoLocation");
        const eventQueryParam = searchParams.get("q");
        const startDateParam = searchParams.get("startDate");
        const endDateParam = searchParams.get("endDate");

        if (geoLocationParam) {
            const [lat, lng] = geoLocationParam.split(",");
            setGeoLocation({ lat: parseFloat(lat), lng: parseFloat(lng) });
        }

        setSearchQuery(eventQueryParam || "");

        if (startDateParam && endDateParam) {
            setDateRange({
                startDate: new Date(startDateParam),
                endDate: new Date(endDateParam),
            });
        } else {
            setDateRange(null);
        }
    }, [location.search]);

    useEffect(() => {
        console.log("GeoLocation updated:", geoLocation);
        console.log("SearchQuery updated:", searchQuery);
        console.log("DateRange updated:", dateRange);

        // Reset filters dynamically when all fields are cleared
        if (!geoLocation && !searchQuery && (!dateRange?.startDate || !dateRange?.endDate)) {
            setActiveFilters({});
        }
    }, [geoLocation, searchQuery, dateRange]);

    useEffect(() => {
        const shouldResetFilters =
            !geoLocation && !searchQuery && (!dateRange?.startDate || !dateRange?.endDate);

        if (shouldResetFilters && Object.keys(activeFilters).length > 0) {
            setActiveFilters({});
        }
    }, [geoLocation, searchQuery, dateRange, activeFilters]);

    const handleViewToggle = () => {
        setViewMode(viewMode === "grid" ? "list" : "grid");
    };

    const onApplyFilters = (newFilters) => {
        setActiveFilters((prevFilters) => ({
            ...prevFilters,
            ...newFilters,
        }));
    };

    const removeFilter = (filterKey) => {
        setActiveFilters((prevFilters) => {
            const updatedFilters = { ...prevFilters };
            delete updatedFilters[filterKey];
            return updatedFilters;
        });
    };

    const calculateAvailabilityFilter = (availability) => {
        if (availability === "Available") {
            return `eventDetails.capacity > attendeesCount`;
        } else if (availability === "Unavailable") {
            return `eventDetails.capacity <= attendeesCount`;
        }
        return null;
    };

    // Optimize filters with useMemo
    const filters = useMemo(() => {
        const filtersArray = [];

        if (activeFilters.eventPrice) {
            const { min, max } = activeFilters.eventPrice;
            filtersArray.push(
                `eventDetails.eventPrice >= ${min} AND eventDetails.eventPrice <= ${max}`
            );
        }

        if (activeFilters.eventDateTime) {
            const dateRangeFilter = formatDateForFilter(activeFilters.eventDateTime);
            if (dateRangeFilter) {
                const { start, end } = dateRangeFilter;
                filtersArray.push(
                    `eventDetails.eventDateTime >= ${start} AND eventDetails.eventDateTime <= ${end}`
                );
            }
        }

        if (dateRange?.startDate && dateRange?.endDate) {
            filtersArray.push(
                `eventDetails.eventDateTime >= ${new Date(dateRange.startDate).getTime()} AND eventDetails.eventDateTime <= ${new Date(dateRange.endDate).getTime()}`
            );
        }

        if (activeFilters.paidEvent !== undefined) {
            filtersArray.push(
                `eventDetails.paidEvent = ${activeFilters.paidEvent ? 1 : 0}`
            );
        }

        const availabilityFilter = calculateAvailabilityFilter(
            activeFilters.availability
        );
        if (availabilityFilter) {
            filtersArray.push(availabilityFilter);
        }

        if (activeFilters.categories?.length > 0) {
            const categoryFilter = activeFilters.categories
                .map((category) => `basicInfo.categories:"${category}"`)
                .join(" OR ");
            filtersArray.push(`(${categoryFilter})`);
        }

        if (process.env.NODE_ENV === "development") {
            console.log("Generated Filters:", filtersArray.join(" AND "));
        }

        return filtersArray.join(" AND ");
    }, [activeFilters, dateRange]);

    const handleSearch = ({ geoLocation, eventQuery, dateRange }) => {
        setGeoLocation(geoLocation);
        setSearchQuery(eventQuery);
        setDateRange(dateRange);

        // Reset results if all fields are cleared
        if (!geoLocation && !eventQuery && (!dateRange?.startDate || !dateRange?.endDate)) {
            setActiveFilters({});
        }
    };

    const handleEnterKey = (e) => {
        if (e.key === "Enter") {
            handleSearch({
                geoLocation,
                eventQuery: searchQuery,
                dateRange,
            });
        }
    };

    const NoResultsMessage = () => {
        const { hits } = useHits();
        return (
            hits.length === 0 && (
                <div className="text-center mt-8">
                    <h2 className="text-lg font-semibold text-primary-light">
                        Oops! No events match your selected categories right now. We’re always adding new ones, so check back soon! In the meantime, explore our other events and discover something new!
                    </h2>
                    <button
                        className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        onClick={() => {
                            setActiveFilters({});
                            setGeoLocation(null);
                            setRadius(100 * 1000); // Reset radius
                            setSearchQuery(""); // Reset query
                        }}
                    >
                        Reset Filters
                    </button>
                </div>
            )
        );
    };

    return (
        <InstantSearch searchClient={searchClient} indexName="events">
            <div className={`view-all-events-page ${darkMode ? "bg-Dark-D2 text-primary-light" : "bg-Light-L1 text-primary-dark"} min-h-screen flex flex-col`}>
                {/* Header Component */}
                <div className={`w-full ${darkMode ? "bg-primary-dark" : "bg-primary-light"}`}>
                    <HeaderComponent/>
                </div>
                {/* Main Content */}
                <div className="flex-grow flex flex-col lg:flex-row lg:items-start p-4">
                {/* Filters Section */}
                    <div className={`lg:w-1/4 p-4 border-r ${darkMode ? "border-Light-L2" : "border-Dark-D2"}overflow-auto`}>
                        <FiltersComponent
                            onApplyFilters={onApplyFilters}
                            activeFilters={activeFilters}
                            removeFilter={removeFilter}
                        />
                    </div>

                    {/* Search Results Section */}
                    <div className="lg:w-3/4 p-4 flex flex-col">
                        {/* Configure Algolia Search */}
                        <Configure
                            hitsPerPage={21}
                            filters={filters}
                            query={searchQuery}
                            aroundLatLng={
                                geoLocation
                                    ? `${geoLocation.lat},${geoLocation.lng}`
                                    : undefined
                            }
                            aroundRadius={geoLocation ? radius : undefined}
                        />

                        {/* View Toggle Button */}
                        <div className="flex justify-end mb-4">
                            <button
                                onClick={handleViewToggle}
                                className={`${darkMode ? "bg-Dark-D2 hover:bg-Dark-D1" : "bg-Light-L2 hover:bg-Light-L1"} p-2 rounded-md shadow`}
                                aria-label="Toggle View"
                            >
                                {viewMode === "grid" ? (
                                    <ListBulletIcon
                                        className={`w-6 h-6 ${darkMode ? "text-primary-light" : "text-primary-dark"}`}/>
                                ) : (
                                    <Squares2X2Icon className="w-6 h-6 text-primary-light"/>
                                )}
                            </button>
                        </div>

                        {/* Hits Section */}
                        {/*<div className="min-h-[1000px] max-h-[calc(100vh-180px)] overflow-auto">*/}

                        <div className="flex-grow overflow-auto p-4">
                            <FilteredHits
                                hitComponent={(props) => (
                                    <HitComponent
                                        {...props}
                                        viewMode={viewMode}
                                    />
                                )}
                                classNames={{
                                    list:
                                        viewMode === "grid"
                                            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                                            : "flex flex-col space-y-4",
                                }}
                            />
                        </div>

                        {/* No Results Message */}
                        <NoResultsMessage/>

                        {/* Pagination Section */}
                        {/*<div className="flex justify-center mt-auto">*/}
                        <div className="sticky bottom-0 bg-white dark:bg-Dark-D2 py-4 flex justify-center">
                            <Pagination
                                padding={2}
                                classNames={{
                                    list: "flex space-x-2",
                                    item: "px-3 py-2 rounded-md cursor-pointer border border-secondary-light-1",
                                    selectedItem: "bg-accent-blue text-primary-light",
                                    disabledItem: "cursor-not-allowed opacity-50",
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </InstantSearch>
    );
};

export default ViewAllEventsPage;
