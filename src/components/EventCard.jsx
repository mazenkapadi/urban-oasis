import React, {useState} from "react";

function EventCard() {
    const [capacity, setCapacity] = useState(23);
    const [totalCapacity] = useState(50);
    const [ticketPrice, setTicketPrice] = useState(10.99);

    return (
        <>
            <div className="event-card h-3/5 p-5">
                <div className="box-border rounded-lg bg-gray-900 p-3 flex w-full bg-cover bg-center hover:scale-110"
                     style={{backgroundImage: "url('src/assets/backgroundTestImage.jpg')"}}>
                    <div className="flex flex-col p-4">
                        <label className="block text-gray-300 pb-1 text-2xl">Event Title</label>
                        <label className="block text-gray-200 opacity-50 pb-1">Event Location</label>

                        <div className="flex flex-row pt-6 gap-32">
                            <label className="block text-gray-200 opacity-50 pb-1">Date</label>
                            <label className="block text-gray-300 opacity-50 pb-1">Ticket Price</label>
                        </div>

                        <div className="flex flex-row gap-32">
                            <label className="block text-gray-300 pb-1 text-2xl">Date</label>
                            <label className="block text-gray-300 pb-1 text-2xl">${ticketPrice.toFixed(2)}</label>
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}

export default EventCard;