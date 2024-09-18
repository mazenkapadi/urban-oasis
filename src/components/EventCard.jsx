import React, {useState} from "react";

function EventCard() {
    const [capacity, setCapacity] = useState(23);
    const [totalCapacity] = useState(50);
    const [ticketPrice, setTicketPrice] = useState(10.99);

    return (
        <>
            <div className="event-card p-5">
                <div className="box-border rounded-lg bg-gray-900 p-3 flex h-full w-full bg-cover bg-center hover:scale-110"
                     style={{backgroundImage: "url('src/assets/backgroundTestImage.jpg')"}}>
                    <div className="flex flex-col p-4">
                        <label className="block text-gray-300 pb-1 text-2xl">Event Title</label>
                        <div className={"flex flex-row"}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                                 stroke="white" className="size-6" style={{ opacity: .5}}>
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"/>
                            </svg>
                            <label className="block text-gray-200 opacity-50 pb-1">Event Location</label>
                        </div>

                        <div className="flex flex-row pt-10 gap-32">
                            <label className="block text-gray-300 opacity-50 pb-1">Date</label>
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