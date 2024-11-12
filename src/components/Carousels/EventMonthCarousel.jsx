import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { db } from "../../firebaseConfig.js";
import EventCard from "../EventCards/EventCard.jsx";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';

const EventMonthCarousel = () => {
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();

    // Handle card click to navigate to event detail page
    const handleCardClick = (eventId) => {
        navigate(`/eventPage/${eventId}`);
    };

    // Fetch events for the remaining days of the month, excluding weekly events
    useEffect(() => {
        const getEventsUntilEndOfMonth = () => {
            const today = new Date();
            const endOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 7);
            const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
            return { endOfWeek, endOfMonth };
        };

        const { endOfWeek, endOfMonth } = getEventsUntilEndOfMonth();

        const fetchEvents = async () => {
            try {
                const eventsCollection = collection(db, 'Events');
                const snapshot = await getDocs(eventsCollection);
                const eventsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                // Filter events that occur after this week but before the end of the month
                const monthlyEvents = eventsList.filter(event => {
                    const eventDate = new Date(event.eventDetails.eventDateTime.toDate());
                    return eventDate > endOfWeek && eventDate <= endOfMonth;
                });

                setEvents(monthlyEvents);
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };

        fetchEvents();
    }, []);

    const settings = {
        infinite: events.length > 1,
        speed: 500,
        slidesToShow: Math.min(events.length, 4),
        slidesToScroll: 1,
        swipeToSlide: true,
        touchThreshold: 10,
        swipe: true,
        arrows: false,
    };

    return (
        <div className="carousel-container py-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-3xl font-bold text-gray-900">Events Later This Month</h2>
            </div>
            {events.length > 0 ? (
                <Slider {...settings} className="mt-4">
                    {events.map(event => (
                        <EventCard
                            key={event.id}
                            onClick={() => handleCardClick(event.id)}
                            title={event.basicInfo.title}
                            location={event.basicInfo.location.value.structured_formatting.secondary_text.replace(", USA", "")}
                            date={event.eventDetails.eventDateTime.toDate().toLocaleDateString()}
                            price={event.eventDetails.eventPrice}
                            image={event.eventDetails.images[0]?.url || 'defaultImageURL'}
                            eventId={event.id}
                            event={event}
                        />
                    ))}

                    {events.length < settings.slidesToShow && Array.from({ length: settings.slidesToShow - events.length }).map((_, i) => (
                        <div key={i} className="event-card-placeholder bg-gray-800 rounded-lg shadow-md p-8 flex items-center justify-center text-gray-500">
                            No More Events
                        </div>
                    ))}
                </Slider>
            ) : (
                <div className="text-center text-gray-400 mt-8">No events available later this month.</div>
            )}
        </div>
    );
};

export default EventMonthCarousel;


