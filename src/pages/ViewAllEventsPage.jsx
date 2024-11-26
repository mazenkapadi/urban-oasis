import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    InstantSearch,
    Configure,
    Hits,
    Pagination,
    useHits,
} from 'react-instantsearch';
import { searchClient } from '../algoliaConfig';
import FiltersComponent from '../components/FiltersComponent';
import HitComponent from '../components/HitComponent';
import HeaderComponent from '../components/HeaderComponent';
import { ListBulletIcon, Squares2X2Icon } from '@heroicons/react/24/outline';
import { formatDateForFilter } from "../utils/dateHelpers.jsx";

const ViewAllEventsPage = () => {
    const [activeFilters, setActiveFilters] = useState({});
    const [viewMode, setViewMode] = useState('grid');
    const navigate = useNavigate();
    const location = useLocation();

    // Extract query parameters from the URL
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get('query') || '';

    // Toggle view mode between grid and list
    const handleViewToggle = () => {
        setViewMode(viewMode === 'grid' ? 'list' : 'grid');
    };

    // Functions to apply or remove filters
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
        if (availability === 'Available') {
            return `eventDetails.capacity > attendeesCount`;
        } else if (availability === 'Unavailable') {
            return `eventDetails.capacity <= attendeesCount`;
        }
        return null;
    };

    const buildFilters = () => {
        const filters = [];

        // Price Filter
        if (activeFilters.eventPrice) {
            const { min, max } = activeFilters.eventPrice;
            filters.push(`eventDetails.eventPrice >= ${min} AND eventDetails.eventPrice <= ${max}`);
        }

        // Date Filter from FiltersComponent (e.g., Today, Tomorrow, Weekend)
        if (activeFilters.eventDateTime) {
            const dateRange = formatDateForFilter(activeFilters.eventDateTime);
            if (dateRange) {
                const { start, end } = dateRange;
                filters.push(`eventDetails.eventDateTime >= ${start} AND eventDetails.eventDateTime <= ${end}`);
            }
        }

        // Date Range Filter from AutocompleteSearch
        const startDate = queryParams.get("startDate");
        const endDate = queryParams.get("endDate");

        if (startDate && endDate) {
            filters.push(
                `eventDetails.eventDateTime >= ${new Date(startDate).getTime()} AND eventDetails.eventDateTime <= ${new Date(endDate).getTime()}`
            );
        }

        // Paid Event Filter
        if (activeFilters.paidEvent !== undefined) {
            filters.push(`eventDetails.paidEvent = ${activeFilters.paidEvent ? 1 : 0}`);
        }

        // Availability Filter
        const availabilityFilter = calculateAvailabilityFilter(activeFilters.availability);
        if (availabilityFilter) {
            filters.push(availabilityFilter);
        }

        // Category Filter
        if (activeFilters.categories && activeFilters.categories.length > 0) {
            const categoryFilter = activeFilters.categories
                .map((category) => `basicInfo.categories:"${category}"`)
                .join(' OR ');
            filters.push(`(${categoryFilter})`);
        }

        console.log('Generated Filters:', filters.join(' AND '));
        return filters.join(' AND ');
    };

    const NoResultsMessage = () => {
        const { hits } = useHits(); // Use Algolia's useHits to check if there are hits
        return (
            hits.length === 0 && (
                <div className="text-center mt-8">
                    <h2 className="text-lg font-semibold text-primary-light">
                        Oops! No events match your selected categories right now. We’re always adding new ones, so check back soon!
                    </h2>
                    <p className="text-sm text-secondary-light-1">
                        In the meantime, explore our other events and discover something new!
                    </p>
                </div>
            )
        );
    };

    return (
        <InstantSearch searchClient={searchClient} indexName="events">
            <div className="view-all-events-page bg-primary-dark text-primary-light min-h-screen flex flex-col">
                {/* Header Component */}
                <HeaderComponent />

                {/* Main Content */}
                <div className="flex-grow flex flex-col lg:flex-row lg:items-start p-4">
                    {/* Filters Section */}
                    <div className="lg:w-1/4 p-4 border-r border-secondary-dark-1">
                        <FiltersComponent
                            onApplyFilters={onApplyFilters}
                            activeFilters={activeFilters}
                            removeFilter={removeFilter}
                        />
                    </div>

                    {/* Search Results Section */}
                    <div className="lg:w-3/4 p-4 flex flex-col">
                        {/* Configure Search */}
                        <Configure hitsPerPage={21} filters={buildFilters()} query={searchQuery}/>

                        {/* View Toggle Button */}
                        <div className="flex justify-end mb-4">
                            <button
                                onClick={handleViewToggle}
                                className="bg-secondary-dark-1 p-2 rounded-md shadow hover:bg-secondary-dark-2"
                                aria-label="Toggle View"
                            >
                                {viewMode === 'grid' ? (
                                    <ListBulletIcon className="w-6 h-6 text-primary-light"/>
                                ) : (
                                    <Squares2X2Icon className="w-6 h-6 text-primary-light"/>
                                )}
                            </button>
                        </div>

                        {/* Hits Section */}
                        <div className="min-h-[500px] max-h-[calc(100vh-180px)] overflow-auto">
                            <Hits
                                hitComponent={(props) => <HitComponent {...props} viewMode={viewMode}/>}
                                classNames={{
                                    list: viewMode === 'grid'
                                        ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                                        : 'flex flex-col space-y-4',
                                }}
                            />
                            {/* No Results Message */}
                            <NoResultsMessage/>
                        </div>

                        {/* Pagination Section */}
                        <div className="flex justify-center mt-auto">
                            <Pagination
                                padding={2}
                                classNames={{
                                    list: 'flex space-x-2',
                                    item: 'px-3 py-2 rounded-md cursor-pointer border border-secondary-light-1',
                                    selectedItem: 'bg-accent-blue text-primary-light',
                                    disabledItem: 'cursor-not-allowed opacity-50',
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
