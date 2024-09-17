import { useState } from "react";

const Navbar = () => {
    const [ menuOpen, setMenuOpen ] = useState(false);

    return (
        <div className="w-full bg-gray-800 text-white relative" >
            <div className="flex flex-col md:flex-row justify-between items-center p-4" >
                <div className="flex items-center mb-4 md:mb-0" >
                    <img
                        src="https://picsum.photos/50"
                        alt="Random Network File"
                        className="w-12 h-12 rounded-full"
                    />
                </div >
                <div
                    className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 flex-grow mx-4" >
                    <div className="bg-gray-700 p-2 rounded-md" >
                        <input
                            type="text"
                            value="zip/city"
                            readOnly
                            className="bg-transparent border-none outline-none text-white w-20"
                        />
                    </div >

                    <input
                        type="date"
                        className="bg-gray-700 p-2 rounded-md outline-none text-white date-picker"
                    />

                    <input
                        type="text"
                        placeholder="Search..."
                        className="bg-gray-700 p-2 rounded-md flex-grow outline-none"
                    />
                </div >

                <div className="flex items-center space-x-4" >
                    <div className="w-8 h-8 rounded-full overflow-hidden" >
                        <img
                            src="https://picsum.photos/32"
                            alt="Network"
                            className="w-full h-full object-cover"
                        />
                    </div >
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="focus:outline-none"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16m-7 6h7"
                            />
                        </svg >
                    </button >
                </div >
            </div >
            {menuOpen && (
                <div className="absolute left-0 right-0 bg-gray-900 z-10 p-4 mt-[-1px]" >
                    <div className="container mx-auto flex flex-col md:flex-row justify-around text-white" >
                        <div className="w-full md:w-1/4 mb-4 md:mb-0" >
                            <h3 className="font-semibold mb-2" >Categories</h3 >
                            <ul >
                                <li className="mb-1 hover:underline cursor-pointer" >
                                    Category 1
                                </li >
                                <li className="mb-1 hover:underline cursor-pointer" >
                                    Category 2
                                </li >
                                <li className="mb-1 hover:underline cursor-pointer" >
                                    Category 3
                                </li >
                                <li className="mb-1 hover:underline cursor-pointer" >
                                    Category 4
                                </li >
                            </ul >
                        </div >
                        <div className="w-full md:w-1/4 mb-4 md:mb-0" >
                            <h3 className="font-semibold mb-2" >Genre</h3 >
                            <ul >
                                <li className="mb-1 hover:underline cursor-pointer" >Genre 1</li >
                                <li className="mb-1 hover:underline cursor-pointer" >Genre 2</li >
                                <li className="mb-1 hover:underline cursor-pointer" >Genre 3</li >
                                <li className="mb-1 hover:underline cursor-pointer" >Genre 4</li >
                            </ul >
                        </div >
                        <div className="w-full md:w-1/4 mb-4 md:mb-0" >
                            <h3 className="font-semibold mb-2" >Price</h3 >
                            <ul >
                                <li className="mb-1 hover:underline cursor-pointer" >
                                    $0 - $50
                                </li >
                                <li className="mb-1 hover:underline cursor-pointer" >
                                    $50 - $100
                                </li >
                                <li className="mb-1 hover:underline cursor-pointer" >
                                    $100 - $200
                                </li >
                                <li className="mb-1 hover:underline cursor-pointer" >$200+</li >
                            </ul >
                        </div >
                        <div className="w-full md:w-1/4 mb-4 md:mb-0" >
                            <ul >
                                <li className="mb-1 hover:underline cursor-pointer" >
                                    Upcoming Events
                                </li >
                                <li className="mb-1 hover:underline cursor-pointer" >
                                    Post Events
                                </li >
                                <li className="mb-1 hover:underline cursor-pointer" >
                                    Event Chat
                                </li >
                                <li className="mb-1 hover:underline cursor-pointer" >Support</li >
                            </ul >
                        </div >
                    </div >
                </div >
            )}
        </div >
    );
};

export default Navbar;
