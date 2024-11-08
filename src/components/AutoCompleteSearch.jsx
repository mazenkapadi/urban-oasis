import React, { useEffect, useRef, useState } from 'react';
import { autocomplete } from '@algolia/autocomplete-js';
import { createRoot } from 'react-dom/client';
import { searchClient } from '../algoliaConfig';
import '@algolia/autocomplete-theme-classic';
import { ClockIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

function debounce(func, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => func.apply(this, args), delay);
    };
}

const AutocompleteSearch = () => {
    const containerRef = useRef(null);
    const panelRootRef = useRef(null);
    const rootRef = useRef(null);
    const [zipcode, setZipcode] = useState('');
    const [searchDate, setSearchDate] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (!containerRef.current) return;

        console.log('Initializing Autocomplete...');
        const debouncedSearch = debounce((query) => {
            console.log('Search Query Sent:', query);
        }, 300);

        const autocompleteInstance = autocomplete({
            container: containerRef.current,
            placeholder: 'Search events...',
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
                if (!query) {
                    console.log('Empty query, skipping search.');
                    return [];
                }

                debouncedSearch(query);

                return [
                    // Recent Searches Plugin
                    {
                        sourceId: 'recentSearches',
                        getItems() {
                            const recentSearches = JSON.parse(localStorage.getItem('RECENT_SEARCHES') || '[]');
                            return recentSearches
                                .filter((item) => item.label.toLowerCase().includes(query.toLowerCase()))
                                .map((item) => ({
                                    ...item,
                                    type: 'recent',
                                }));
                        },
                        templates: {
                            item({ item, setQuery }) {
                                return (
                                    <div
                                        className="autocomplete-item flex items-center cursor-pointer px-4 py-2 hover:bg-gray-100"
                                        onClick={() => {
                                            setSearchInput(item.label);
                                            setQuery(item.label);
                                            navigate('/events');
                                        }}
                                    >
                                        <ClockIcon className="h-5 w-5 text-gray-400 mr-2" />
                                        <span className="text-gray-700">{item.label}</span>
                                    </div>
                                );
                            },
                            noResults() {
                                return <div className="text-gray-500 px-4 py-2">No recent searches found.</div>;
                            },
                        },
                    },
                    // Events Search from Algolia
                    {
                        sourceId: 'events',
                        getItems() {
                            console.log('Fetching results for query:', query);
                            return searchClient
                                .search([
                                    {
                                        indexName: 'events',
                                        query,
                                        params: {
                                            hitsPerPage: 5,
                                            attributesToRetrieve: ['basicInfo.title'],
                                            attributesToHighlight: ['basicInfo.title'],
                                        },
                                    },
                                ])
                                .then(({ results }) => {
                                    const hits = results[0]?.hits || [];
                                    if (hits.length === 0) {
                                        console.warn('No results found for query:', query);
                                    } else {
                                        console.log('Search Results:', hits);
                                    }
                                    return hits.map((hit) => ({
                                        ...hit,
                                        type: 'event',
                                    }));
                                })
                                .catch((error) => {
                                    console.error('Error fetching search results:', error);
                                    return [];
                                });
                        },
                        templates: {
                            item({ item, setQuery }) {
                                const title = item.basicInfo?.title || 'Untitled Event';
                                return (
                                    <div
                                        className="autocomplete-item flex items-center cursor-pointer px-4 py-2 hover:bg-gray-100"
                                        onClick={() => {
                                            setSearchInput(title);
                                            setQuery(title);
                                            navigate('/events');
                                        }}
                                    >
                                        <MagnifyingGlassIcon className="h-5 w-5 text-blue-400 mr-2" />
                                        <span className="text-gray-700">{title}</span>
                                    </div>
                                );
                            },
                            noResults() {
                                return <div className="text-gray-500 px-4 py-2">No events found.</div>;
                            },
                        },
                    },
                ];
            },
        });

        return () => autocompleteInstance.destroy();
    }, [navigate]);

    const handleZipcodeChange = (e) => {
        const value = e.target.value;
        if (/^\d{0,5}$/.test(value)) {
            setZipcode(value);
            console.log('Zipcode updated:', value);
        }
    };

    const handleSearch = () => {
        console.log("Searching for events:", searchInput, "on date:", searchDate, "in zipcode:", zipcode);
        navigate('/events');
    };

    return (
        <div className="flex items-center space-x-4 rounded-lg p-4 bg-transparent">
            {/* Zipcode Input */}
            <div className="flex items-center bg-white bg-opacity-70 rounded-lg px-4 py-2">
                <input
                    type="text"
                    placeholder="Zipcode"
                    value={zipcode}
                    onChange={handleZipcodeChange}
                    className="bg-transparent border-none outline-none text-gray-700 w-24 text-center"
                />
            </div>

            {/* Date Picker */}
            <div className="flex items-center bg-white bg-opacity-70 rounded-lg px-4 py-2">
                <input
                    type="date"
                    value={searchDate}
                    onChange={(e) => setSearchDate(e.target.value)}
                    className="bg-transparent border-none outline-none text-gray-700 text-center"
                />
            </div>

            {/* Autocomplete Input */}
            <div ref={containerRef} className="flex-grow relative w-full bg-transparent"></div>

            {/* Search Button */}
            <button
                className="bg-red-500 text-white rounded-lg px-6 py-2 hover:bg-red-600 transition-all"
                onClick={handleSearch}
            >
                Search
            </button>
        </div>
    );
};

export default AutocompleteSearch;
