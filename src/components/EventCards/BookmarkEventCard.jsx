import { useNavigate } from "react-router-dom";
import { BookmarkIcon as OutlineBookmarkIcon } from '@heroicons/react/24/outline';
import { BookmarkIcon as SolidBookmarkIcon } from '@heroicons/react/20/solid';
import { useEffect, useState } from "react";
import { toggleBookmark } from "../../services/toggleBookmark.js";
import { auth } from "../../firebaseConfig.js";

const BookmarkEventCard = ({ event, onBookmarkRemoved }) => {
    const navigate = useNavigate();
    const [isBookmarked, setIsBookmarked] = useState(true); // Start as bookmarked
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                setUserId(user.uid);
            }
        });
        return () => unsubscribe();
    }, []);

    const handleBookmarkToggle = async (e) => {
        e.stopPropagation();
        const result = await toggleBookmark(userId, event);
        setIsBookmarked(result);
        if (!result && onBookmarkRemoved) {
            onBookmarkRemoved(event.eventId);
        }
    };

    const handleNavigate = () => {
        navigate(`/eventPage/${event.eventId}`);
    };

    // Fallback image if the URL is missing or broken
    const imageUrl = event.image || event.eventImage || '/images/placeholder.png';

    return (
        <div
            className="relative flex p-4 rounded-lg shadow-lg transition-transform duration-300 hover:shadow-xl hover:translate-y-[-10px] cursor-pointer bg-gray-300"
            onClick={handleNavigate}
        >
            {/* Bookmark Icon */}
            {userId && (
                <button
                    onClick={handleBookmarkToggle}
                    className="absolute top-3 right-3"
                    aria-label="Bookmark Event"
                >
                    {isBookmarked ? (
                        <SolidBookmarkIcon className="w-6 h-6 text-white hover:text-gray-400" />
                    ) : (
                        <OutlineBookmarkIcon className="w-6 h-6 text-white hover:text-gray-400" strokeWidth={2.5} />
                    )}
                </button>
            )}

            {/* Event Image */}
            <img
                src={imageUrl}
                alt={event.eventTitle || "Untitled Event"}
                className="w-32 h-32 object-cover rounded-md"
            />

            {/* Event Title - Aligned to the Left */}
            <div className="ml-4 flex flex-col justify-center flex-grow">
                <h2 className="text-lg font-semibold text-white text-left">{event.eventTitle || "Untitled Event"}</h2>
            </div>
        </div>
    );
};

export default BookmarkEventCard;
