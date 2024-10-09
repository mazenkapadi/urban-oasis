import { useNavigate } from "react-router-dom";

const WideEventCard = ({ event }) => {
    const navigate = useNavigate();

    const handleNavigate = () => {
        console.log(event);
        navigate(`/eventPage/${event.id}`);
    };

    return (
        <div
            key={event.id}
            className="flex items-start p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer"
            style={{ borderColor: "#8D99AE" }}
            onClick={handleNavigate}
        >
            <img
                src={event.eventDetails.images[0]}
                alt={event.basicInfo.title}
                className="w-32 h-32 object-cover rounded-md"
            />
            <div className="ml-4">
                <h2 className="text-2xl font-semibold text-[#2B2D42]">
                    {event.basicInfo.title}
                </h2>
                <p className="text-[#8D99AE]">{event.basicInfo.location.label}</p>
                <p className="text-[#2B2D42]">
                    {`${event.eventDetails.eventDateTime
                             .toDate()
                             .toLocaleString("en-US", {
                                 year: "numeric",
                                 month: "long",
                                 day: "numeric",
                                 hour: "numeric",
                                 minute: "numeric",
                                 hour12: true,
                             })
                             .replace(",", " at")}`}
                </p>
                {event.eventDetails.paidEvent && (
                    <p className="text-[#D90429]">
                        ${event.eventDetails.eventPrice.toFixed(2)}
                    </p>
                )}
            </div>
        </div>
    );
};

export default WideEventCard;
