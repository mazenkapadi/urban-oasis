import React, { useState, useEffect, } from "react";
import Slider from "react-slick";
import { db } from "../firebaseConfig.js";
import EventCard from "./EventCard.jsx";
import { Link } from "react-router-dom";
import { ChevronRightIcon } from "@heroicons/react/20/solid/index.js";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';

const EventMonthCarousel = () => {
    const [ events, setEvents ] = useState([]);
    const navigate = useNavigate();

    const handleCardClick = (event) => {
        navigate(`/eventPage/${event.id}`);
    };

    useEffect(() => {
        const getEventsUntilEndOfMonth = () => {
            const today = new Date();
            const endOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 7); // End of this week
            const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Last day of the month
            return {endOfWeek, endOfMonth};
        };
        const {endOfWeek, endOfMonth} = getEventsUntilEndOfMonth();
        const fetchEvents = async () => {
            try {
                const eventsCollection = collection(db, 'Events');
                const snapshot = await getDocs(eventsCollection);
                const eventsList = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));

                const eventsAfterThisWeekend = eventsList.filter(event => {
                    const eventDate = new Date(event.eventDetails.eventDateTime.toDate());
                    return eventDate > endOfWeek && eventDate <= endOfMonth;
                });
                setEvents(eventsAfterThisWeekend);
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };
        fetchEvents();
    }, []);

    const settings = {
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        swipeToSlide: true,
        touchThreshold: 10,
        swipe: true,
        arrows: false,
    };

    return (
        <>
            <div className="carousel-container" >
                <div className="flex justify-between items-center" >
                    <h2 className="text-4xl font-extrabold text-gray-900 pb-3" >Events Later This Month</h2 >
                </div >
                <Slider {...settings}  >
                    {events.map(event => (
                        // <Link key={event.id} to={`/eventPage/${event.id}`} >
                        <EventCard
                            key={event.id}
                            onClick={() => handleCardClick(event.id)}
                            title={event.basicInfo.title}
                            location={event.basicInfo.location.value.structured_formatting.secondary_text.substring(0, event.basicInfo.location.value.structured_formatting.secondary_text.indexOf(", USA"))}
                            date={event.eventDetails.eventDateTime.toDate().toLocaleDateString()}
                            price={event.eventDetails.eventPrice}
                            image={event.eventDetails.images[0] || 'defaultImageURL'}
                            eventId={event.id}
                            event={event}
                        />
                    ))}
                    {events.length < settings.slidesToShow && [ ...Array(settings.slidesToShow - events.length) ].map((_, i) => (
                        <EventCard key={i} />
                    ))}
                </Slider >
            </div >
        </>
    )
}

export default EventMonthCarousel;