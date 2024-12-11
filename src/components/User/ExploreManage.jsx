import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where, doc, deleteDoc } from "firebase/firestore";
import { db, auth } from "../../firebaseConfig.js";
import BookmarkEventCard from "../EventCards/BookmarkEventCard.jsx";
import themeManager from "../../utils/themeManager.jsx";

const ExploreManage = () => {
    const navigate = useNavigate();
    const [ bookmarkedEvents, setBookmarkedEvents ] = useState([]);
    const [ userId, setUserId ] = useState(null);
    const [ darkMode, setDarkMode ] = useState(themeManager.isDarkMode);

    useEffect(() => {
        const handleThemeChange = (isDark) => setDarkMode(isDark);
        themeManager.addListener(handleThemeChange);

        return () => {
            themeManager.removeListener(handleThemeChange);
        };
    }, []);

    useEffect(() => {
        const fetchUserData = () => {
            const user = auth.currentUser;
            if (user) {
                setUserId(user.uid);
                fetchBookmarkedEvents(user.uid);
            }
        };

        const fetchBookmarkedEvents = async (userId) => {
            try {
                const bookmarksRef = collection(db, "Bookmarks");
                const q = query(bookmarksRef, where("userId", "==", userId));
                const querySnapshot = await getDocs(q);
                const bookmarkedEventsData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setBookmarkedEvents(bookmarkedEventsData);
            } catch (error) {
                console.error("Error fetching bookmarked events:", error);
            }
        };

        auth.onAuthStateChanged((user) => {
            if (user) {
                fetchUserData();
            }
        });
    }, []);

    const handleBookmarkRemoved = async (eventId) => {
        if (!userId) return;

        try {
            const bookmarkId = `${userId}_${eventId}`;
            const bookmarkRef = doc(db, "Bookmarks", bookmarkId);

            await deleteDoc(bookmarkRef);

            setBookmarkedEvents((prevEvents) =>
                prevEvents.filter((event) => event.eventId !== eventId)
            );
        } catch (error) {
            console.error("Error removing bookmark:", error);
        }
    };

    return (
        <div className="mt-4" >
            <h2 className={`font-lalezar text-h3 ${darkMode ? "text-primary-light" : "text-primary-dark"} mb-4`} >EXPLORE & MANAGE</h2 >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" >
                <div className="grid grid-rows-2 gap-6 lg:col-span-1 h-full" >
                    <div
                        className={`${darkMode ? "bg-Dark-D1" : "bg-Light-L1"} shadow-md rounded-lg p-6 text-center flex flex-col justify-center h-full`} >
                        <h3 className={`text-h4 font-lalezar ${darkMode ? "text-primary-light" : "text-primary-dark"} mb-2`} >My Event History</h3 >
                        <p className={`${darkMode ? "text-Light-L1" : "text-Dark-D1"}`}>View all the events you've attended.</p >
                        <button
                            className="mt-4 bg-accent-blue text-white py-2 px-4 rounded-md hover:bg-blue-800 transition"
                            onClick={() => navigate(`/userProfilePage/event-history`, {state: {userId}})}
                        >
                            View History
                        </button >
                    </div >

                    <div
                        className={`${darkMode ? "bg-Dark-D1" : "bg-Light-L1"} shadow-md rounded-lg p-6 text-center flex flex-col justify-center h-full`} >
                        <h3 className={`text-h4 font-lalezar ${darkMode ? "text-primary-light" : "text-primary-dark"} mb-2`} >Manage RSVPs</h3 >
                        <p className={`${darkMode ? "text-Light-L1" : "text-Dark-D1"}`} >Modify or cancel your upcoming RSVPs.</p >
                        <button
                            className="mt-4 bg-accent-blue text-white py-2 px-4 rounded-md hover:bg-blue-800 transition"
                            onClick={() => navigate('/userProfilePage/manage-rsvps')}
                        >
                            Manage RSVPs
                        </button >
                    </div >
                </div >
                <div
                    className={`${darkMode ? "bg-Dark-D1" : "bg-Light-L1"} shadow-md rounded-lg p-6 text-center lg:col-span-2 lg:row-span-2 flex flex-col items-start`} >
                    <h3 className={`text-h4 font-lalezar ${darkMode ? "text-primary-light" : "text-primary-dark"} mb-2`} >Bookmarked Events</h3 >
                    <p className={`${darkMode ? "text-Light-L1" : "text-Dark-D1"}`} >These are events you have bookmarked.</p >
                    <div className="flex flex-col gap-4 w-full h-[300px] overflow-y-auto" >
                        {bookmarkedEvents.length > 0 ? (
                            bookmarkedEvents.map((event) => (
                                <BookmarkEventCard
                                    key={event.id}
                                    event={event}
                                    onBookmarkRemoved={handleBookmarkRemoved}
                                />
                            ))
                        ) : (
                            <p className="text-gray-400 text-center" >No bookmarked events</p >
                        )}
                    </div >
                </div >
            </div >
        </div >
    );
};

export default ExploreManage;