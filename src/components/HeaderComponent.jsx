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

    // Update the query string dynamically
    useEffect(() => {
        // Avoid navigating when on the landing page
        if (window.location.pathname === "/") return;

        const params = new URLSearchParams();

        if (geoLocation) {
            params.set("geoLocation", `${geoLocation.lat},${geoLocation.lng}`);
        }

        if (eventQuery) {
            params.set("q", eventQuery);
        }

        if (dateRange?.startDate && dateRange?.endDate) {
            params.set("startDate", dateRange.startDate.toISOString());
            params.set("endDate", dateRange.endDate.toISOString());
        }

        // Navigate only if on /events page
        if (window.location.pathname === "/events") {
            navigate(`/events?${params.toString()}`, { replace: true });
        }
    }, [geoLocation, eventQuery, dateRange, navigate]);



    useEffect(() => {
        // Automatically reset search when inputs are cleared
        if (!eventQuery && !geoLocation && !dateRange.startDate && !dateRange.endDate) {
            if (onSearch) {
                onSearch({ geoLocation: null, eventQuery: "", dateRange: null });
            }
        }
    }, [geoLocation, eventQuery, dateRange, onSearch]);

    // Toggle menu
    const toggleMenu = () => {
        setMenuOpen((prev) => !prev);
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    // Handle clearing inputs with backspace
    const handleInputChange = (e, type) => {
        const value = e.target.value;

        if (type === "geo") {
            if (!value) {
                setGeoLocation(null); // Reset geoLocation when cleared
            } else {
                // Simulate setting geoLocation (mocked for demonstration)
                setGeoLocation({ lat: 40.7128, lng: -74.0060 }); // Replace with actual input handling
            }
        }

        if (type === "event") {
            if (!value) {
                setEventQuery(""); // Reset eventQuery when cleared
            } else {
                setEventQuery(value);
            }
        }
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
        const params = new URLSearchParams();

        if (geoLocation) {
            params.append("geoLocation", `${geoLocation.lat},${geoLocation.lng}`);
        }

        if (eventQuery) {
            params.append("q", eventQuery);
        }

        if (dateRange?.startDate && dateRange?.endDate) {
            params.append("startDate", dateRange.startDate.toISOString());
            params.append("endDate", dateRange.endDate.toISOString());
        }

        navigate(`/events?${params.toString()}`);
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

                <div className="flex items-center gap-8 w-full px-4">
                    {/* GeoSearchBar */}
                    <div className="flex-1 max-w-sm ">
                        <GeoSearchBar
                            onGeoSearch={(geo) => setGeoLocation(geo)}
                            onClear={() => setGeoLocation(null)}
                            onKeyDown={handleKeyPress}
                        />
                    </div>

                    {/*Date Picker*/}
                    <div className="flex-1 max-w-sm">
                        <button
                            className="w-full h-12 px-4 border border-gray-300 rounded-full bg-white text-gray-700 focus:ring focus:ring-blue-300 focus:outline-none"
                            onClick={() => setShowDatePicker(!showDatePicker)}
                        >
                            {dateRange?.startDate && dateRange?.endDate
                                ? `${dateRange.startDate.toLocaleDateString()} - ${dateRange.endDate.toLocaleDateString()}`
                                : "Select Dates"}
                        </button>
                        {showDatePicker && (
                            <div className="absolute z-50 mt-2 bg-white shadow-lg p-4 rounded-md">
                                <DateRangePicker
                                    ranges={[
                                        {
                                            startDate: dateRange?.startDate || new Date(),
                                            endDate: dateRange?.endDate || new Date(),
                                            key: "selection",
                                        },
                                    ]}
                                    onChange={handleDateChange}
                                    minDate={new Date()} // Disable past dates
                                    direction="vertical" // Ensure vertical alignment
                                    editableDateInputs={true} // Allow manual input if needed
                                    className="text-black"
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
                                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
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
