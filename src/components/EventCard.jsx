import React, { useState } from "react";
import { MapPinIcon } from '@heroicons/react/24/outline'; // Import HeroIcon

function EventCard() {
    const [ticketPrice, setTicketPrice] = useState(10.99);

    return (
        <>
            <div className="event-card">
                <div
                    className="box-border rounded-lg bg-gray-900 p-4 flex flex-col justify-between h-52 w-80 bg-cover bg-center hover:scale-105 transition-transform"
                    style={{ backgroundImage: "url('src/assets/backgroundTestImage.jpg')" }}
                >
                    <div>
                        <h3 className="text-white text-2xl font-bold">Event Title</h3>
                        <div className="flex items-center text-gray-300 opacity-75 mt-1">
                            <MapPinIcon className="w-5 h-5 mr-1" />
                            <p>Event Location</p>
                        </div>
                    </div>


                    <div className="flex justify-between items-end">
                        <div className="text-white opacity-75">
                            <p className="text-lg">Date</p>
                        </div>
                        <div className="text-white">
                            <p className="text-lg font-bold">${ticketPrice.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default EventCard;


// import React from "react";
// import { MapPinIcon } from '@heroicons/react/24/outline'; // Import HeroIcon
//
// function EventCard({ event }) {
//     const { title, location, date, price } = event; // Destructure event data
//
//     return (
//         <div className="event-card p-5">
//             {/* Card container with background image */}
//             <div
//                 className="box-border rounded-lg bg-gray-900 p-4 flex flex-col justify-between h-52 w-80 bg-cover bg-center hover:scale-105 transition-transform"
//                 style={{ backgroundImage: "url('src/assets/backgroundTestImage.jpg')" }}
//             >
//                 {/* Top section with title and location */}
//                 <div>
//                     <h3 className="text-white text-2xl font-bold">{title}</h3>
//                     <div className="flex items-center text-gray-300 opacity-75 mt-1">
//                         <MapPinIcon className="w-5 h-5 mr-1" /> {/* HeroIcon map-pin */}
//                         <p>{location}</p>
//                     </div>
//                 </div>
//
//                 {/* Bottom section with date and ticket price */}
//                 <div className="flex justify-between items-end">
//                     <div className="text-white opacity-75">
//                         <p className="text-lg">{date}</p>
//                     </div>
//                     <div className="text-white">
//                         <p className="text-lg font-bold">${price.toFixed(2)}</p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }
//
// export default EventCard;