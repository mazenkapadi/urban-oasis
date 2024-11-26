import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    InstantSearch,
    Configure,
    InfiniteHits,
} from 'react-instantsearch';
import { searchClient } from '../algoliaConfig';
import FiltersComponent from '../components/FiltersComponent';
import HitComponent from '../components/HitComponent';
import HeaderComponent from '../components/HeaderComponent';
import { ListBulletIcon, Squares2X2Icon } from '@heroicons/react/24/outline';

const ViewAllEventsPage = () => {
    const [activeFilters, setActiveFilters] = useState({});
    const [viewMode, setViewMode] = useState('grid');
    const navigate = useNavigate();
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get('query') || '';

    const handleViewToggle = () => {
        setViewMode(viewMode === 'grid' ? 'list' : 'grid');
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
                    <InstantSearch searchClient={searchClient} indexName="events">
                        <Configure hitsPerPage={1000} query={searchQuery} enablePersonalization={false} />

                        {/* View Toggle Button */}
                        <div className="flex justify-end mb-4">
                            <button
                                onClick={handleViewToggle}
                                className="bg-white p-2 rounded-md shadow hover:bg-gray-100"
                                aria-label="Toggle View"
                            >
                                {viewMode === 'grid' ? (
                                    <ListBulletIcon className="w-6 h-6 text-black" />
                                ) : (
                                    <Squares2X2Icon className="w-6 h-6 text-black" />
                                )}
                            </button>
                        </div>

                        {/* Infinite Hits (Search Results) Section */}
                        <InfiniteHits
                            hitComponent={(props) => <HitComponent {...props} viewMode={viewMode} />}
                            classNames={{
                                list: viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'flex flex-col space-y-4',
                            }}
                        />
                    </InstantSearch>
                </div>
            </div>
        </div>
    );
};

export default ViewAllEventsPage;

