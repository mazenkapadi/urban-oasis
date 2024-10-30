const FiltersComponent = ({ onApplyFilters, activeFilters, removeFilter }) => {
    const { dateFilter, paid, availability, customDate, nearMe} = activeFilters;

    const handleDateFilterChange = (filter) => {
        if (dateFilter === filter) {
            removeFilter("dateFilter");
        } else {
            onApplyFilters({ dateFilter: filter, paid, customDate: null,availability,nearMe });
        }
    };

    const handlePaidFilterChange = (paidStatus) => {
        if (paid === paidStatus) {
            removeFilter("paid");
        } else {
            onApplyFilters({ dateFilter, paid: paidStatus, customDate, availability, nearMe  });
        }
    };

    const handleAvailabilityChange = (availabilityStatus) => {
        if (availability === availabilityStatus) {
            removeFilter("availability");
        } else {
            onApplyFilters({ dateFilter, paid, availability: availabilityStatus, customDate, nearMe });
        }
    };

    const handleCustomDateChange = (event) => {
        const selectedDate = event.target.value;
        onApplyFilters({ dateFilter: null, paid, customDate: selectedDate, availability, nearMe });
    };

    const handleNearMeFilterChange = () => {
        if (nearMe) {
            removeFilter("nearMe");
        } else {
            onApplyFilters({ dateFilter, paid, nearMe: true, customDate, availability});
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
        </div>
    );
};

export default FiltersComponent;