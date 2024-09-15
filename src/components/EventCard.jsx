import React, {useState} from "react";

function EventCard() {
    const [capacity, setCapacity] = useState(23);
    const [totalCapacity] = useState(50);
    const [ticketPrice, setTicketPrice] = useState(10.99);

    return (
        <>
            <div className="event-card p-3">
                <div className="box-border rounded-lg bg-gray-900 p-3 flex"
                     style={{backgroundImage: "url('your-image.jpg')"}}>
                    <div className="flex flex-col p-6">
                        <label className="block text-gray-200 opacity-50 pb-1">Date</label>
                        <label className="block text-gray-300 pb-1 text-2xl">Event Title</label>
                        <label className="block text-gray-200 opacity-50 pb-1">Event Location</label>

                        <div className="flex flex-row pt-20 gap-32">
                            <label className="block text-gray-300 opacity-50 pb-1">Capacity</label>
                            <label className="block text-gray-300 opacity-50 pb-1">Ticket Price</label>
                        </div>

                        <div className="flex flex-row gap-32">
                            <label className="block text-gray-300 pb-1 text-2xl">{capacity}/{totalCapacity}</label>
                            <label className="block text-gray-300 pb-1 text-2xl">${ticketPrice.toFixed(2)}</label>
                        </div>
                        <button
                            className="bg-white text-black font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline w-full mt-4"
                            aria-label="View Event"
                        >
                            View Event
                        </button>
                    </div>
                </div>
            </div>
        </>

    )
}

export default EventCard;