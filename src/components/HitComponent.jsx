import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookmarkIcon as OutlineBookmarkIcon, CalendarIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { BookmarkIcon as SolidBookmarkIcon } from '@heroicons/react/20/solid';
import { auth } from '../firebaseConfig';
import { toggleBookmark } from '../services/toggleBookmark';

const HitComponent = ({ hit, viewMode }) => {
    const navigate = useNavigate();
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        return auth.onAuthStateChanged(user => {
            if (user) {
                setUserId(user.uid);
                checkIfBookmarked(user.uid, hit.objectID);
            }
        });
    }, [hit.objectID]);

    const checkIfBookmarked = async (userId, eventId) => {
        const isBookmarked = await getBookmarkStatus(userId, eventId);
        setIsBookmarked(isBookmarked);
    };

    const handleBookmarkToggle = async (e) => {
        e.stopPropagation();
        const result = await toggleBookmark(userId, hit);
        setIsBookmarked(result);
    };

    const handleClick = () => {
        navigate(`/eventPage/${hit.objectID}`);
    };

    const {
        basicInfo: { title = 'Untitled Event', location = {} },
        eventDetails: { eventDateTime, eventPrice = 0, images = [], paidEvent = false },
    } = hit;

    const imageUrl = images.length > 0 ? images[0].url : '/images/placeholder.png';
    const eventDate = new Date(eventDateTime).toLocaleString();

    return (
        <div
            className={`relative flex ${viewMode === 'grid' ? 'flex-col' : 'flex-row'} p-4 rounded-lg shadow-lg transition-transform duration-300 hover:shadow-xl hover:translate-y-[-10px] cursor-pointer bg-white`}
            onClick={handleClick}
        >
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

            <img
                src={imageUrl}
                alt={title}
                className={viewMode === 'grid' ? 'h-48 w-full object-cover rounded-md' : 'w-32 h-32 object-cover rounded-md'}
            />

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
