import React from "react";
import { useNavigate } from 'react-router-dom';
import { MapPinIcon } from '@heroicons/react/24/outline';

// eslint-disable-next-line react/prop-types
function EventCard({title, location, date, price, image, eventId, event}) {
    const navigate = useNavigate();

    const handleNavigate = () => {
        console.log(event);
        navigate(`/eventPage/${eventId}`);
    };

    return (
        <div className="event-card flex-shrink-0 w-fit" >
            <div
                className="rounded-lg bg-gray-800 p-4 flex flex-col justify-between h-56 w-72 bg-cover bg-center hover:scale-105 transition-transform duration-300 shadow-lg"
                style={{backgroundImage: `url(${image})`}} onClick={handleNavigate}
            >
                <div >
                    <h3 className="text-white text-2xl font-bold truncate" >{title}</h3 >
                    <div className="flex items-center text-gray-300 opacity-75 mt-1" >
                        <MapPinIcon className="w-5 h-5 mr-1" />
                        <p >{location}</p >
                    </div >
                </div >
                <div className="flex justify-between items-end mt-3" >
                    <div className="text-white opacity-75" >
                        <p className="text-lg" >{date}</p >
                    </div >
                    <div className="text-white" >
                        <p className="text-lg font-bold" >{price === 0 ? "Free" : `$ ${price}`}</p >
                    </div >
                </div >
            </div >
        </div >
    );
}

export default EventCard;