/*


// import React, { useState, useEffect, } from "react";
// import Slider from "react-slick";
// import { db } from "../../firebaseConfig.js";
// import EventCard from "../EventCards/EventCard.jsx";
// import { Link } from "react-router-dom";
// import { ChevronRightIcon } from "@heroicons/react/20/solid/index.js";
// import { collection, getDocs } from "firebase/firestore";
// import { useNavigate } from 'react-router-dom';
//
// const EventMonthCarousel = () => {
//     const [ events, setEvents ] = useState([]);
//     const navigate = useNavigate();
//
//     const handleCardClick = (event) => {
//         navigate(`/eventPage/${event.id}`);
//     };
//
//     useEffect(() => {
//         const getEventsUntilEndOfMonth = () => {
//             const today = new Date();
//             const endOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 7); // End of this week
//             const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Last day of the month
//             return {endOfWeek, endOfMonth};
//         };
//         const {endOfWeek, endOfMonth} = getEventsUntilEndOfMonth();
//         const fetchEvents = async () => {
//             try {
//                 const eventsCollection = collection(db, 'Events');
//                 const snapshot = await getDocs(eventsCollection);
//                 const eventsList = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
//
//                 const eventsAfterThisWeekend = eventsList.filter(event => {
//                     const eventDate = new Date(event.eventDetails.eventDateTime.toDate());
//                     return eventDate > endOfWeek && eventDate <= endOfMonth;
//                 });
//                 setEvents(eventsAfterThisWeekend);
//             } catch (error) {
//                 console.error('Error fetching events:', error);
//             }
//         };
//         fetchEvents();
//     }, []);
//
//     const settings = {
//         infinite: events.length > 1,
//         speed: 500,
//         slidesToShow: Math.min(events.length, 4),
//         slidesToScroll: 1,
//         swipeToSlide: true,
//         touchThreshold: 10,
//         swipe: true,
//         arrows: false,
//     };
//
//     return (
//         <>
//             <div className="carousel-container" >
//                 <div className="flex justify-between items-center" >
//                     <h2 className="text-4xl font-extrabold text-gray-900 pb-3" >Events Later This Month</h2 >
//                 </div >
//                 <Slider {...settings}  >
//                     {events.map(event => (
//                         <EventCard
//                             key={event.id}
//                             onClick={() => handleCardClick(event.id)}
//                             title={event.basicInfo.title}
//                             location={event.basicInfo.location.value.structured_formatting.secondary_text.substring(0, event.basicInfo.location.value.structured_formatting.secondary_text.indexOf(", USA"))}
//                             date={event.eventDetails.eventDateTime.toDate().toLocaleDateString()}
//                             price={event.eventDetails.eventPrice}
//                             image={event.eventDetails.images[0] || 'defaultImageURL'}
//                             eventId={event.id}
//                             event={event}
//                         />
//                     ))}
//                     {events.length < settings.slidesToShow && [ ...Array(settings.slidesToShow - events.length) ].map((_, i) => (
//                         <EventCard key={i} />
//                     ))}
//                 </Slider >
//             </div >
//         </>
//     )
// }
//
// export default EventMonthCarousel;



import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { db } from "../../firebaseConfig.js";
import EventCard from "../EventCards/EventCard.jsx";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';

const EventMonthCarousel = () => {
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();

    const handleCardClick = (eventId) => {
        navigate(`/eventPage/${eventId}`);
    };

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const today = new Date();
                const endOfPeriod = new Date(today);
                endOfPeriod.setDate(today.getDate() + 30); // Set 30 days from today

                const eventsCollection = collection(db, 'Events');
                const snapshot = await getDocs(eventsCollection);
                const eventsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                const upcomingEvents = eventsList.filter(event => {
                    const eventDate = new Date(event.eventDetails.eventDateTime.toDate());
                    return eventDate > today && eventDate <= endOfPeriod;
                });

                setEvents(upcomingEvents);
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };

        fetchEvents();
    }, []);

    const settings = {
        infinite: events.length > 1,
        speed: 500,
        slidesToShow: Math.min(events.length, 4),
        slidesToScroll: 1,
        swipeToSlide: true,
        touchThreshold: 10,
        swipe: true,
        arrows: false,
    };

    return (
        <div className="carousel-container">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-4xl font-extrabold text-gray-100 pb-3">Events in the Next 30 Days</h2>
            </div>
            {events.length > 0 ? (
                <Slider {...settings}>
                    {events.map(event => (
                        <EventCard
                            key={event.id}
                            onClick={() => handleCardClick(event.id)}
                            title={event.basicInfo.title}
                            location={event.basicInfo.location.value.structured_formatting.secondary_text.replace(", USA", "")}
                            date={event.eventDetails.eventDateTime.toDate().toLocaleDateString()}
                            price={event.eventDetails.eventPrice}
                            image={event.eventDetails.images[0]?.url || 'defaultImageURL'}
                            eventId={event.id}
                            event={event}
                        />
                    ))}
                    {events.length < settings.slidesToShow && Array.from({ length: settings.slidesToShow - events.length }).map((_, i) => (
                        <div key={i} className="event-card-placeholder bg-gray-800 rounded-lg shadow-md p-8 flex items-center justify-center text-gray-500">
                            No More Events
                        </div>
                    ))}
                </Slider>
            ) : (
                <div className="text-center text-gray-400 mt-8">No events available in the next 30 days.</div>
            )}
        </div>
    );
}

export default EventMonthCarousel;
*/
