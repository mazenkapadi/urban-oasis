import { Link } from "react-router-dom"; // Ensure you have react-router-dom installed

const FiltersComponent = () => {
    return (
        <div className="p-6 sticky left-10">
            <h2 className="text-xl font-bold text-[#2B2D42] mb-4">Filters</h2>
            <div className="mb-6">
                <h3 className="font-semibold mb-1 text-[#2B2D42]">Category</h3>
                <ul className="space-y-2">
                    <li>
                        <Link to="/events/business" className="text-[#2B2D42] ">
                            Business
                        </Link>
                    </li>
                    <li>
                        <Link to="/events/food-drink" className="text-[#2B2D42] ">
                            Food & Drink
                        </Link>
                    </li>
                    <li>
                        <Link to="/events/health" className="text-[#2B2D42]">
                            Health
                        </Link>
                    </li>
                    <li>
                        <Link to="/events/music" className="text-[#2B2D42]">
                            Music
                        </Link>
                    </li>
                    <li>
                        <Link to="/events/more" className="text-[#2B2D42]">
                            View more
                        </Link>
                    </li>
                </ul>
            </div>
            <div className="mb-6">
                <h3 className="font-semibold mb-1 text-[#2B2D42]">Date</h3>
                <ul className="space-y-2">
                    <li>
                        <Link to="/events/today" className="text-[#2B2D42]">
                            Today
                        </Link>
                    </li>
                    <li>
                        <Link to="/events/tomorrow" className="text-[#2B2D42]">
                            Tomorrow
                        </Link>
                    </li>
                    <li>
                        <Link to="/events/this-weekend" className="text-[#2B2D42]">
                            This weekend
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default FiltersComponent;
