// import React from "react";
// import { MapPinIcon } from '@heroicons/react/24/outline';
//
// function EventCard() {
//     const ticketPrice = 10.99; // Static ticket price
//     const eventTitle = "Static Event Title";
//     const eventLocation = "Static Event Location";
//     const eventDate = "Sept 25, 2024";
//     const eventImage = "src/assets/backgroundTestImage.jpg"; // Static background image
//
//     return (
//         <div className="event-card flex-shrink-0">
//             <div
//                 className="rounded-lg bg-gray-800 p-4 flex flex-col justify-between h-56 w-72 bg-cover bg-center hover:scale-105 transition-transform duration-300 shadow-lg"
//                 style={{ backgroundImage: `url(${eventImage})` }}
//             >
//                 <div>
//                     <h3 className="text-white text-2xl font-bold truncate">{eventTitle}</h3>
//                     <div className="flex items-center text-gray-300 opacity-75 mt-1">
//                         <MapPinIcon className="w-5 h-5 mr-1" />
//                         <p>{eventLocation}</p>
//                     </div>
//                 </div>
//
//                 <div className="flex justify-between items-end mt-3">
//                     <div className="text-white opacity-75">
//                         <p className="text-lg">{eventDate}</p>
//                     </div>
//                     <div className="text-white">
//                         <p className="text-lg font-bold">${ticketPrice.toFixed(2)}</p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }
//
// export default EventCard;


import React from "react";
import { MapPinIcon } from '@heroicons/react/24/outline';

function EventCard({
                       eventTitle = "Static Event Title",
                       eventLocation = "Static Event Location",
                       eventDate = "Sept 25, 2024",
                       eventImage = "src/assets/backgroundTestImage.jpg",
                       ticketPrice = 10.99,
                       merchAvailability = false,
                       fbAvail = false,
                       alcAvail = false,
                   }) {
    return (
        <div className="event-card flex-shrink-0">
            <div
                className="rounded-lg bg-gray-800 p-4 flex flex-col justify-between h-56 w-72 bg-cover bg-center hover:scale-105 transition-transform duration-300 shadow-lg"
                style={{ backgroundImage: `url(${eventImage})` }}
            >
                <div>
                    <h3 className="text-white text-2xl font-bold truncate">{eventTitle}</h3>
                    <div className="flex items-center text-gray-300 opacity-75 mt-1">
                        <MapPinIcon className="w-5 h-5 mr-1" />
                        <p>{eventLocation}</p>
                    </div>
                </div>

                <div className="flex justify-between items-end mt-3">
                    <div className="text-white opacity-75">
                        <p className="text-lg">{eventDate}</p>
                    </div>
                    <div className="text-white">
                        <p className="text-lg font-bold">${ticketPrice.toFixed(2)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EventCard;
