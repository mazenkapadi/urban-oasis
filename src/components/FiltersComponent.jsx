import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { categorizedOptions } from "../services/categoryData";

const FiltersComponent = ({ onApplyFilters, activeFilters = {}, removeFilter }) => {
    const {
        dateFilter = '',
        paid = null,
        availability = '',
        customDate = '',
        nearMe = false,
        priceRange = { min: '', max: '' },
        category = [],
    } = activeFilters;

    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [selectedPrimaryCategory, setSelectedPrimaryCategory] = useState('');
    const [selectedSubcategories, setSelectedSubcategories] = useState([]);
    const [nearMeChecked, setNearMeChecked] = useState(nearMe);

    // Handle Price Range Changes
    useEffect(() => {
        if (minPrice || maxPrice) {
            onApplyFilters({ 'eventDetails.eventPrice': { min: minPrice, max: maxPrice } });
        } else {
            removeFilter('eventDetails.eventPrice');
        }
    }, [minPrice, maxPrice]);

    // Handle Category Changes
    useEffect(() => {
        if (selectedSubcategories.length > 0) {
            onApplyFilters({ 'basicInfo.categories': selectedSubcategories });
        } else {
            removeFilter('basicInfo.categories');
        }
    }, [selectedSubcategories]);

    // Handle Date Change
    const handleCustomDateChange = (event) => {
        const selectedDate = event.target.value;
        onApplyFilters({ 'eventDetails.eventDateTime': selectedDate });
    };

    // Handle Near Me Change
    const handleNearMeChange = () => {
        setNearMeChecked(!nearMeChecked);
        if (!nearMeChecked) {
            onApplyFilters({ nearMe: true });
        } else {
            removeFilter('nearMe');
        }
    };

    // Handle Date Filter Change
    const handleDateFilterChange = (filter) => {
        if (dateFilter === filter) {
            removeFilter('dateFilter');
        } else {
            onApplyFilters({ dateFilter: filter });
        }
    };

    // Handle Paid Filter Change
    const handlePaidFilterChange = (paidStatus) => {
        if (paid === paidStatus) {
            removeFilter('eventDetails.paidEvent');
        } else {
            onApplyFilters({ 'eventDetails.paidEvent': paidStatus });
        }
    };

    // Handle Availability Filter Change
    const handleAvailabilityChange = (availabilityStatus) => {
        if (availability === availabilityStatus) {
            removeFilter('availability');
        } else {
            onApplyFilters({ 'availability.fbAvail': availabilityStatus === 'Available' });
        }
    };

    // Handle Primary Category Change
    const handlePrimaryCategoryChange = (e) => {
        const selectedCategory = e.target.value;
        setSelectedPrimaryCategory(selectedCategory);
        setSelectedSubcategories([]);

        if (!selectedCategory) {
            removeFilter('basicInfo.categories');
        }
    };

    // Handle Subcategory Change
    const handleSubcategoryChange = (subcategory) => {
        if (selectedSubcategories.includes(subcategory)) {
            setSelectedSubcategories(selectedSubcategories.filter((item) => item !== subcategory));
        } else {
            setSelectedSubcategories([...selectedSubcategories, subcategory]);
        }
    };

    return (
        <div className="p-6 sticky top-0 bg-white border-r border-gray-200 h-full">
            <h2 className="text-xl font-bold">Filters</h2>

            {/* Date Filter */}
            <div className="mb-6">
                <h3 className="font-semibold mb-1">Date</h3>
                <ul className="space-y-2">
                    {["Today", "Tomorrow", "Weekend"].map((filter) => (
                        <li key={filter}>
                            <input
                                type="checkbox"
                                checked={dateFilter === filter}
                                onChange={() => handleDateFilterChange(filter)}
                                className="mr-2"
                            />
                            <label>{filter}</label>
                        </li>
                    ))}
                    <input
                        type="date"
                        value={customDate}
                        onChange={handleCustomDateChange}
                        className="mt-2"
                    />
                </ul>
            </div>

            {/* Price Range Filter */}
            <div className="mb-6">
                <h3 className="font-semibold mb-1">Price Range</h3>
                <Box display="flex" gap={2}>
                    <TextField
                        label="Min"
                        type="number"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                    />
                    <TextField
                        label="Max"
                        type="number"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                    />
                </Box>
            </div>

            {/* Paid Filter */}
            <div className="mb-6">
                <h3 className="font-semibold mb-1">Price</h3>
                <ul>
                    <li>
                        <input
                            type="checkbox"
                            checked={paid === true}
                            onChange={() => handlePaidFilterChange(true)}
                            className="mr-2"
                        />
                        <label>Paid</label>
                    </li>
                    <li>
                        <input
                            type="checkbox"
                            checked={paid === false}
                            onChange={() => handlePaidFilterChange(false)}
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
                            checked={availability === 'Available'}
                            onChange={() => handleAvailabilityChange('Available')}
                            className="mr-2"
                        />
                        <label>Available</label>
                    </li>
                    <li>
                        <input
                            type="checkbox"
                            checked={availability === 'Unavailable'}
                            onChange={() => handleAvailabilityChange('Unavailable')}
                            className="mr-2"
                        />
                        <label>Unavailable</label>
                    </li>
                </ul>
            </div>

            {/* Near Me Filter */}
            <div className="mb-6">
                <h3 className="font-semibold mb-1">Location</h3>
                <input
                    type="checkbox"
                    checked={nearMeChecked}
                    onChange={handleNearMeChange}
                />
                <label className="ml-2">Near Me</label>
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
                                />
                                <label className="ml-2">{subcategory}</label>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FiltersComponent;
