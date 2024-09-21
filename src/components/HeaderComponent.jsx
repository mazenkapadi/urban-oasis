import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchBarComponent from "./SearchBarComponent";

const HeaderComponent = () => {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const user = localStorage.getItem("user");
        setIsLoggedIn(!!user);

        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            setIsScrolled(scrollPosition > 50);
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const handleSignIn = () => {
        navigate("/signIn");
    };

    return (
        <div
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
                isScrolled
                    ? "bg-gray-800/40 backdrop-blur-lg p-4 rounded-lg mt-4 mx-4 shadow-lg"
                    : "bg-gray-800 p-2"
            }`}
        >
            <div className="p-2" >
                <div className="flex flex-col md:flex-row justify-between items-center" >
                    {/* Logo Section */}
                    <div className="flex items-center mb-4 md:mb-0" >
                        <img
                            src="../../assets/Oasis.png"
                            alt="Oasis Logo"
                            className="w-12 h-auto"
                        />
                        <span className="ml-2 text-white text-2xl font-archivo" >Urban Oasis</span >
                    </div >

                    <SearchBarComponent />

                    {/* User Profile / Sign In and Menu Button */}
                    <div className="flex items-center space-x-4" >
                        {isLoggedIn ? (
                            <div className="w-10 h-10 rounded-lg overflow-hidden" >
                                <img
                                    src="https://picsum.photos/32"
                                    alt="User Profile"
                                    className="w-full h-full object-cover"
                                />
                            </div >
                        ) : (
                            <button
                                className="rounded-lg bg-gray-900 text-gray-200 px-6 py-2"
                                onClick={handleSignIn}
                            >
                                Sign In
                            </button >
                        )}
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            onMouseEnter={() => setMenuOpen(true)} // Show menu on hover
                            onMouseLeave={() => setMenuOpen(false)} // Hide menu on mouse leave
                            className="focus:outline-none relative"
                        >
                            <svg
                                className="w-10 h-10 text-white"
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
            </div >

            {/* Dropdown Menu */}
            {menuOpen && (
                <div
                    className="absolute left-0 right-0 bg-gray-900 z-10 p-4 transition-transform transform translate-y-0 opacity-100 duration-300 ease-in-out"
                    onMouseEnter={() => setMenuOpen(true)} // Keep menu open when hovering over it
                    onMouseLeave={() => setMenuOpen(false)} // Hide menu on mouse leave
                >
                    <div className="container mx-auto flex flex-col md:flex-row justify-around text-white" >
                        {/* Categories */}
                        <div className="w-full md:w-1/4 mb-4" >
                            <h3 className="font-semibold mb-2" >Categories</h3 >
                            <ul >
                                <li className="mb-1 hover:underline cursor-pointer" >Category 1</li >
                                <li className="mb-1 hover:underline cursor-pointer" >Category 2</li >
                                <li className="mb-1 hover:underline cursor-pointer" >Category 3</li >
                                <li className="mb-1 hover:underline cursor-pointer" >Category 4</li >
                            </ul >
                        </div >

                        {/* Genre */}
                        <div className="w-full md:w-1/4 mb-4" >
                            <h3 className="font-semibold mb-2" >Genre</h3 >
                            <ul >
                                <li className="mb-1 hover:underline cursor-pointer" >Genre 1</li >
                                <li className="mb-1 hover:underline cursor-pointer" >Genre 2</li >
                                <li className="mb-1 hover:underline cursor-pointer" >Genre 3</li >
                                <li className="mb-1 hover:underline cursor-pointer" >Genre 4</li >
                            </ul >
                        </div >

                        {/* Price */}
                        <div className="w-full md:w-1/4 mb-4" >
                            <h3 className="font-semibold mb-2" >Price</h3 >
                            <ul >
                                <li className="mb-1 hover:underline cursor-pointer" >$0 - $50</li >
                                <li className="mb-1 hover:underline cursor-pointer" >$50 - $100</li >
                                <li className="mb-1 hover:underline cursor-pointer" >$100 - $200</li >
                                <li className="mb-1 hover:underline cursor-pointer" >$200+</li >
                            </ul >
                        </div >

                        {/* Miscellaneous Links */}
                        <div className="w-full md:w-1/4 mb-4" >
                            <ul >
                                <li className="mb-1 hover:underline cursor-pointer" >Upcoming Events</li >
                                <li className="mb-1 hover:underline cursor-pointer" >Post Events</li >
                                <li className="mb-1 hover:underline cursor-pointer" >Event Chat</li >
                                <li className="mb-1 hover:underline cursor-pointer" >Support</li >
                            </ul >
                        </div >
                    </div >
                </div >
            )}
        </div >
    );
};

export default HeaderComponent;
