import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { formatDateForFilter } from "../utils/dateHelpers.jsx";

const FiltersComponent = ({
                              activeFilters,
                              onApplyFilters,
                              removeFilter,
                          }) => {
    const categories = [
        { label: "Film & Media", count: 2 },
        { label: "Food & Drink", count: 3 },
        { label: "Art", count: 1 },
        { label: "Comedy", count: 2 },
        { label: "Family & Kids", count: 1 },
        { label: "Health", count: 1 },
        { label: "Mental Health", count: 1 },
        { label: "Music", count: 1 },
        { label: "Networking", count: 1 },
        { label: "Photography & Art Exhibits", count: 1 },
        { label: "Shopping & Markets", count: 1 },
        { label: "Spirituality & Wellness", count: 1 },
        { label: "Technology", count: 1 },
        { label: "Uncategorized", count: 1 },
        { label: "Wine Tasting", count: 1 },
    ];

    const [showMoreCategories, setShowMoreCategories] = useState(false);
    const visibleCategoryCount = 5; // Number of categories to show in "Show Less" mode

    // Handle Paid/Free Filter
    const handlePaidChange = (paidStatus) => {
        if (paidStatus !== null) {
            onApplyFilters({ paidEvent: paidStatus });
        } else {
            removeFilter('paidEvent');
        }
    };

    // Handle Price Range Filter
    const handlePriceChange = (min, max) => {
        if (min || max) {
            onApplyFilters({
                eventPrice: { min: Number(min) || 0, max: Number(max) || Infinity },
            });
        } else {
            removeFilter('eventPrice');
        }
    };

    // Handle Availability Filter
    const handleAvailabilityChange = (availability) => {
        if (availability) {
            onApplyFilters({ availability });
        } else {
            removeFilter('availability');
        }
    };

    // Handle Date Filter
    const handleDateChange = (filter) => {
        const dateRange = formatDateForFilter(filter);

        if (dateRange) {
            onApplyFilters({ eventDateTime: filter });
        } else {
            removeFilter('eventDateTime');
        }
    };

    // Handle Categories Filter
    const handleCategoryChange = (category) => {
        const updatedCategories = activeFilters.categories || [];
        const newCategories = updatedCategories.includes(category)
            ? updatedCategories.filter((c) => c !== category)
            : [...updatedCategories, category];

        if (newCategories.length > 0) {
            onApplyFilters({ categories: newCategories });
        } else {
            removeFilter('categories');
        }
    };

    const toggleShowMoreCategories = () => {
        setShowMoreCategories(!showMoreCategories);
    };

    const displayedCategories = showMoreCategories
        ? categories
        : categories.slice(0, visibleCategoryCount);

    return (
        <div className="p-6 sticky top-0 bg-white border-r border-gray-200 h-full">
            <h2 className="text-xl font-bold">Filters</h2>

            {/* Date Filter */}
            <div className="mb-6">
                <h3 className="font-semibold mb-1">Date</h3>
                <ul className="space-y-2">
                    {['Today', 'Tomorrow', 'Weekend'].map((filter) => (
                        <li key={filter}>
                            <input
                                type="radio"
                                name="dateFilter"
                                checked={activeFilters.eventDateTime === filter}
                                onChange={() => handleDateChange(filter)}
                                className="mr-2"
                            />
                            <label>{filter}</label>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Price Range Filter */}
            <div className="mb-6">
                <h3 className="font-semibold mb-1">Price Range</h3>
                <Box display="flex" gap={2}>
                    <TextField
                        label="Min"
                        type="number"
                        value={activeFilters.eventPrice?.min || ''}
                        onChange={(e) => handlePriceChange(e.target.value, activeFilters.eventPrice?.max)}
                    />
                    <TextField
                        label="Max"
                        type="number"
                        value={activeFilters.eventPrice?.max || ''}
                        onChange={(e) => handlePriceChange(activeFilters.eventPrice?.min, e.target.value)}
                    />
                </Box>
            </div>

            {/* Paid Filter */}
            <div className="mb-6">
                <h3 className="font-semibold mb-1">Price</h3>
                <ul>
                    <li>
                        <input
                            type="radio"
                            checked={activeFilters.paidEvent === true}
                            onChange={() => handlePaidChange(true)}
                            className="mr-2"
                        />
                        <label>Paid</label>
                    </li>
                    <li>
                        <input
                            type="radio"
                            checked={activeFilters.paidEvent === false}
                            onChange={() => handlePaidChange(false)}
                            className="mr-2"
                        />
                        <label>Free</label>
                    </li>
                </ul>
            </div>

            {/* Availability Filter */}
            <div className="mb-6">
                <h3 className="font-semibold mb-1">Availability</h3>
                <ul>
                    <li>
                        <input
                            type="checkbox"
                            checked={activeFilters.availability === 'Available'}
                            onChange={() => handleAvailabilityChange('Available')}
                            className="mr-2"
                        />
                        <label>Available</label>
                    </li>
                </ul>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
                <h3 className="font-semibold mb-1">Category</h3>
                <ul className="space-y-2">
                    {displayedCategories.map((category) => (
                        <li key={category.label}>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={activeFilters.categories?.includes(category.label)}
                                    onChange={() => handleCategoryChange(category.label)}
                                    className="mr-2"
                                />
                                {category.label} ({category.count})
                            </label>
                        </li>
                    ))}
                </ul>
                <button
                    onClick={toggleShowMoreCategories}
                    className="text-blue-500 mt-2 underline"
                >
                    {showMoreCategories ? "Show Less" : "Show More"}
                </button>
            </div>
        </div>
    );
};

export default FiltersComponent;
