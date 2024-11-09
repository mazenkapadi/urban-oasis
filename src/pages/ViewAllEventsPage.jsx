import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    InstantSearch,
    Configure,
    CurrentRefinements,
    InfiniteHits,
    RefinementList,
    SortBy,
    useSearchBox,
} from 'react-instantsearch';
import { searchClient } from '../algoliaConfig';
import FiltersComponent from '../components/FiltersComponent';
import HitComponent from '../components/HitComponent';

const ViewAllEventsPage = () => {
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [activeFilters, setActiveFilters] = useState({});
    const navigate = useNavigate();
    const location = useLocation();

    // Extract query parameters from the URL
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get('query') || '';

    // Function to apply filters
    const onApplyFilters = (newFilters) => {
        setActiveFilters((prevFilters) => ({
            ...prevFilters,
            ...newFilters,
        }));
    };

    // Function to remove a specific filter
    const removeFilter = (filterKey) => {
        setActiveFilters((prevFilters) => {
            const updatedFilters = { ...prevFilters };
            delete updatedFilters[filterKey];
            return updatedFilters;
        });
    };

    return (
        <div className="view-all-events-page p-4">
            <InstantSearch
                searchClient={searchClient}
                indexName="events"
            >
                <Configure hitsPerPage={10} query={searchQuery} />

                {/* Header Section */}
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Explore Events</h1>
                    <button
                        className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600"
                        onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                    >
                        {mobileFiltersOpen ? 'Hide Filters' : 'Show Filters'}
                    </button>
                </div>

                {/* Filters Section */}
                <div className="flex">
                    {mobileFiltersOpen && (
                        <div className="filters-container w-1/4 pr-4">
                            <FiltersComponent
                                onApplyFilters={onApplyFilters}
                                activeFilters={activeFilters}
                                removeFilter={removeFilter}
                            />
                        </div>
                    )}

                    {/* Search Results Section */}
                    <div className="w-full">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                            <CurrentRefinements />
                            <SortBy
                                items={[
                                    { label: 'Relevance', value: 'events' },
                                    { label: 'Price (Low to High)', value: 'events_price_asc' },
                                    { label: 'Price (High to Low)', value: 'events_price_desc' },
                                ]}
                                className="sort-by-dropdown"
                            />
                        </div>

                        <InfiniteHits
                            hitComponent={HitComponent}
                            classNames={{
                                list: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6',
                                item: 'bg-white border rounded-lg p-4 shadow hover:shadow-lg transition-shadow',
                            }}
                        />
                    </div>
                </div>
            </InstantSearch>
        </div>
    );
};

export default ViewAllEventsPage;
