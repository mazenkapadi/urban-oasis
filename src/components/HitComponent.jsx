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

const HitComponent = ({ hit, viewMode }) => {
    const navigate = useNavigate();
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [userId, setUserId] = useState(null);

    // Check if the user is authenticated and update bookmark status
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUserId(user.uid);
                checkIfBookmarked(user.uid, hit.objectID);
            }
        });
        return () => unsubscribe();
    }, [hit.objectID]);

    // Function to check if the event is bookmarked
    const checkIfBookmarked = async (userId, eventId) => {
        try {
            const isBookmarked = await getBookmarkStatus(userId, eventId);
            setIsBookmarked(isBookmarked);
        } catch (error) {
            console.error('Error checking bookmark status:', error);
        }
    };

    // Toggle the bookmark status
    const handleBookmarkToggle = async (e) => {
        e.stopPropagation();
        try {
            const result = await toggleBookmark(userId, hit);
            setIsBookmarked(result);
        } catch (error) {
            console.error('Error toggling bookmark:', error);
        }
    };

    // Navigate to the event details page
    const handleClick = () => {
        navigate(`/eventPage/${hit.objectID}`);
    };

    // Destructure event details from the hit object
    const {
        basicInfo: { title = 'Untitled Event', location = {} },
        eventDetails: { eventDateTime, eventPrice = 0, images = [], paidEvent = false },
    } = hit;

    // Format event date to MM/DD/YYYY
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

    // Render for Grid View (using EventCard style)
    if (viewMode === 'grid') {
        return (
            <div
                className="event-card w-80 min-w-[20rem] flex-shrink-0 rounded-lg overflow-hidden shadow-lg cursor-pointer transform transition-transform duration-300 hover:scale-105 snap-start bg-secondary-light-1 dark:bg-secondary-dark-2"
                onClick={handleClick}
            >
                {/* Bookmark Icon */}
                {userId && (
                    <button
                        onClick={handleBookmarkToggle}
                        className="absolute top-3 right-3 bg-accent-orange dark:bg-accent-blue p-1 rounded-full z-10"
                        aria-label="Bookmark Event"
                    >
                        {isBookmarked ? (
                            <SolidBookmarkIcon className="w-6 h-6 text-primary-light" />
                        ) : (
                            <OutlineBookmarkIcon className="w-6 h-6 text-primary-light" strokeWidth={2.5} />
                        )}
                    </button>
                )}

                {/* Event Image */}
                <div
                    className="relative h-40 bg-cover bg-center"
                    style={{ backgroundImage: `url(${imageUrl})` }}
                >
                    <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs font-semibold px-2 py-1 rounded-md">
                        {paidEvent ? `$${eventPrice.toFixed(2)}` : 'Free Event'}
                    </div>
                </div>

                {/* Event Information Section */}
                <div className="p-3 bg-secondary-light-3 dark:bg-secondary-light-2 text-primary-dark dark:text-primary-light">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold truncate">{title}</h3>
                        <p className="text-sm">{eventDate}</p>
                    </div>
                    <div className="flex items-center text-sm mt-1">
                        <MapPinIcon className="w-4 h-4 mr-1" />
                        <p className="truncate">{location.label || 'Location not specified'}</p>
                    </div>
                </div>
            </div>
        );
    }

    // Render for List View
    return (
        <div
            className="relative flex flex-row p-4 rounded-lg shadow-lg cursor-pointer bg-secondary-light-1 dark:bg-secondary-dark-2"
            onClick={handleClick}
        >
            {/* Bookmark Icon */}
            {userId && (
                <button
                    onClick={handleBookmarkToggle}
                    className="absolute top-3 right-3 bg-accent-orange dark:bg-accent-blue p-1 rounded-full z-10"
                    aria-label="Bookmark Event"
                >
                    {isBookmarked ? (
                        <SolidBookmarkIcon className="w-6 h-6 text-primary-light" />
                    ) : (
                        <OutlineBookmarkIcon className="w-6 h-6 text-primary-light" strokeWidth={2.5} />
                    )}
                </button>
            )}

            {/* Event Image */}
            <img
                src={imageUrl}
                alt={title}
                className="w-32 h-32 object-cover rounded-md"
            />

            {/* Event Information */}
            <div className="ml-4 flex flex-col justify-between flex-grow">
                <h2 className="text-lg font-semibold text-primary-dark dark:text-primary-light">{title}</h2>
                <div className="flex items-center text-secondary-dark-2 dark:text-secondary-light-1 mt-2">
                    <MapPinIcon className="w-5 h-5 mr-1" />
                    <p className="text-sm">{location.label || 'Location not specified'}</p>
                </div>
                <div className="flex items-center text-secondary-dark-2 dark:text-secondary-light-1 mt-1">
                    <CalendarIcon className="w-5 h-5 mr-1" />
                    <p className="text-sm">{eventDate}</p>
                </div>
                <div className="text-lg font-bold mt-4">
                    {paidEvent ? `$${eventPrice.toFixed(2)}` : 'Free RSVP'}
                </div>
            </div>
        </div>
    );
};

export default HitComponent;
