import { BookmarkIcon as OutlineBookmarkIcon } from '@heroicons/react/24/outline';
import { BookmarkIcon as SolidBookmarkIcon } from '@heroicons/react/20/solid';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toggleBookmark } from "../../services/toggleBookmark.js";
import { auth, db } from "../../firebaseConfig.js";
import { doc, getDoc } from "firebase/firestore";
import { MapPinIcon } from '@heroicons/react/24/outline';

const BookmarkEventCard = ({ event, onBookmarkRemoved }) => {
    const navigate = useNavigate();
    const [isBookmarked, setIsBookmarked] = useState(true);
    const [userId, setUserId] = useState(null);
    const [imageUrl, setImageUrl] = useState('/images/placeholder.png');

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                setUserId(user.uid);
                if (event.imageUrl) {
                    setImageUrl(event.imageUrl);
                } else {
                    fetchEventImage(event.eventId);
                }
            }
        });
        return () => unsubscribe();
    }, [event.eventId, event.imageUrl]);

    const fetchEventImage = async (eventId) => {
        try {
            const eventDoc = await getDoc(doc(db, 'Events', eventId));
            if (eventDoc.exists()) {
                const eventData = eventDoc.data();
                const fetchedImageUrl = eventData.eventDetails?.images?.[0]?.url || '/images/placeholder.png';
                setImageUrl(fetchedImageUrl);
                console.log("Fetched Image URL:", fetchedImageUrl);
            } else {
                console.log("Event document not found for eventId:", eventId);
            }
        } catch (error) {
            console.error('Error fetching event image:', error);
        }
    };

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

    return (
        <div
            className="relative flex w-full p-3 rounded-lg shadow-md transition-transform duration-300 hover:shadow-lg hover:translate-y-[-5px] cursor-pointer bg-[#1E293B]"
            onClick={handleNavigate}
        >
            {userId && (
                <button
                    onClick={handleBookmarkToggle}
                    className="absolute top-2 right-2"
                    aria-label="Bookmark Event"
                >
                    {isBookmarked ? (
                        <SolidBookmarkIcon className="w-5 h-5 text-white hover:text-gray-400" />
                    ) : (
                        <OutlineBookmarkIcon className="w-5 h-5 text-white hover:text-gray-400" strokeWidth={2.5} />
                    )}
                </button>
            )}

            <img
                src={imageUrl}
                alt={event.eventTitle}
                className="w-24 h-24 object-cover rounded-md"
                onError={(e) => e.target.src = '/images/placeholder.png'}
            />

            <div className="ml-3 flex flex-col justify-center flex-grow">
                <h2 className="text-base font-semibold text-white text-left truncate">{event.eventTitle}</h2>
                <div className="flex items-center text-gray-400 text-sm mt-1">
                    <MapPinIcon className="w-4 h-4 mr-1" />
                    <p className="truncate">{event.eventLocation || 'Location not specified'}</p>
                </div>
            </div>
        </div>
    );
};

export default BookmarkEventCard;
