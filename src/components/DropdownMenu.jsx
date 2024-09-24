const DropdownMenu = ({ isOpen }) => {
    if (!isOpen) return null;

    return (
        <div
            className="absolute left-0 right-0 bg-primary-dark z-10 p-4 transition-transform transform translate-y-0 opacity-100 duration-300 ease-in-out"
        >
            <div className="container mx-auto flex flex-col md:flex-row justify-around text-text-gray">
                {/* Categories */}
                <div className="w-full md:w-1/4 mb-4">
                    <h3 className="font-semibold mb-2 text-primary-light">Categories</h3>
                    <ul>
                        <li className="mb-1 hover:underline cursor-pointer hover:text-detail-orange">Category 1</li>
                        <li className="mb-1 hover:underline cursor-pointer hover:text-detail-orange">Category 2</li>
                        <li className="mb-1 hover:underline cursor-pointer hover:text-detail-orange">Category 3</li>
                        <li className="mb-1 hover:underline cursor-pointer hover:text-detail-orange">Category 4</li>
                    </ul>
                </div>

                {/* Genre */}
                <div className="w-full md:w-1/4 mb-4">
                    <h3 className="font-semibold mb-2 text-primary-light">Genre</h3>
                    <ul>
                        <li className="mb-1 hover:underline cursor-pointer hover:text-detail-orange">Genre 1</li>
                        <li className="mb-1 hover:underline cursor-pointer hover:text-detail-orange">Genre 2</li>
                        <li className="mb-1 hover:underline cursor-pointer hover:text-detail-orange">Genre 3</li>
                        <li className="mb-1 hover:underline cursor-pointer hover:text-detail-orange">Genre 4</li>
                    </ul>
                </div>

                {/* Price */}
                <div className="w-full md:w-1/4 mb-4">
                    <h3 className="font-semibold mb-2 text-primary-light">Price</h3>
                    <ul>
                        <li className="mb-1 hover:underline cursor-pointer hover:text-detail-orange">$0 - $50</li>
                        <li className="mb-1 hover:underline cursor-pointer hover:text-detail-orange">$50 - $100</li>
                        <li className="mb-1 hover:underline cursor-pointer hover:text-detail-orange">$100 - $200</li>
                        <li className="mb-1 hover:underline cursor-pointer hover:text-detail-orange">$200+</li>
                    </ul>
                </div>

                {/* Miscellaneous Links */}
                <div className="w-full md:w-1/4 mb-4">
                    <ul>
                        <li className="mb-1 hover:underline cursor-pointer hover:text-detail-orange">Upcoming Events</li>
                        <li className="mb-1 hover:underline cursor-pointer hover:text-detail-orange">Post Events</li>
                        <li className="mb-1 hover:underline cursor-pointer hover:text-detail-orange">Event Chat</li>
                        <li className="mb-1 hover:underline cursor-pointer hover:text-detail-orange">Support</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default DropdownMenu;
