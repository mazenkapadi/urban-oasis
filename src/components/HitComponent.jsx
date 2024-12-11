import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    BookmarkIcon as OutlineBookmarkIcon,
    CalendarIcon,
    MapPinIcon,
} from '@heroicons/react/24/outline';
import { BookmarkIcon as SolidBookmarkIcon } from '@heroicons/react/20/solid';
import { auth } from '../firebaseConfig';
import { toggleBookmark, getBookmarkStatus } from '../services/toggleBookmark';
import themeManager from "../utils/themeManager.jsx";

const HitComponent = ({hit, viewMode}) => {
    const navigate = useNavigate();
    const [ isBookmarked, setIsBookmarked ] = useState(false);
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
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUserId(user.uid);
                checkIfBookmarked(user.uid, hit.objectID);
            }
        });
        return () => unsubscribe();
    }, [ hit.objectID ]);

    const checkIfBookmarked = async (userId, eventId) => {
        try {
            const isBookmarked = await getBookmarkStatus(userId, eventId);
            setIsBookmarked(isBookmarked);
        } catch (error) {
            console.error('Error checking bookmark status:', error);
        }
    };

    const handleBookmarkToggle = async (e) => {
        e.stopPropagation();
        try {
            const result = await toggleBookmark(userId, hit);
            setIsBookmarked(result);
        } catch (error) {
            console.error('Error toggling bookmark:', error);
        }
    };

    const handleClick = () => {
        const user = auth.currentUser;
        if (user) {
            navigate(`/eventPage/${hit.objectID}`);
        } else {
            navigate(`/signIn`);
        }
    };

    const {
        basicInfo: {title = 'Untitled Event', location = {}},
        eventDetails: {eventDateTime, eventPrice = 0, images = [], paidEvent = false},
    } = hit;

    const formatEventDate = (timestamp) => {
        if (!timestamp) return 'Invalid Date';
        const date = new Date(timestamp);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
    };

    const imageUrl = images.length > 0 ? images[0].url : '/images/placeholder.png';
    const eventDate = formatEventDate(eventDateTime);

    if (viewMode === 'grid') {
        return (
            <div
                className={`w-80 min-w-[20rem] flex-shrink-0 rounded-lg overflow-hidden shadow-lg cursor-pointer transform transition-transform duration-300 hover:scale-105 snap-start ${darkMode ? 'bg-Dark-D2' : 'bg-Light-L2'}`}
                onClick={handleClick}
            >
                {/* Bookmark Icon */}
                {userId && (
                    <button
                        onClick={handleBookmarkToggle}
                        className="absolute top-2 right-2 bg-black opacity-50 p-1 rounded-md z-10"
                        aria-label="Bookmark Event"
                    >
                        {isBookmarked ? (
                            <SolidBookmarkIcon className="w-5 h-5 text-primary-light" />
                        ) : (
                            <OutlineBookmarkIcon className="w-5 h-5 text-primary-light" strokeWidth={2.5} />
                        )}
                    </button >
                )}

                <div
                    className="relative h-40 bg-cover bg-center"
                    style={{backgroundImage: `url(${imageUrl})`}}
                >
                    <div
                        className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs font-semibold px-2 py-1 rounded-md" >
                        {paidEvent ? `$${eventPrice.toFixed(2)}` : 'Free Event'}
                    </div >
                </div >

                <div className={`p-3 ${darkMode ? "bg-Dark-D1 text-primary-light" : "bg-Light-L2 text-primary-dark"} `} >
                    <div className="flex justify-between items-center" >
                        <h3 className="text-lg font-semibold truncate" >{title}</h3 >
                        <p className="text-sm" >{eventDate}</p >
                    </div >
                    <div className="flex items-center text-sm mt-1" >
                        <MapPinIcon className="w-4 h-4 mr-1" />
                        <p className="truncate" >{location.label || 'Location not specified'}</p >
                    </div >
                </div >
            </div >
        );
    }

    return (
        <div
            className={`relative flex flex-row p-4 rounded-lg shadow-lg cursor-pointer ${darkMode ? "bg-Dark-D2" : "bg-Light-L2"}`}
            onClick={handleClick}
        >
            {userId && (
                <button
                    onClick={handleBookmarkToggle}
                    className="absolute top-2 right-2 bg-black p-1 rounded-md z-10"
                    aria-label="Bookmark Event"
                >
                    {isBookmarked ? (
                        <SolidBookmarkIcon className="w-5 h-5 text-primary-light" />
                    ) : (
                        <OutlineBookmarkIcon className="w-5 h-5 text-primary-light" strokeWidth={2.5} />
                    )}
                </button >
            )}

            <img
                src={imageUrl}
                alt={title}
                className="w-32 h-32 object-cover rounded-md"
            />

            <div className="ml-4 flex flex-col justify-between flex-grow" >
                <h2 className={`text-lg font-semibold ${darkMode ? "text-primary-light" : "text-primary-dark"}`} >{title}</h2 >
                <div className={`flex items-center ${darkMode ? "text-Light-L1" : "text-Dark-D1"} mt-2`} >
                    <MapPinIcon className="w-5 h-5 mr-1" />
                    <p className="text-sm" >{location.label || 'Location not specified'}</p >
                </div >
                <div className={`flex items-center ${darkMode ? "text-Light-L1" : "text-Dark-D1"} mt-2`} >
                    <CalendarIcon className="w-5 h-5 mr-1" />
                    <p className="text-sm" >{eventDate}</p >
                </div >
                <div className="text-lg font-bold mt-4" >
                    {paidEvent ? `$${eventPrice.toFixed(2)}` : 'Free RSVP'}
                </div >
            </div >
        </div >
    );
};

export default HitComponent;
