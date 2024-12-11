import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    InstantSearch,
    Configure,
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
    const [ activeFilters, setActiveFilters ] = useState({});
    const [ viewMode, setViewMode ] = useState("grid");
    const [ geoLocation, setGeoLocation ] = useState(null);
    const [ searchQuery, setSearchQuery ] = useState("");
    const [ radius ] = useState(100 * 1000);
    const [ dateRange, setDateRange ] = useState(null);
    const location = useLocation();
    const [ darkMode, setDarkMode ] = useState(themeManager.isDarkMode);
    const handleViewToggle = () => {
        setViewMode(viewMode === "grid" ? "list" : "grid");
    };

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
            const [ lat, lng ] = geoLocationParam.split(",");
            setGeoLocation({lat: parseFloat(lat), lng: parseFloat(lng)});
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
    }, [ location.search ]);

    const onApplyFilters = (newFilters) => {
        setActiveFilters((prevFilters) => ({
            ...prevFilters,
            ...newFilters,
        }));
    };

    const removeFilter = (filterKey) => {
        setActiveFilters((prevFilters) => {
            const updatedFilters = {...prevFilters};
            delete updatedFilters[filterKey];
            return updatedFilters;
        });
    };

    const calculateFilters = () => {
        const filtersArray = [];

        if (activeFilters.eventPrice) {
            const {min, max} = activeFilters.eventPrice;
            filtersArray.push(
                `eventDetails.eventPrice >= ${min} AND eventDetails.eventPrice <= ${max}`
            );
        }

        if (activeFilters.eventDateTime) {
            const dateRangeFilter = formatDateForFilter(activeFilters.eventDateTime);
            if (dateRangeFilter) {
                const {start, end} = dateRangeFilter;
                filtersArray.push(
                    `eventDetails.eventDateTime >= ${start} AND eventDetails.eventDateTime <= ${end}`
                );
            }
        }

        if (activeFilters.paidEvent !== undefined) {
            filtersArray.push(
                `eventDetails.paidEvent = ${activeFilters.paidEvent ? 1 : 0}`
            );
        }

        if (activeFilters.categories?.length > 0) {
            const categoryFilter = activeFilters.categories
                                                .map((category) => `basicInfo.categories:"${category}"`)
                                                .join(" OR ");
            filtersArray.push(`(${categoryFilter})`);
        }

        return filtersArray.length > 0 ? filtersArray.join(" AND ") : "";
    };

    const filters = useMemo(() => calculateFilters(), [ activeFilters, dateRange ]);

    const NoResultsMessage = () => {
        const {hits} = useHits();

        if (hits.length === 0) {
            return (
                <div className="text-center mt-8" >
                    <h2 className="text-lg font-semibold text-primary-light" >
                        Oops! No events match your search criteria.
                    </h2 >
                    <button
                        className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        onClick={() => {
                            setActiveFilters({});
                            setGeoLocation(null);
                            setSearchQuery("");
                        }}
                    >
                        Reset Filters
                    </button >
                </div >
            );
        }

        return null;
    };

    return (
        <InstantSearch searchClient={searchClient} indexName="events" >
            <div
                className={`view-all-events-page ${
                    darkMode ? "bg-Dark-D2 text-primary-light" : "bg-Light-L1 text-primary-dark"
                } min-h-screen flex flex-col`}
            >
                <div className={`w-full ${darkMode ? "bg-primary-dark" : "bg-primary-light"}`} >
                    <HeaderComponent />
                </div >
                <div className="flex-grow flex flex-col lg:flex-row lg:items-start p-4" >
                    <div
                        className={`lg:w-1/4 p-4 border-r ${
                            darkMode ? "border-Light-L2" : "border-Dark-D2"
                        } overflow-auto`}
                    >
                        <FiltersComponent
                            onApplyFilters={onApplyFilters}
                            activeFilters={activeFilters}
                            removeFilter={removeFilter}
                        />
                    </div >
                    <div className="lg:w-3/4 p-4 flex flex-col" >
                        <Configure
                            hitsPerPage={20}
                            filters={filters || undefined}
                            query={searchQuery || undefined}
                            aroundLatLng={
                                geoLocation
                                    ? `${geoLocation.lat},${geoLocation.lng}`
                                    : undefined
                            }
                            aroundRadius={geoLocation ? radius : undefined}
                        />

                        {/* View Toggle Button */}
                        <div className="flex justify-end mb-4" >
                            <button
                                onClick={handleViewToggle}
                                className={`${darkMode ? "bg-Dark-D2 hover:bg-Dark-D1" : "bg-Light-L2 hover:bg-Light-L1"} p-2 rounded-md shadow`}
                                aria-label="Toggle View"
                            >
                                {viewMode === "grid" ? (
                                    <ListBulletIcon
                                        className={`w-6 h-6 ${darkMode ? "text-primary-light" : "text-primary-dark"}`} />
                                ) : (
                                    <Squares2X2Icon className="w-6 h-6 text-primary-light" />
                                )}
                            </button >
                        </div >


                        <div className="flex-grow overflow-auto p-4" >
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
                        </div >
                        <NoResultsMessage />
                        <div
                            className="bg-white dark:bg-Dark-D2 py-4 flex justify-center border-t border-secondary-light-1"
                        >
                            <Pagination
                                padding={2}
                                classNames={{
                                    list: "flex space-x-2",
                                    item: "px-3 py-2 rounded-md cursor-pointer border border-secondary-light-1",
                                    selectedItem: "bg-accent-blue text-primary-light",
                                    disabledItem: "cursor-not-allowed opacity-50",
                                }}
                            />
                        </div >
                    </div >
                </div >
            </div >
        </InstantSearch >
    );
};

export default ViewAllEventsPage;
