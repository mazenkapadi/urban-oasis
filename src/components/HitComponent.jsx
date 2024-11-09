import React from 'react';
import { useNavigate } from 'react-router-dom';

const HitComponent = ({ hit }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        try {
            navigate(`/eventPage/${hit.objectID}`);
        } catch (error) {
            console.error('Navigation error:', error);
        }
    };

    const {
        basicInfo: { title = 'Untitled Event', description = 'No description available', location = {} },
        eventDetails: { eventDateTime, eventPrice = 0, images = [] },
        policies: { ageRestriction = 'All' },
    } = hit;

    const imageUrl = images.length > 0 ? images[0].url : '/images/placeholder.png';
    const eventDate = new Date(eventDateTime).toLocaleString();

    return (
        <div
            className="relative bg-white border rounded-lg flex flex-col overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            onClick={handleClick}
            aria-label={`View details for ${title}`}
        >
            {/* Event Image */}
            <img
                src={imageUrl}
                alt={title}
                className="h-48 w-full object-cover"
                loading="lazy"
            />

            {/* Event Information */}
            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                <p className="text-sm text-gray-600 mb-2">{description}</p>

                {/* Location and Date */}
                <div className="flex items-center text-sm text-gray-500 mb-2">
                    <span className="mr-2">
                        <i className="fas fa-map-marker-alt"></i> {location.label || 'Location not specified'}
                    </span>
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                    <span className="mr-2">
                        <i className="fas fa-calendar-alt"></i> {eventDate}
                    </span>
                </div>

                {/* Event Price and Age Restriction */}
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">
                        {eventPrice > 0 ? `$${eventPrice.toFixed(2)}` : 'Free'}
                    </span>
                    <span className="text-sm text-gray-500">
                        Age: {ageRestriction}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default HitComponent;
