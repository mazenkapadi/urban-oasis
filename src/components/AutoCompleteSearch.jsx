import React, { useEffect, useRef, useState } from "react";
import { autocomplete } from "@algolia/autocomplete-js";
import { createRoot } from "react-dom/client";
import { searchClient } from "../algoliaConfig";
import { DateRangePicker } from "react-date-range";
import "@algolia/autocomplete-theme-classic";
import "react-date-range/dist/styles.css"; // Main style for DateRangePicker
import "react-date-range/dist/theme/default.css"; // Theme style for DateRangePicker
import { ClockIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useNavigate, useLocation } from "react-router-dom";

const RECENT_SEARCH_KEY = "RECENT_SEARCHES";

const AutocompleteSearch = ({ onApplyFilters }) => {
    const containerRef = useRef(null);
    const panelRootRef = useRef(null);
    const rootRef = useRef(null);
    const [locationInput, setLocationInput] = useState("");
    const [dateRange, setDateRange] = useState({
        startDate: null,
        endDate: null,
    });
    const [searchInput, setSearchInput] = useState("");
    const [showDatePicker, setShowDatePicker] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Save recent searches in localStorage
    const saveRecentSearch = (query) => {
        const recentSearches = JSON.parse(localStorage.getItem(RECENT_SEARCH_KEY) || "[]");
        const updatedSearches = [query, ...recentSearches.filter((item) => item !== query)].slice(0, 5);
        localStorage.setItem(RECENT_SEARCH_KEY, JSON.stringify(updatedSearches));
    };

    const handleSearch = (query) => {
        const searchQuery = query || searchInput;
        const { startDate, endDate } = dateRange;

        if (searchQuery || startDate || endDate) {
            saveRecentSearch(searchQuery);
            const searchParams = new URLSearchParams(location.search);
            searchParams.set("query", searchQuery || "");

            if (locationInput) searchParams.set("location", locationInput);
            if (startDate && endDate) {
                searchParams.set("startDate", startDate.toISOString());
                searchParams.set("endDate", endDate.toISOString());
            }

            navigate(`/events?${searchParams.toString()}`);

            // Call onApplyFilters if available
            if (onApplyFilters) {
                onApplyFilters({
                    dateRange: { startDate, endDate },
                });
            }
        }
    };

    const handleDateChange = (ranges) => {
        setDateRange({
            startDate: ranges.selection.startDate,
            endDate: ranges.selection.endDate,
        });
    };

    useEffect(() => {
        if (!containerRef.current) return;

        const autocompleteInstance = autocomplete({
            container: containerRef.current,
            placeholder: "Search events...",
            openOnFocus: true,
            renderer: { createElement: React.createElement, Fragment: React.Fragment, render: () => {} },
            render({ children }, root) {
                if (!panelRootRef.current || rootRef.current !== root) {
                    rootRef.current = root;
                    panelRootRef.current?.unmount();
                    panelRootRef.current = createRoot(root);
                }
                panelRootRef.current.render(children);
            },
            getSources({ query }) {
                if (!query) return [];

                const recentSearches = JSON.parse(localStorage.getItem(RECENT_SEARCH_KEY) || "[]");

                return [
                    {
                        sourceId: "recentSearches",
                        getItems() {
                            return recentSearches
                                .filter((item) => item.toLowerCase().includes(query.toLowerCase()))
                                .map((item) => ({
                                    label: item,
                                    type: "recent",
                                }));
                        },
                        templates: {
                            item({ item }) {
                                return (
                                    <div
                                        className="autocomplete-item flex items-center cursor-pointer px-4 py-2 hover:bg-gray-100"
                                        onClick={() => {
                                            setSearchInput(item.label);
                                            handleSearch(item.label);
                                        }}
                                    >
                                        <ClockIcon className="h-5 w-5 text-gray-400 mr-2" />
                                        <span className="text-gray-700">{item.label}</span>
                                    </div>
                                );
                            },
                        },
                    },
                ];
            },
            onSubmit({ state }) {
                handleSearch(state.query);
            },
            onInput({ state }) {
                setSearchInput(state.query);
            },
        });

        return () => autocompleteInstance.destroy();
    }, [navigate, locationInput, dateRange, searchInput]);

    return (
        <div className="flex items-center space-x-4 p-4 bg-transparent relative">
            {/* Zipcode or City Input */}
            <div className="relative w-full max-w-xs">
                <input
                    type="text"
                    placeholder="Zipcode or City"
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                    className="w-full py-2 px-4 border rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-red-400 focus:outline-none"
                />
            </div>

            {/* Date Range Picker */}
            <div className="relative w-full max-w-xs">
                <button
                    className="w-full py-2 px-4 border rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-red-400 focus:outline-none whitespace-nowrap overflow-hidden font-normal"
                    onClick={() => setShowDatePicker(!showDatePicker)}
                >
                    {dateRange.startDate && dateRange.endDate
                        ? `${dateRange.startDate.toLocaleDateString()} - ${dateRange.endDate.toLocaleDateString()}`
                        : "All Dates"}
                </button>

                {showDatePicker && (
                    <div className="absolute top-14 z-50 bg-white shadow-lg p-8">
                        <DateRangePicker
                            ranges={[{
                                startDate: dateRange.startDate || new Date(),
                                endDate: dateRange.endDate || new Date(),
                                key: "selection",
                            }]}
                            onChange={handleDateChange}
                        />
                    </div>
                )}
            </div>

            {/* Autocomplete Container */}
            <div ref={containerRef} className="flex-grow relative w-full bg-white"></div>

            {/* Search Button */}
            <button
                className="bg-red-500 text-white rounded-lg px-6 py-2 hover:bg-red-600 transition-all"
                onClick={() => handleSearch(searchInput)}
            >
                Search
            </button>
        </div>
    );
};

export default AutocompleteSearch;
