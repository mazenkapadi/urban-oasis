const DropdownMenu = ({ isOpen }) => {
    if (!isOpen) return null;

    return (
        <div
            className="absolute left-0 right-0 bg-gray-900 z-10 p-4 transition-transform transform translate-y-0 opacity-100 duration-300 ease-in-out"
        >
            <div className="container mx-auto flex flex-col md:flex-row justify-around text-white">
                {/* Categories */}
                <div className="w-full md:w-1/4 mb-4">
                    <h3 className="font-semibold mb-2">Categories</h3>
                    <ul>
                        <li className="mb-1 hover:underline cursor-pointer">Category 1</li>
                        <li className="mb-1 hover:underline cursor-pointer">Category 2</li>
                        <li className="mb-1 hover:underline cursor-pointer">Category 3</li>
                        <li className="mb-1 hover:underline cursor-pointer">Category 4</li>
                    </ul>
                </div>

                {/* Genre */}
                <div className="w-full md:w-1/4 mb-4">
                    <h3 className="font-semibold mb-2">Genre</h3>
                    <ul>
                        <li className="mb-1 hover:underline cursor-pointer">Genre 1</li>
                        <li className="mb-1 hover:underline cursor-pointer">Genre 2</li>
                        <li className="mb-1 hover:underline cursor-pointer">Genre 3</li>
                        <li className="mb-1 hover:underline cursor-pointer">Genre 4</li>
                    </ul>
                </div>

                {/* Price */}
                <div className="w-full md:w-1/4 mb-4">
                    <h3 className="font-semibold mb-2">Price</h3>
                    <ul>
                        <li className="mb-1 hover:underline cursor-pointer">$0 - $50</li>
                        <li className="mb-1 hover:underline cursor-pointer">$50 - $100</li>
                        <li className="mb-1 hover:underline cursor-pointer">$100 - $200</li>
                        <li className="mb-1 hover:underline cursor-pointer">$200+</li>
                    </ul>
                </div>

                {/* Miscellaneous Links */}
                <div className="w-full md:w-1/4 mb-4">
                    <ul>
                        <li className="mb-1 hover:underline cursor-pointer">Upcoming Events</li>
                        <li className="mb-1 hover:underline cursor-pointer">Post Events</li>
                        <li className="mb-1 hover:underline cursor-pointer">Event Chat</li>
                        <li className="mb-1 hover:underline cursor-pointer">Support</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default DropdownMenu;
