import { useNavigate } from "react-router-dom";
import { BookmarkIcon as OutlineBookmarkIcon, CalendarIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { BookmarkIcon as SolidBookmarkIcon } from '@heroicons/react/20/solid';
import { useEffect, useState } from "react";
import { toggleBookmark } from "../../services/toggleBookmark.js";
import { auth } from "../../firebaseConfig.js";

const WideEventCard = ({ event }) => {
    const navigate = useNavigate();
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        return auth.onAuthStateChanged(user => {
            if (user) {
                setUserId(user.uid);
                checkIfBookmarked(user.uid, event.id);
            }
        });
    }, [event.id]);

    const checkIfBookmarked = async (userId, eventId) => {
        const isBookmarked = await getBookmarkStatus(userId, eventId);
        setIsBookmarked(isBookmarked);
    };

    const handleBookmarkToggle = async (e) => {
        e.stopPropagation();
        const result = await toggleBookmark(userId, event);
        setIsBookmarked(result);
    };

    const handleNavigate = () => {
        navigate(`/eventPage/${event.id}`);
    };

    return (
        <div
            className="relative flex p-4 rounded-lg shadow-lg transition-transform duration-300 hover:shadow-xl hover:translate-y-[-10px] cursor-pointer bg-white"
            onClick={handleNavigate}
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
                src={event.eventDetails.images[0].url}
                alt={event.basicInfo.title}
                className="w-32 h-32 object-cover rounded-md"
            />

            <div className="ml-4 flex flex-col justify-between flex-grow">
                <div>
                    <h2 className="text-xl font-semibold text-black">{event.basicInfo.title}</h2>
                    <div className="flex items-center text-gray-600 mt-2">
                        <MapPinIcon className="w-5 h-5 mr-1" />
                        <p className="text-sm">{event.basicInfo.location.label}</p>
                    </div>
                    <div className="flex items-center text-gray-600 mt-1">
                        <CalendarIcon className="w-5 h-5 mr-1" />
                        <p className="text-sm">
                            {event.eventDetails.eventDateTime.toDate().toLocaleString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "numeric",
                                minute: "numeric",
                                hour12: true,
                            })}
                        </p>
                    </div>
                </div>

                <div className="flex justify-end mt-4">
                    <div className="text-lg font-bold text-black">
                        {event.eventDetails.paidEvent ? (
                            <span>${event.eventDetails.eventPrice.toFixed(2)}</span>
                        ) : (
                            <span>Free RSVP</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WideEventCard;


// ToDo - work on this doesnt update the bookmarked events list on firestore