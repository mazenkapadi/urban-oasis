import React, { useState, useEffect, Fragment } from "react";
import Slider from "react-slick";
import { db } from "../firebaseConfig.js";
import EventCard from "./EventCard.jsx";
import { Link } from "react-router-dom";
import { ChevronRightIcon } from "@heroicons/react/20/solid/index.js";

const EventCarousel = () => {
    const [ events, setEvents ] = useState([]);

    useEffect(() => {

        const getStartAndEndOfWeek = () => {
            const today = new Date();
            const firstDayOfWeek = today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1); // Adjust if Sunday should be the first day
            const startOfWeek = new Date(today.setDate(firstDayOfWeek));
            const endOfWeek = new Date(today.setDate(firstDayOfWeek + 6));
            return {startOfWeek, endOfWeek};
        };

        const {startOfWeek, endOfWeek} = getStartAndEndOfWeek();

        // Fetch events from Firestore
        const fetchEvents = async () => {
            try {
                const snapshot = await db.collection('Events').get();
                const eventsList = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));

                const eventsThisWeek = eventsList.filter(event => {
                    const eventDate = new Date(event.date);
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
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        swipeToSlide: true,
        touchThreshold: 10,
        swipe: true
    };

    return (
        <>
            <div className="carousel-container py-4 px-2" >
                <div className="flex justify-between items-center p-5" >
                    <h2 className="text-3xl font-bold" >Events This Week</h2 >
                    <Link to="/" className="flex items-center text-blue-500 hover:underline" >
                        View All Events
                        <ChevronRightIcon className="ml-1 h-5 w-5" />
                    </Link >
                </div >
                <Slider {...settings}>
                    {events.map(event => (
                        <EventCard key={event.id} event={event} />
                    ))}
                </Slider >
            </div >
        </>
    )
}

export default EventCarousel;