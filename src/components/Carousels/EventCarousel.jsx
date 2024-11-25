import React, { useState, useEffect, useRef } from "react";
import { db } from "../../firebaseConfig.js";
import EventCard from "../EventCards/EventCard.jsx";
import { collection, getDocs } from "firebase/firestore";
import { getDateRange } from "../../services/dateUtils.js";

const EventCarousel = ({ rangeType }) => {
    const [events, setEvents] = useState([]);
    const carouselRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    useEffect(() => {
        const { startDate, endDate } = getDateRange(rangeType);

        const fetchEvents = async () => {
            try {
                const eventsCollection = collection(db, "Events");
                const snapshot = await getDocs(eventsCollection);

                const eventsList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

                const filteredEvents = eventsList.filter((event) => {
                    if (!event.eventDetails?.eventDateTime) return false;
                    const eventDate = event.eventDetails.eventDateTime.toDate();
                    return eventDate >= startDate && eventDate <= endDate;
                });

                setEvents(filteredEvents);
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        };

        fetchEvents();
    }, [rangeType]);

    const handleMouseDown = (e) => {
        e.preventDefault();
        setIsDragging(true);
        setStartX(e.pageX - carouselRef.current.offsetLeft);
        setScrollLeft(carouselRef.current.scrollLeft);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - carouselRef.current.offsetLeft;
        const walk = (x - startX) * 2;
        carouselRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    return (
        <div className="carousel-container scrollbar-hide py-6" onMouseLeave={handleMouseLeave}>
            <div className="relative mt-4">
                <div
                    ref={carouselRef}
                    className="flex overflow-y-auto space-x-6 snap-y snap-mandatory"
                    style={{ scrollBehavior: "smooth", cursor: isDragging ? "grabbing" : "grab" }}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                >
                    {events.length > 0 ? (
                        events.map((event) => (
                            <EventCard
                                key={event.id}
                                eventId={event.id}
                                title={event.basicInfo.title}
                                location={event.basicInfo.location.label || "Location not specified"}
                                date={event.eventDetails.eventDateTime.toDate().toLocaleDateString()}
                                price={event.eventDetails.eventPrice}
                                image={event.eventDetails.images[0]?.url || "/images/placeholder.png"}
                            />
                        ))
                    ) : (
                        <div className="text-center text-gray-400 mt-8 w-full">
                            No events this {rangeType}!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EventCarousel;