import { categorizedOptions } from "../services/dataObjects/categoryData";
import  {useState,useEffect} from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
const FiltersComponent = ({ onApplyFilters, activeFilters, removeFilter }) => {
    const { dateFilter, paid, availability, customDate, nearMe,priceRange,category} = activeFilters;
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [ selectedPrimaryCategory, setSelectedPrimaryCategory ] = useState('');
    const [ selectedSubcategories, setSelectedSubcategories ] = useState([]);

    useEffect(() => {
        if (minPrice || maxPrice) {
            onApplyFilters({ dateFilter, paid, customDate,availability,nearMe, priceRange: { min: minPrice, max: maxPrice } });
        } else {
            removeFilter("priceRange");
        }
    }, [minPrice, maxPrice]);

    useEffect(() => {
        if(selectedSubcategories.length<=0){
            removeFilter('category')
        }else{
        onApplyFilters({ dateFilter, paid, availability, customDate, nearMe, priceRange, category: selectedSubcategories });
    }
    }, [selectedSubcategories]);
    
   
    const handleDateFilterChange = (filter) => {
        if (dateFilter === filter) {
            removeFilter("dateFilter");
        } else {
            onApplyFilters({ dateFilter: filter, paid, customDate: null,availability,nearMe,priceRange });
        }
    };

    const handlePaidFilterChange = (paidStatus) => {
        if (paid === paidStatus) {
            removeFilter("paid");
        } else {
            onApplyFilters({ dateFilter, paid: paidStatus, customDate, availability, nearMe,priceRange  });
        }
    };

    const handleAvailabilityChange = (availabilityStatus) => {
        if (availability === availabilityStatus) {
            removeFilter("availability");
        } else {
            onApplyFilters({ dateFilter, paid, availability: availabilityStatus, customDate, nearMe,priceRange });
        }
    };

    const handleCustomDateChange = (event) => {
        const selectedDate = event.target.value;
        onApplyFilters({ dateFilter: null, paid, customDate: selectedDate, availability, nearMe,priceRange });
    };

    const handleNearMeFilterChange = () => {
        if (nearMe) {
            removeFilter("nearMe");
        } else {
            onApplyFilters({ dateFilter, paid, nearMe: true, customDate, availability,priceRange});
        }
    };

    const handlePrimaryCategoryChange = (e) => {
        const selectedCategory = e.target.value;
        setSelectedPrimaryCategory(selectedCategory);
        setSelectedSubcategories([]);
        
        if(!selectedCategory){
            removeFilter('category')
        }
    };

    const handleSubcategoryChange = (subcategory) => {
        console.log(subcategory)
        if (selectedSubcategories.includes(subcategory)) {
            setSelectedSubcategories(selectedSubcategories.filter((item)=> item !==subcategory));
        } else {
            setSelectedSubcategories([ ...selectedSubcategories, subcategory ]);
        } 

    };
    
    return (
        <div className="p-6 sticky left-10">
            <h2 className="text-xl font-bold text-[#2B2D42] mb-4">Filters</h2>
            <div className="mb-6">
                <h3 className="font-semibold mb-1 text-[#2B2D42]">Date</h3>
                <ul className="space-y-2">
                    {["Today", "Tomorrow", "Weekend"].map((filter) => (
                        <li key={filter} className="flex items-center">
                            <input
                                type="checkbox"
                                id={filter}
                                name="dateFilter"
                                value={filter}
                                checked={dateFilter === filter}
                                onChange={() => handleDateFilterChange(filter)}
                                className="mr-2"
                            />
                            <label
                                htmlFor={filter}
                                className={`cursor-pointer text-[#2B2D42]`}
                            >
                            {filter}
                            </label>
                        </li>
                    ))}
                     <li className="flex items-center">
                        <input
                            type="date"
                            id="customDate"
                            name="customDate"
                            value={customDate || ""}
                            onChange={handleCustomDateChange}
                            className="mr-2"
                        />
                    </li>
                </ul>
            </div>
            <div className="mb-6">
                <h3 className="font-semibold mb-1 text-[#2B2D42]">Price</h3>
                <ul className="space-y-2">
                    <li className="flex items-center">
                        <input
                            type="checkbox"
                            id="paid"
                            name="paidFilter"
                            value={true}
                            checked={paid === true}
                            onChange={() => handlePaidFilterChange(true)}
                            className="mr-2"
                        />
                        <label
                            htmlFor="paid"
                            className={'cursor-pointer text-[#2B2D42]'}
                        >
                            Paid
                        </label>
                    </li>
                    <li className="flex items-center">
                        <input
                            type="checkbox"
                            id="free"
                            name="paidFilter"
                            value={false}
                            checked={paid === false}
                            onChange={() => handlePaidFilterChange(false)}
                            className="mr-2"
                        />
                        <label
                            htmlFor="free"
                            className={'cursor-pointer text-[#2B2D42]'}
                        >
                            Free
                        </label>
                    </li>
                </ul>
            </div>
            <div className="mb-6">
                <h3 className="font-semibold mb-3 text-[#2B2D42]">Price Range</h3>
                <Box display="flex" gap={2}>
                    <TextField
                    label="Min"
                    variant="outlined"
                    size="small"
                    type="number"
                    
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    />
                    <TextField
                    label="Max"
                    variant="outlined"
                    size="small"
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    />
                </Box>
            </div>
            <div className="mb-6">
                <h3 className="font-semibold mb-1 text-[#2B2D42]">Availability</h3>
                <ul className="space-y-2">
                    <li className="flex items-center">
                        <input
                            type="checkbox"
                            id="available"
                            name="availabilityFilter"
                            value="Available"
                            checked={availability === "Available"}
                            onChange={() => handleAvailabilityChange("Available")}
                            className="mr-2"
                        />
                        <label htmlFor="available" className="cursor-pointer text-[#2B2D42]">
                            Available
                        </label>
                    </li>
                    <li className="flex items-center">
                        <input
                            type="checkbox"
                            id="unavailable"
                            name="availabilityFilter"
                            value="Unavailable"
                            checked={availability === "Unavailable"}
                            onChange={() => handleAvailabilityChange("Unavailable")}
                            className="mr-2"
                        />
                        <label htmlFor="unavailable" className="cursor-pointer text-[#2B2D42]">
                            Unavailable
                        </label>
                    </li>
                </ul>
            </div>
            <div className="mb-6">
                <h3 className="font-semibold mb-1 text-[#2B2D42]">Location</h3>
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="nearMe"
                        name="nearMeFilter"
                        value={true}
                        checked={nearMe === true}
                        onChange={handleNearMeFilterChange}
                        className="mr-2"
                    />
                    <label htmlFor="nearMe" className="cursor-pointer text-[#2B2D42]">
                        Near Me
                    </label>
                </div>
            </div>
            <div className="mb-6">
                <h3 className="font-semibold text-[#2B2D42]">Category</h3>
                <div >
                    <select
                        value={selectedPrimaryCategory}
                        onChange={handlePrimaryCategoryChange}
                        className="w-full mt-2 p-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                    <option value="" >Select a Category</option >
                    {Object.keys(categorizedOptions).map((category) => (
                        <option key={category} value={category} >
                            {category}
                        </option >
                    ))}
                    </select >
                </div >
                {selectedPrimaryCategory && (
                    <div className="mt-2"  >
                        <label className="text-sm font-semibold" >
                            {selectedPrimaryCategory} Subcategories
                        </label >
                        <div className="grid grid-cols-2 gap-2  mt-3" >
                            {categorizedOptions[selectedPrimaryCategory].map((subcategory) => (
                                <label key={subcategory}
                                        className="flex items-center space-x-2" >
                                    <input
                                        type="checkbox"
                                        checked={selectedSubcategories.includes(subcategory)}
                                        onChange={() => handleSubcategoryChange(subcategory)}
                                        className="form-checkbox h-4 w-4 text-indigo-500"
                                    />
                                    <span >{subcategory}</span >
                                </label >
                            ))}
                        </div >
                    </div >
                )}
            </div>

        </div>
    );
};

export default FiltersComponent;