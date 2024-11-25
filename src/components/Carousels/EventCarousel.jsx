import React, { useState, useEffect } from "react";
import { db } from "../../firebaseConfig.js";
import EventCard from "../EventCards/EventCard.jsx";
import { collection, getDocs } from "firebase/firestore";
import { getDateRange } from "../../services/dateUtils.js";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";

const EventCarousel = ({ rangeType }) => {
    const [events, setEvents] = useState([]);

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

    return (
        <div className="carousel-container py-6">
            <div className="relative mt-4">
                <Swiper

                    modules={[Navigation, Pagination]}
                    spaceBetween={16}
                    slidesPerView="auto"
                    navigation={false}
                    pagination={false}
                    loop={false}
                    centeredSlides={false}
                    allowTouchMove={false}
                    freeMode={false}
                    scrollbar={{ draggable: false }}
                >
                    {events.length > 0 ? (
                        events.map((event) => (
                            <SwiperSlide key={event.id} style={{ width: "auto", padding: '8px'}}>
                                <EventCard
                                    eventId={event.id}
                                    title={event.basicInfo.title}
                                    location={event.basicInfo.location.label || "Location not specified"}
                                    date={event.eventDetails.eventDateTime.toDate().toLocaleDateString()}
                                    price={event.eventDetails.eventPrice}
                                    image={event.eventDetails.images[0]?.url || "/images/placeholder.png"}
                                />
                            </SwiperSlide>
                        ))
                    ) : (
                        <div className="text-center text-gray-400 mt-8 w-full">
                            No events this {rangeType}!
                        </div>
                    )}
                </Swiper>
            </div>
        </div>
    );
};

export default EventCarousel;
