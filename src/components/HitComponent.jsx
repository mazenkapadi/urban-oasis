import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookmarkIcon as OutlineBookmarkIcon, CalendarIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { BookmarkIcon as SolidBookmarkIcon } from '@heroicons/react/20/solid';
import { auth } from '../firebaseConfig';
import { toggleBookmark, getBookmarkStatus } from '../services/toggleBookmark';

const HitComponent = ({ hit, viewMode }) => {
    const navigate = useNavigate();
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [userId, setUserId] = useState(null);

    // Check if the user is authenticated and update bookmark status
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
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
            console.error("Error checking bookmark status:", error);
        }
    };

    // Toggle the bookmark status
    const handleBookmarkToggle = async (e) => {
        e.stopPropagation();
        try {
            const result = await toggleBookmark(userId, hit);
            setIsBookmarked(result);
        } catch (error) {
            console.error("Error toggling bookmark:", error);
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

    // Format event date to match the filtering logic
    const formatEventDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const imageUrl = images.length > 0 ? images[0].url : '/images/placeholder.png';
    const eventDate = formatEventDate(eventDateTime);

    return (
        <div
            className={`relative flex ${viewMode === 'grid' ? 'flex-col' : 'flex-row'} p-4 rounded-lg shadow-lg transition-transform duration-300 hover:shadow-xl hover:translate-y-[-10px] cursor-pointer bg-white`}
            onClick={handleClick}
        >
            {/* Bookmark Icon */}
            {userId && (
                <button
                    onClick={handleBookmarkToggle}
                    className="absolute top-3 right-3"
                    aria-label="Bookmark Event"
                >
                    {isBookmarked ? (
                        <SolidBookmarkIcon className="w-6 h-6 text-black hover:text-gray-400" />
                    ) : (
                        <OutlineBookmarkIcon className="w-6 h-6 text-black hover:text-gray-400" strokeWidth={2.5} />
                    )}
                </button>
            )}

            {/* Event Image */}
            <img
                src={imageUrl}
                alt={title}
                className={viewMode === 'grid' ? 'h-48 w-full object-cover rounded-md' : 'w-32 h-32 object-cover rounded-md'}
            />

            {/* Event Information */}
            <div className={`ml-4 flex flex-col justify-between flex-grow ${viewMode === 'grid' ? '' : 'ml-4'}`}>
                <h2 className="text-xl font-semibold text-black">{title}</h2>
                <div className="flex items-center text-gray-600 mt-2">
                    <MapPinIcon className="w-5 h-5 mr-1" />
                    <p className="text-sm">{location.label || 'Location not specified'}</p>
                </div>
                <div className="flex items-center text-gray-600 mt-1">
                    <CalendarIcon className="w-5 h-5 mr-1" />
                    <p className="text-sm">{eventDate}</p>
                </div>
                <div className="text-lg font-bold text-black mt-4">
                    {paidEvent ? `$${eventPrice.toFixed(2)}` : 'Free RSVP'}
                </div>
            </div>
        </div>
    );
};

export default HitComponent;
