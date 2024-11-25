import React, { useEffect, useRef, useState } from "react";
import { autocomplete } from "@algolia/autocomplete-js";
import { createRoot } from "react-dom/client";
import { searchClient } from "../algoliaConfig";
import "@algolia/autocomplete-theme-classic";
import { ClockIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

function debounce(func, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => func.apply(this, args), delay);
    };
}

const RECENT_SEARCH_KEY = "RECENT_SEARCHES";

const AutocompleteSearch = () => {
    const containerRef = useRef(null);
    const panelRootRef = useRef(null);
    const rootRef = useRef(null);
    const [locationInput, setLocationInput] = useState(""); // Combined input for ZIP/City
    const [searchDate, setSearchDate] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const navigate = useNavigate();

    // Save recent searches in localStorage
    const saveRecentSearch = (query) => {
        const recentSearches = JSON.parse(localStorage.getItem(RECENT_SEARCH_KEY) || "[]");
        const updatedSearches = [query, ...recentSearches.filter((item) => item !== query)].slice(0, 5);
        localStorage.setItem(RECENT_SEARCH_KEY, JSON.stringify(updatedSearches));
    };

    const handleSearch = (query) => {
        const searchQuery = query || searchInput;
        if (searchQuery) {
            saveRecentSearch(searchQuery);
            const searchParams = new URLSearchParams();
            searchParams.set("query", searchQuery);
            if (locationInput) searchParams.set("location", locationInput); // Use locationInput
            if (searchDate) searchParams.set("date", searchDate);

            navigate(`/events?${searchParams.toString()}`);
        }
    };

    useEffect(() => {
        if (!containerRef.current) return;

        const debouncedSearch = debounce((query) => {
            console.log("Search Query Sent:", query);
        }, 300);

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

                debouncedSearch(query);

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
                    {
                        sourceId: "events",
                        getItems() {
                            return searchClient
                                .search([
                                    {
                                        indexName: "events",
                                        query,
                                        params: {
                                            hitsPerPage: 5,
                                            attributesToRetrieve: ["basicInfo.title"],
                                            attributesToHighlight: ["basicInfo.title"],
                                        },
                                    },
                                ])
                                .then(({ results }) => results[0]?.hits || []);
                        },
                        templates: {
                            item({ item }) {
                                const title = item.basicInfo?.title || "Untitled Event";
                                return (
                                    <div
                                        className="autocomplete-item flex items-center cursor-pointer px-4 py-2 hover:bg-gray-100"
                                        onClick={() => {
                                            setSearchInput(title);
                                            handleSearch(title);
                                        }}
                                    >
                                        <MagnifyingGlassIcon className="h-5 w-5 text-blue-400 mr-2" />
                                        <span className="text-gray-700">{title}</span>
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
    }, [navigate, locationInput, searchDate, searchInput]);

    return (
        <div className="flex items-center space-x-4 p-4 bg-transparent">
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

            {/* Date Picker */}
            <div className="relative w-full max-w-xs">
                <input
                    type="date"
                    value={searchDate}
                    onChange={(e) => setSearchDate(e.target.value)}
                    className="w-full py-2 px-4 border rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-red-400 focus:outline-none"
                />
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
