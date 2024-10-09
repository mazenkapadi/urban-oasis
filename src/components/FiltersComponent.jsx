const FiltersComponent = () => {
    return (
        <div className="w-1/4 pr-6">
            <h2 className="text-xl font-bold text-[#2B2D42] mb-4">Filters</h2>
            <div className="mb-6">
                <h3 className="font-semibold mb-1 text-[#2B2D42]">Category</h3>
                <ul className="space-y-2">
                    <li className="text-[#2B2D42]">Business</li>
                    <li className="text-[#2B2D42]">Food & Drink</li>
                    <li className="text-[#2B2D42]">Health</li>
                    <li className="text-[#2B2D42]">Music</li>
                    <li className="text-[#2B2D42]">View more</li>
                </ul>
            </div>
            <div className="mb-6">
                <h3 className="font-semibold mb-1 text-[#2B2D42]">Date</h3>
                <ul className="space-y-2">
                    <li className="text-[#2B2D42]">Today</li>
                    <li className="text-[#2B2D42]">Tomorrow</li>
                    <li className="text-[#2B2D42]">This weekend</li>
                    <li className="text-[#2B2D42]">Pick a date...</li>
                </ul>
            </div>
        </div>
    );
};

export default FiltersComponent;
