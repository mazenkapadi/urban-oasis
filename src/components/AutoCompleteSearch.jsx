// components/AutocompleteSearch.jsx
import React, { useEffect, useRef, useState } from 'react';
import { autocomplete } from '@algolia/autocomplete-js';
import { createRoot } from 'react-dom/client';
import { searchClient } from '../algoliaConfig';
import '@algolia/autocomplete-theme-classic';

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
                                    return hits;
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
                                        className="autocomplete-item flex flex-col cursor-pointer px-4 py-2 hover:bg-gray-100"
                                        onClick={() => {
                                            setSearchInput(title);
                                            setQuery(title);
                                        }}
                                    >
                                        <span className="text-gray-700">{title}</span>
                                    </div>
                                );
                            },
                            noResults() {
                                return <div className="text-gray-500 px-4 py-2">No results found.</div>;
                            },
                        },
                    },
                ];
            },
        });

        return () => autocompleteInstance.destroy();
    }, []);

    const handleZipcodeChange = (e) => {
        const value = e.target.value;
        if (/^\d{0,5}$/.test(value)) {
            setZipcode(value);
            console.log('Zipcode updated:', value);
        }
    };

    const handleSearch = () => {
        console.log("Searching for events:", searchInput, "on date:", searchDate, "in zipcode:", zipcode);
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
