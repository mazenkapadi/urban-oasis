import { useNavigate } from "react-router-dom";
import { CalendarIcon, MapPinIcon, TagIcon } from '@heroicons/react/24/outline';

const WideEventCard = ({ event }) => {
    const navigate = useNavigate();

    const handleNavigate = () => {
        console.log(event);
        navigate(`/eventPage/${event.id}`);
    };

    return (
        <div
            key={event.id}
            className="flex p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer bg-neutral-white"
            onClick={handleNavigate}
        >
            <img
                src={event.eventDetails.images[0]}
                alt={event.basicInfo.title}
                className="w-32 h-32 object-cover rounded-md"
            />
            <div className="ml-4 flex flex-col justify-between flex-grow">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-black">{event.basicInfo.title}</h2>
                    <p className="ml-4 text-lg font-bold text-black">
                        {event.eventDetails.paidEvent ? (
                            <div className="flex items-center">
                                <TagIcon className="inline-block w-5 h-5 mr-1" />
                                ${event.eventDetails.eventPrice.toFixed(2)}
                            </div>
                        ) : (
                            <span>Free RSVP</span>
                        )}
                    </p>
                </div>
                <div className="flex items-center text-detail-gray">
                    <MapPinIcon className="w-5 h-5" />
                    <p className="text-sm">{event.basicInfo.location.label}</p>
                </div>
                <div className="flex items-center text-detail-gray">
                    <CalendarIcon className="w-5 h-5" />
                    <p className="text-sm">
                        {`${event.eventDetails.eventDateTime.toDate().toLocaleString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                            hour12: true,
                        })}`}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default WideEventCard;
