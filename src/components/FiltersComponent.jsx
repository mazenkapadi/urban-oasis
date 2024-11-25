import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { formatDateForFilter } from "../utils/dateHelpers.jsx";

const FiltersComponent = ({ activeFilters, onApplyFilters, removeFilter }) => {
    const [selectedPrimaryCategory, setSelectedPrimaryCategory] = useState('');
    const [selectedSubcategories, setSelectedSubcategories] = useState([]);

    const categorizedOptions = {
        Art: ['Painting', 'Sculpture', 'Photography'],
        Music: ['Rock', 'Pop', 'Classical'],
        Sports: ['Basketball', 'Soccer', 'Tennis'],
        Technology: ['AI', 'Blockchain', 'Web Development'],
    };

    // Handle individual filters and pass them to the parent component
    const handlePriceChange = (min, max) => {
        if (min || max) {
            onApplyFilters({
                eventPrice: { min: Number(min) || 0, max: Number(max) || Infinity },
            });
        } else {
            removeFilter('eventPrice');
        }
    };

    const handleDateChange = (filter) => {
        if (filter) {
            const dateRange = formatDateForFilter(filter);
            onApplyFilters({ eventDateTime: dateRange });
        } else {
            removeFilter('eventDateTime');
        }
    };

    const handlePaidChange = (paidStatus) => {
        if (paidStatus !== null) {
            onApplyFilters({ paidEvent: paidStatus });
        } else {
            removeFilter('paidEvent');
        }
    };

    const handleAvailabilityChange = (availability) => {
        if (availability) {
            onApplyFilters({ availability });
        } else {
            removeFilter('availability');
        }
    };

    const handlePrimaryCategoryChange = (e) => {
        const category = e.target.value;
        setSelectedPrimaryCategory(category);

        if (category) {
            onApplyFilters({ primaryCategory: category });
        } else {
            removeFilter('primaryCategory');
        }
    };

    const handleSubcategoryChange = (subcategory) => {
        const updatedSubcategories = selectedSubcategories.includes(subcategory)
            ? selectedSubcategories.filter((item) => item !== subcategory)
            : [...selectedSubcategories, subcategory];

        setSelectedSubcategories(updatedSubcategories);

        if (updatedSubcategories.length > 0) {
            onApplyFilters({ subcategories: updatedSubcategories });
        } else {
            removeFilter('subcategories');
        }
    };

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
                <select
                    value={selectedPrimaryCategory}
                    onChange={handlePrimaryCategoryChange}
                    className="w-full mt-2 p-2"
                >
                    <option value="">Select a Category</option>
                    {Object.keys(categorizedOptions).map((category) => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                </select>

                {selectedPrimaryCategory && (
                    <div className="mt-3">
                        {categorizedOptions[selectedPrimaryCategory].map((subcategory) => (
                            <div key={subcategory}>
                                <input
                                    type="checkbox"
                                    checked={selectedSubcategories.includes(subcategory)}
                                    onChange={() => handleSubcategoryChange(subcategory)}
                                    className="mr-2"
                                />
                                <label>{subcategory}</label>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FiltersComponent;
