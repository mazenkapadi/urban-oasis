// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import SearchBarComponent from "./SearchBarComponent"; // Import the new component
//
// const HeaderComponent = () => {
//     const navigate = useNavigate();
//     const [ menuOpen, setMenuOpen ] = useState(false);
//     const [ isLoggedIn, setIsLoggedIn ] = useState(false);
//
//     useEffect(() => {
//         const user = localStorage.getItem("user");
//         setIsLoggedIn(!!user);
//     }, []);
//
//     const handleSignIn = () => {
//         navigate("/signIn");
//     };
//
//     return (
//         <div className="w-full bg-gray-800 text-white relative" >
//             <div className="p-4" >
//                 <div className="flex flex-col md:flex-row justify-between items-center mb-4" >
//                     <div className="flex items-center mb-4 md:mb-0" >
//                         <img
//                             src="https://picsum.photos/32"
//                             alt="Random Network File"
//                             className="w-12 h-12 rounded-lg"
//                         />
//                     </div >
//                     <SearchBarComponent />
//                     <div className="flex items-center space-x-4" >
//                         {isLoggedIn ? (
//                             <div className="w-10 h-10 rounded-lg overflow-hidden" >
//                                 <img
//                                     src="https://picsum.photos/32"
//                                     alt="User Profile"
//                                     className="w-full h-full object-cover"
//                                 />
//                             </div >
//                         ) : (
//                             <button
//                                 className="rounded-lg bg-gray-900 text-gray-200 px-6 py-2 flex items-center justify-center"
//                                 onClick={handleSignIn}
//                             >
//                                 Sign In
//                             </button >
//                         )}
//                         <button
//                             onClick={() => setMenuOpen(!menuOpen)}
//                             className="focus:outline-none"
//                         >
//                             <svg
//                                 className="w-10 h-10"
//                                 fill="none"
//                                 stroke="currentColor"
//                                 viewBox="0 0 24 24"
//                                 xmlns="http://www.w3.org/2000/svg"
//                             >
//                                 <path
//                                     strokeLinecap="round"
//                                     strokeLinejoin="round"
//                                     strokeWidth={2}
//                                     d="M4 6h16M4 12h16m-7 6h7"
//                                 />
//                             </svg >
//                         </button >
//                     </div >
//                 </div >
//
//
//             </div >
//
//             {menuOpen && (
//                 <div className="absolute left-0 right-0 bg-gray-900 z-10 p-4 mt-[-1px]" >
//                     <div className="container mx-auto flex flex-col md:flex-row justify-around text-white" >
//                         <div className="w-full md:w-1/4 mb-4 md:mb-0" >
//                             <h3 className="font-semibold mb-2" >Categories</h3 >
//                             <ul >
//                                 <li className="mb-1 hover:underline cursor-pointer" >Category 1</li >
//                                 <li className="mb-1 hover:underline cursor-pointer" >Category 2</li >
//                                 <li className="mb-1 hover:underline cursor-pointer" >Category 3</li >
//                                 <li className="mb-1 hover:underline cursor-pointer" >Category 4</li >
//                             </ul >
//                         </div >
//                         <div className="w-full md:w-1/4 mb-4 md:mb-0" >
//                             <h3 className="font-semibold mb-2" >Genre</h3 >
//                             <ul >
//                                 <li className="mb-1 hover:underline cursor-pointer" >Genre 1</li >
//                                 <li className="mb-1 hover:underline cursor-pointer" >Genre 2</li >
//                                 <li className="mb-1 hover:underline cursor-pointer" >Genre 3</li >
//                                 <li className="mb-1 hover:underline cursor-pointer" >Genre 4</li >
//                             </ul >
//                         </div >
//                         <div className="w-full md:w-1/4 mb-4 md:mb-0" >
//                             <h3 className="font-semibold mb-2" >Price</h3 >
//                             <ul >
//                                 <li className="mb-1 hover:underline cursor-pointer" >$0 - $50</li >
//                                 <li className="mb-1 hover:underline cursor-pointer" >$50 - $100</li >
//                                 <li className="mb-1 hover:underline cursor-pointer" >$100 - $200</li >
//                                 <li className="mb-1 hover:underline cursor-pointer" >$200+</li >
//                             </ul >
//                         </div >
//                         <div className="w-full md:w-1/4 mb-4 md:mb-0" >
//                             <ul >
//                                 <li className="mb-1 hover:underline cursor-pointer" >Upcoming Events</li >
//                                 <li className="mb-1 hover:underline cursor-pointer" >Post Events</li >
//                                 <li className="mb-1 hover:underline cursor-pointer" >Event Chat</li >
//                                 <li className="mb-1 hover:underline cursor-pointer" >Support</li >
//                             </ul >
//                         </div >
//                     </div >
//                 </div >
//             )}
//         </div >
//     );
// };
//
// export default HeaderComponent;


import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchBarComponent from "./SearchBarComponent";

const HeaderComponent = () => {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const user = localStorage.getItem("user");
        setIsLoggedIn(!!user);
    }, []);

    const handleSignIn = () => {
        navigate("/signIn");
    };

    return (
        <div className="w-full bg-gray-800 text-white relative">
            <div className="p-4">
                <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                    {/* Logo Section */}
                    <div className="flex items-center mb-4 md:mb-0">
                        <img
                            src="https://picsum.photos/32"
                            alt="Random Network File"
                            className="w-12 h-12 rounded-lg"
                        />
                    </div>

                    {/* Search Bar */}
                    <SearchBarComponent />

                    {/* User Profile / Sign In and Menu Button */}
                    <div className="flex items-center space-x-4">
                        {isLoggedIn ? (
                            <div className="w-10 h-10 rounded-lg overflow-hidden">
                                <img
                                    src="https://picsum.photos/32"
                                    alt="User Profile"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ) : (
                            <button
                                className="rounded-lg bg-gray-900 text-gray-200 px-6 py-2"
                                onClick={handleSignIn}
                            >
                                Sign In
                            </button>
                        )}
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="focus:outline-none"
                        >
                            <svg
                                className="w-10 h-10"
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
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Dropdown Menu */}
            {menuOpen && (
                <div className="absolute left-0 right-0 bg-gray-900 z-10 p-4">
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
            )}
        </div>
    );
};

export default HeaderComponent;
