import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebaseConfig.js"; // Import your Firebase auth instance
import { MapPinIcon } from "@heroicons/react/24/outline";

function EventCard({ title, location, date, price, image, eventId }) {
    const navigate = useNavigate();

    const handleClick = () => {
        const user = auth.currentUser;
        if (user) {
            navigate(`/eventPage/${eventId}`);
        } else {
            navigate(`/signIn`);
        }
    };

    return (
        <div
            className="event-card w-80 min-w-[20rem] flex-shrink-0 rounded-lg overflow-hidden shadow-md cursor-pointer transform transition-transform duration-300 hover:scale-105 snap-start"
            onClick={handleClick}
        >
            <div
                className="relative h-40 bg-cover bg-center"
                style={{ backgroundImage: `url(${image})` }}
            >
                <div
                    className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs font-semibold px-2 py-1 rounded-md"
                >
                    {price === 0 ? "Free Event" : `$${price}`}
                </div>
            </div>

            {/* Information Section */}
            <div className="p-3 bg-white">
                <div className="flex justify-between items-center">
                    <h3 className="text-gray-900 text-lg font-semibold truncate">{title}</h3>
                    <p className="text-gray-500 text-xs">{date}</p>
                </div>
                <div className="flex items-center text-gray-500 text-sm mt-1">
                    <MapPinIcon className="w-4 h-4 mr-1" />
                    <p className="truncate">{location}</p>
                </div>
            </div>
        </div>
    );
}

export default EventCard;
