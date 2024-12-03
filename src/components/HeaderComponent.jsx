import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {getAuth, onAuthStateChanged, signOut} from "firebase/auth";
import {doc, getDoc} from "firebase/firestore";
import {db} from "../firebaseConfig";
import GeoSearchBar from "./GeoSearchBar";
import EventSearchBar from "./EventSearchBar";
import {DateRangePicker} from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import AutocompleteSearch from "./AutoCompleteSearch.jsx";
import ThemeToggle from "./ThemeToggle.jsx";

const HeaderComponent = ({onSearch}) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [name, setName] = useState("User");
    const [profilePic, setProfilePic] = useState("");
    const [isHost, setIsHost] = useState(false);
    const [geoLocation, setGeoLocation] = useState(null);
    const [eventQuery, setEventQuery] = useState("");
    const [dateRange, setDateRange] = useState({startDate: null, endDate: null});
    const [showDatePicker, setShowDatePicker] = useState(false);
    const navigate = useNavigate();

    // Effect to handle authentication state
    useEffect(() => {
        const authInstance = getAuth();
        const unsubscribe = onAuthStateChanged(authInstance, async (user) => {
            setIsLoggedIn(!!user);
            if (user) {
                try {
                    const userDocRef = doc(db, "Users", user.uid);
                    const userDocSnap = await getDoc(userDocRef);
                    if (userDocSnap.exists()) {
                        const userData = userDocSnap.data();
                        setName(userData.name?.firstName || "User");
                        setProfilePic(userData.profilePic || "");
                        setIsHost(userData.isHost || false);
                    } else {
                        console.warn("No such document in Firestore!");
                    }
                } catch (error) {
                    console.error("Error fetching profile data from Firestore:", error);
                }
            }
        });
        return () => unsubscribe();
    }, []);

    // Toggle menu
    const toggleMenu = () => {
        setMenuOpen((prev) => !prev);
    };

    // Handle user sign out
    const handleSignOut = () => {
        const authInstance = getAuth();
        signOut(authInstance)
            .then(() => {
                setIsLoggedIn(false);
                navigate("/");
            })
            .catch((error) => console.error("Error signing out:", error));
    };

    // Handle search functionality
    const handleSearch = () => {
        if (onSearch) {
            onSearch({
                geoLocation,
                eventQuery,
                dateRange: dateRange.startDate && dateRange.endDate ? dateRange : null,
            });
        } else {
            console.error("Search function is not provided to HeaderComponent");
        }
    };

    // Handle date range changes
    const handleDateChange = (ranges) => {
        const {startDate, endDate} = ranges.selection;
        setDateRange({startDate, endDate});
    };

    return (
        <header className="bg-transparent w-full gap-6">
            <div className="flex justify-between items-center px-8 py-4 space-x-4">
                {/* Logo */}
                <div className="flex-shrink-0">
                    <button onClick={() => navigate("/")}>
                        <span
                            className="text-white text-h1 font-lalezar"
                            style={{textShadow: "4px 3px 4px rgba(0, 0, 0, 0.8)"}}
                        >
                            Urban Oasis
                        </span>
                    </button>
                </div>


                {/* Search Section */}
                {/*<div className="flex items-center gap-4">*/}
                {/*    <GeoSearchBar onGeoSearch={(geo) => setGeoLocation(geo)}/>*/}

                {/*    /!* Date Picker *!/*/}
                {/*    <div className="relative">*/}
                {/*        <button*/}
                {/*            className="w-full py-2 px-4 border rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-blue-400 focus:outline-none"*/}
                {/*            onClick={() => setShowDatePicker(!showDatePicker)}*/}
                {/*        >*/}
                {/*            {dateRange.startDate && dateRange.endDate*/}
                {/*                ? `${dateRange.startDate.toLocaleDateString()} - ${dateRange.endDate.toLocaleDateString()}`*/}
                {/*                : "Select Dates"}*/}
                {/*        </button>*/}
                {/*        {showDatePicker && (*/}
                {/*            <div className="absolute top-12 z-50 bg-white shadow-lg p-4">*/}
                {/*                <DateRangePicker*/}
                {/*                    ranges={[*/}
                {/*                        {*/}
                {/*                            startDate: dateRange.startDate || new Date(),*/}
                {/*                            endDate: dateRange.endDate || new Date(),*/}
                {/*                            key: "selection",*/}
                {/*                        },*/}
                {/*                    ]}*/}
                {/*                    onChange={handleDateChange}*/}
                {/*                />*/}
                {/*            </div>*/}
                {/*        )}*/}
                {/*    </div>*/}

                {/*    <EventSearchBar onEventSearch={(query) => setEventQuery(query)}/>*/}

                {/*    <button*/}
                {/*        className="bg-red-500 text-white rounded-lg px-6 py-2 hover:bg-red-600 transition-all"*/}
                {/*        onClick={handleSearch}*/}
                {/*    >*/}
                {/*        Search*/}
                {/*    </button>*/}
                {/*</div>*/}

                <div className="flex items-center gap-8 w-full px-4">
                    {/* GeoSearchBar */}
                    <div className="flex-1 max-w-sm ">
                        <GeoSearchBar onGeoSearch={(geo) => setGeoLocation(geo)}/>
                    </div>

                    {/* Date Picker */}
                    <div className="flex-1 max-w-sm">
                        <button
                            className="w-full h-12 px-4 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring focus:ring-blue-300 focus:outline-none"
                            onClick={() => setShowDatePicker(!showDatePicker)}
                        >
                            {dateRange.startDate && dateRange.endDate
                                ? `${dateRange.startDate.toLocaleDateString()} - ${dateRange.endDate.toLocaleDateString()}`
                                : "All Dates"}
                        </button>
                        {showDatePicker && (
                            <div className="absolute top-12 z-50 bg-white shadow-lg p-4">
                                <DateRangePicker
                                    ranges={[
                                        {
                                            startDate: dateRange.startDate || new Date(),
                                            endDate: dateRange.endDate || new Date(),
                                            key: "selection",
                                        },
                                    ]}
                                    onChange={handleDateChange}
                                />
                            </div>
                        )}
                    </div>

                    {/* EventSearchBar */}
                    <div className="flex-1 max-w-sm">
                        <div className="relative w-full">
                            <input
                                type="text"
                                value={eventQuery}
                                onChange={(e) => setEventQuery(e.target.value)}
                                placeholder="Search events..."
                                className="w-full h-12 px-4 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring focus:ring-blue-300 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Search Button */}
                    <button
                        className="h-12 px-6 bg-red-500 text-white rounded-full focus:ring focus:ring-red-300 focus:outline-none"
                        onClick={handleSearch}
                    >
                        Search
                    </button>
                </div>


                <div className="pr-5">
                    <ThemeToggle/>
                </div>

                {/* Hamburger Menu */}
                <div className="relative">
                    <button onClick={toggleMenu} className="focus:outline-none text-white">
                        <svg
                            className="w-8 h-8"
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
                    {menuOpen && (
                        <div
                            className="absolute right-0 mt-2 w-48 bg-primary-light dark:bg-primary-dark rounded-lg shadow-lg text-white z-50">
                            <ul>
                                {isLoggedIn ? (
                                    <>
                                        <li>
                                            <button
                                                onClick={() => navigate("/userProfilePage")}
                                                className="flex items-center px-4 py-2 justify-between hover:bg-gray-700 hover:rounded-lg w-full text-left"
                                            >
                                                <span>{name}</span>
                                                {profilePic ? (
                                                    <img
                                                        src={profilePic}
                                                        alt="User Profile"
                                                        className="w-8 h-8 rounded-full"
                                                    />
                                                ) : (
                                                    <span
                                                        className="w-8 h-8 flex items-center justify-center bg-gray-600 text-white rounded-full"
                                                    >
                                                        {name.charAt(0).toUpperCase()}
                                                    </span>
                                                )}
                                            </button>
                                        </li>
                                        <li>
                                            <button
                                                onClick={() => navigate("/userProfilePage/host-chatlist")}
                                                className="block px-4 py-2 hover:bg-gray-700 hover:rounded-lg w-full text-left"
                                            >
                                                Chat
                                            </button>
                                        </li>
                                        {isHost && (
                                            <li>
                                                <button
                                                    onClick={() => navigate("/hostProfilePage")}
                                                    className="block px-4 py-2 hover:bg-gray-700 hover:rounded-lg w-full text-left"
                                                >
                                                    Host Dashboard
                                                </button>
                                            </li>
                                        )}

                                        <li>
                                            <button
                                                onClick={() => navigate("/userProfilePage/host-chatlist")}
                                                className="block px-4 py-2 hover:bg-gray-700 hover:rounded-lg w-full text-left"
                                            >
                                                Chat
                                            </button>
                                        </li>
                                    </>
                                ) : (
                                    <li>
                                        <button
                                            onClick={() => navigate("/signIn")}
                                            className="block px-4 py-2 hover:bg-gray-700 hover:rounded-lg w-full text-left"
                                        >
                                            Sign In
                                        </button>
                                    </li>
                                )}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default HeaderComponent;
