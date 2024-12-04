import React, { useEffect, useState } from "react";
import { doc, getDoc, updateDoc, deleteField } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../../firebaseConfig.js";
import { CalendarIcon, MapPinIcon } from "@heroicons/react/24/outline";
import themeManager from "../../utils/themeManager.jsx";

const ManageRSVPPage = () => {
    const [userId, setUserId] = useState(null);
    const [rsvps, setRsvps] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [ darkMode, setDarkMode ] = useState(themeManager.isDarkMode);

    useEffect(() => {
        const handleThemeChange = (isDark) => setDarkMode(isDark);
        themeManager.addListener(handleThemeChange);

        return () => {
            themeManager.removeListener(handleThemeChange);
        };
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
            } else {
                console.log("No user logged in");
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchUserRSVPs = async () => {
            if (!userId) return;

            try {
                const rsvpDocRef = doc(db, "UserRSVPs", userId);
                const rsvpDocSnap = await getDoc(rsvpDocRef);

                if (rsvpDocSnap.exists()) {
                    const rsvpData = rsvpDocSnap.data().rsvps || {};

                    // Fetch event details for each RSVP
                    const eventDetails = await Promise.all(
                        Object.values(rsvpData).map(async (rsvp) => {
                            const eventDocRef = doc(db, "Events", rsvp.eventId);
                            const eventDocSnap = await getDoc(eventDocRef);

                            if (eventDocSnap.exists()) {
                                const eventData = eventDocSnap.data();
                                return {
                                    ...rsvp,
                                    eventTitle: eventData.basicInfo.title,
                                    eventDateTime: eventData.eventDetails.eventDateTime.toDate(),
                                    imageUrl: eventData.eventDetails?.images?.[0]?.url || "",
                                    location: eventData.basicInfo?.location?.label || "Location not available",
                                };
                            }
                            return rsvp;
                        })
                    );

                    setRsvps(eventDetails);
                } else {
                    console.log("No RSVPs found for this user.");
                }
            } catch (error) {
                console.error("Error fetching RSVPs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserRSVPs();
    }, [userId]);

    const handleCancelRSVP = async (eventId, rsvpId) => {
        try {
            const eventRsvpDocRef = doc(db, "EventRSVPs", eventId);
            const userRsvpDocRef = doc(db, "UserRSVPs", userId);

            // Remove RSVP from UserRSVPs
            await updateDoc(userRsvpDocRef, {
                [`rsvps.${rsvpId}`]: deleteField(),
            });

            // Remove RSVP from EventRSVPs
            await updateDoc(eventRsvpDocRef, {
                [`rsvps.${rsvpId}`]: deleteField(),
            });

            setRsvps((prevRsvps) => prevRsvps.filter((rsvp) => rsvp.eventId !== eventId));
            alert("RSVP canceled successfully.");
        } catch (error) {
            console.error("Error canceling RSVP:", error);
            alert("Failed to cancel RSVP. Please try again.");
        }
    };

    const handleEditRSVP = (eventId) => {
        navigate(`/eventPage/${eventId}`);
    };

    if (loading) {
        return <div className="text-center text-white">Loading your RSVPs...</div>;
    }

    return (
        <div className="w-full p-6">
            <h1 className={`text-3xl font-bold mb-6 ${darkMode ? "text-primary-light" : "text-primary-dark"}`}>Manage RSVPs</h1>

            {rsvps.length === 0 ? (
                <p className="text-gray-300">You haven't RSVP'd to any events yet.</p>
            ) : (
                <div className="space-y-6">
                    {rsvps.map((rsvp, index) => (
                        <div
                            key={index}
                            className={`flex ${darkMode ? "bg-primary-dark hover:bg-Dark-D1" : "bg-primary-light hover:bg-Light-L1"} shadow-md rounded-lg overflow-hidden transition`}
                        >
                            {rsvp.imageUrl && (
                                <img
                                    src={rsvp.imageUrl}
                                    alt={rsvp.eventTitle}
                                    className="w-40 h-42 object-cover"
                                />
                            )}
                            <div className="p-4 flex-1">
                                <h3 className={`text-xl font-semibold mb-1 ${darkMode ? "text-primary-light" : "text-primary-dark"}`}>{rsvp.eventTitle}</h3>
                                <div className="flex items-center text-gray-400 text-sm mb-2">
                                    <MapPinIcon className="w-5 h-5 mr-1" />
                                    <span>{rsvp.location}</span>
                                </div>
                                <div className="flex items-center text-gray-400 text-sm mb-2">
                                    <CalendarIcon className="w-5 h-5 mr-1" />
                                    <span>{new Date(rsvp.eventDateTime).toLocaleDateString()}</span>
                                </div>
                                <p className="text-gray-400">RSVP Quantity: {rsvp.quantity}</p>
                                <div className="flex mt-4 space-x-4">
                                    <button
                                        onClick={() => handleEditRSVP(rsvp.eventId)}
                                        className={`${darkMode ? "bg-Dark-D2 hover:bg-primary-dark text-primary-light" : "bg-Light-L2 hover:bg-primary-light text-primary-dark"} px-4 py-2 rounded-md`}
                                    >
                                        Edit RSVP
                                    </button>
                                    <button
                                        onClick={() => handleCancelRSVP(rsvp.eventId, rsvp.rsvpId)}
                                        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-800"
                                    >
                                        Cancel RSVP
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ManageRSVPPage;
