const FiltersComponent = ({ onApplyFilters, activeFilters, removeFilter }) => {
    const { dateFilter, paid } = activeFilters;

    const handleDateFilterChange = (filter) => {
        if (dateFilter === filter) {
            removeFilter("dateFilter");
        } else {
            onApplyFilters({ dateFilter: filter, paid });
        }
    };

    const handlePaidFilterChange = (paidStatus) => {
        if (paid === paidStatus) {
            removeFilter("paid");
        } else {
            onApplyFilters({ dateFilter, paid: paidStatus });
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
        </div>
    );
};

export default FiltersComponent;