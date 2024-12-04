import React, {useEffect, useState} from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Slider from "@mui/material/Slider";
import { formatDateForFilter } from "../utils/dateHelpers.jsx";
import themeManager from "../utils/themeManager.jsx";
import resolveConfig from "tailwindcss/resolveConfig.js";
import tailwindConfig from "../../tailwind.config.js";

const FiltersComponent = ({
                              activeFilters,
                              onApplyFilters,
                              removeFilter,
                          }) => {
    const fullConfig = resolveConfig(tailwindConfig);
    const colors = fullConfig.theme.colors;
    const categories = [
        { label: "Film & Media", count: 2 },
        { label: "Food & Drink", count: 4 },
        { label: "Art", count: 2 },
        { label: "Comedy", count: 2 },
        { label: "Family & Kids", count: 1 },
        { label: "Health", count: 3 },
        { label: "Mental Health", count: 2 },
        { label: "Music", count: 2 },
        { label: "Networking", count: 1 },
        { label: "Photography & Art Exhibits", count: 2 },
        { label: "Shopping & Markets", count: 1 },
        { label: "Spirituality & Wellness", count: 2 },
        { label: "Technology", count: 0 },
        { label: "Uncategorized", count: 1 },
        { label: "Wine Tasting", count: 1 },
    ];

    const [showMoreCategories, setShowMoreCategories] = useState(false);
    const visibleCategoryCount = 5; // Number of categories to show in "Show Less" mode
    const [priceRange, setPriceRange] = useState([0, 1000]); // Default price range
    const [ darkMode, setDarkMode ] = useState(themeManager.isDarkMode);

    useEffect(() => {
        const handleThemeChange = (isDark) => setDarkMode(isDark);
        themeManager.addListener(handleThemeChange);

        return () => {
            themeManager.removeListener(handleThemeChange);
        };
    }, []);

    // Handle Paid/Free Filter
    const handlePaidChange = (paidStatus) => {
        if (paidStatus !== null) {
            onApplyFilters({ paidEvent: paidStatus });
        } else {
            removeFilter("paidEvent");
        }
    };

    // Handle Slider Change for Price Range
    const handleSliderChange = (event, newValue) => {
        setPriceRange(newValue);
        onApplyFilters({
            eventPrice: { min: newValue[0], max: newValue[1] },
        });
    };

    // Handle Date Filter
    const handleDateChange = (filter) => {
        const dateRange = formatDateForFilter(filter);

        if (dateRange) {
            onApplyFilters({ eventDateTime: filter });
        } else {
            removeFilter("eventDateTime");
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
            removeFilter("categories");
        }
    };

    const toggleShowMoreCategories = () => {
        setShowMoreCategories(!showMoreCategories);
    };

    const removeAllFilters = () => {
        const filterKeys = [
            "eventDateTime",
            "eventPrice",
            "paidEvent",
            "availability",
            "categories",
        ];
        filterKeys.forEach((key) => removeFilter(key));
    };

    const displayedCategories = showMoreCategories
        ? categories
        : categories.slice(0, visibleCategoryCount);

    return (
        <div className={`p-6 sticky top-0 ${darkMode ? "bg-Dark-D1 text-primary-light border-Dark-D2" :  "bg-Light-L3 text-primary-dark border-Light-L1"} border-r h-full font-roboto`}>
            <h2 className="text-xl font-bold flex justify-between items-center">
                Filters
                <button
                    className="text-accent-red underline text-sm hover:text-accent-orange"
                    onClick={removeAllFilters}
                >
                    Clear All
                </button>
            </h2>

            {/* Date Filter */}
            <div className="mb-6">
                <h3 className="font-semibold mb-1">Date</h3>
                <ul className="space-y-2">
                    {["Today", "Tomorrow", "Weekend"].map((filter) => (
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
                <Box className="flex flex-col gap-2">
                    <Slider
                        value={priceRange}
                        onChange={handleSliderChange}
                        valueLabelDisplay="auto"
                        min={0}
                        max={1000}
                        step={10}
                        className="dark:bg-accent-white"
                    />
                    <Box display="flex" gap={2}>
                        <TextField
                            label="Min"
                            type="number"
                            value={priceRange[0]}
                            onChange={(e) => handleSliderChange(null, [Number(e.target.value), priceRange[1]])}
                            InputLabelProps={{
                                style: { color: darkMode ? colors["primary-light"] : colors["primary-dark"]}, // Make label white in dark mode
                            }}
                            InputProps={{
                                style: { color: darkMode ? colors["primary-light"] : colors["primary-dark"]}, // Make input text white in dark mode
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: darkMode ? colors["primary-light"] : colors["primary-dark"],
                                    },
                                },
                            }}

                        />
                        <TextField
                            label="Max"
                            type="number"
                            value={priceRange[1]}
                            onChange={(e) => handleSliderChange(null, [priceRange[0], Number(e.target.value)])}
                            InputLabelProps={{
                                style: { color: darkMode ? colors["primary-light"] : colors["primary-dark"]}, // Make label white in dark mode
                            }}
                            InputProps={{
                                style: { color: darkMode ? colors["primary-light"] : colors["primary-dark"]}, // Make input text white in dark mode
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: darkMode ? colors["primary-light"] : colors["primary-dark"],
                                    },
                                },
                            }}
                        />
                    </Box>
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
                    className="text-accent-blue mt-2 underline"
                >
                    {showMoreCategories ? "Show Less" : "Show More"}
                </button>
            </div>
        </div>
    );
};

export default FiltersComponent
