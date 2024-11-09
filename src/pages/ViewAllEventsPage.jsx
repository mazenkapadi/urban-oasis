import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    InstantSearch,
    Configure,
    CurrentRefinements,
    InfiniteHits,
    RefinementList,
    SortBy,
} from 'react-instantsearch';
import { searchClient } from '../algoliaConfig';
import FiltersComponent from '../components/FiltersComponent';
import HitComponent from '../components/HitComponent';
import HeaderComponent from '../components/HeaderComponent';

const ViewAllEventsPage = () => {
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
        <div className="view-all-events-page">
            {/* Header Component */}
            <HeaderComponent />

            {/* Main Content */}
            <div className="flex flex-col lg:flex-row lg:items-start p-4">
                {/* Filters Section */}
                <div className="lg:w-1/4 p-4 border-r border-gray-200">
                    <FiltersComponent
                        onApplyFilters={onApplyFilters}
                        activeFilters={activeFilters}
                        removeFilter={removeFilter}
                    />
                </div>

                {/* Search Results Section */}
                <div className="lg:w-3/4 p-4">
                    <InstantSearch
                        searchClient={searchClient}
                        indexName="events"
                    >
                        <Configure hitsPerPage={10} query={searchQuery} />

                        {/* Refinements and Sorting Section */}
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

                        {/* Infinite Hits (Search Results) Section */}
                        <InfiniteHits
                            hitComponent={HitComponent}
                            classNames={{
                                list: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6',
                                item: 'bg-white border rounded-lg p-4 shadow hover:shadow-lg transition-shadow',
                            }}
                        />
                    </InstantSearch>
                </div>
            </div>
        </div>
    );
};

export default ViewAllEventsPage;
