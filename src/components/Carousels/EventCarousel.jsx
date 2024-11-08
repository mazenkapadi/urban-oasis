import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { db } from "../../firebaseConfig.js";
import EventCard from "../EventCards/EventCard.jsx";
import { Link } from "react-router-dom";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { collection, getDocs } from "firebase/firestore";

const EventCarousel = () => {
    const [ events, setEvents ] = useState([]);

    useEffect(() => {
        const getStartAndEndOfWeek = () => {
            const today = new Date();
            const firstDayOfWeek = today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1);
            const startOfWeek = new Date(today);
            startOfWeek.setDate(firstDayOfWeek);
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
            return {startOfWeek, endOfWeek};
        };

        const {startOfWeek, endOfWeek} = getStartAndEndOfWeek();

        const fetchEvents = async () => {
            try {
                const eventsCollection = collection(db, 'Events');
                const snapshot = await getDocs(eventsCollection);
                const eventsList = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));

                const eventsThisWeek = eventsList.filter(event => {
                    const eventDate = new Date(event.eventDetails.eventDateTime.toDate());
                    return eventDate >= startOfWeek && eventDate <= endOfWeek;
                });

                setEvents(eventsThisWeek);
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
        <div className="carousel-container py-6" >
            {/*<div className="flex justify-between items-center">*/}
            {/*    <h2 className="text-3xl font-bold text-gray-900">Events This Week</h2>*/}
            {/*    <Link to="/events" className="flex items-center text-blue-500 hover:text-blue-700">*/}
            {/*        View All Events*/}
            {/*        <ChevronRightIcon className="ml-1 h-5 w-5" />*/}
            {/*    </Link>*/}
            {/*</div>*/}


            <div className="flex justify-between items-center" >
                <h2 className="text-3xl font-bold text-gray-900" >Events This Week</h2 >
                <Link
                    to="/events"
                    className="flex items-center text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors"
                >
                    <span >See All</span >
                    <ChevronRightIcon className="ml-1 h-4 w-4" />
                </Link >
            </div >

            <Slider {...settings} className="mt-4" >
                {events.map((event) => (
                    <EventCard
                        key={event.id}
                        title={event.basicInfo.title}
                        location={event.basicInfo.location.value.structured_formatting.secondary_text.replace(", USA", "")}
                        date={new Date(event.eventDetails.eventDateTime.seconds * 1000).toLocaleDateString()}
                        price={event.eventDetails.eventPrice}
                        image={event.eventDetails.images[0]?.url || "defaultImageURL"}
                        eventId={event.id}
                    />
                ))}
                {events.length === 0 && (
                    <div className="text-center text-gray-500" >No events available this week.</div >
                )}
            </Slider >
        </div >
    );
};

export default EventCarousel;