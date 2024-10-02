import React, {useState, useEffect,} from "react";
import Slider from "react-slick";
import {db} from "../firebaseConfig.js";
import EventCard from "./EventCard.jsx";
import {Link} from "react-router-dom";
import {ChevronRightIcon} from "@heroicons/react/20/solid/index.js";
import {collection, getDocs} from "firebase/firestore";
import {useNavigate} from 'react-router-dom';
import {slideHandler, swipeEnd} from "react-slick/lib/utils/innerSliderUtils.js";

const EventCarousel = () => {
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();

    const handleCardClick = (event) => {
        navigate(`/eventPage/${event.id}`);
    };

    useEffect(() => {

        const getStartAndEndOfWeek = () => {
            const today = new Date();
            const firstDayOfWeek = today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1); // Adjust if Sunday should be the first day
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
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        swipeToSlide: true,
        touchThreshold: 10,
        swipe: true,
    };

    return (
        <>
            <div className="carousel-container py-6 px-4">
                <div className="flex justify-between items-center p-2 mb-4">
                    <h2 className="text-4xl font-extrabold text-gray-900">Events This Week</h2>
                    <Link to="/" className="flex items-center text-blue-500 hover:underline">
                        View All Events
                        <ChevronRightIcon className="ml-1 h-5 w-5"/>
                    </Link>
                </div>
                <Slider {...settings}  >

                    {events.map(event => (
                        // <Link key={event.id} to={`/eventPage/${event.id}`} >
                        <EventCard
                            key={event.id}
                            onClick={() => handleCardClick(event.id)}
                            title={event.basicInfo.title}
                            location={event.basicInfo.location}
                            date={event.eventDetails.eventDateTime.toDate().toLocaleDateString()}
                            price={event.eventDetails.eventPrice}
                            image={event.eventDetails.images[0] || 'defaultImageURL'}
                            eventId={event.id}
                            event={event}
                        />
                        // </Link>
                    ))}
                    {events.length < settings.slidesToShow && [...Array(settings.slidesToShow - events.length)].map((_, i) => (
                        <EventCard key={i}/>
                    ))}
                    {/*<EventCard/>*/}
                    {/*<EventCard/>*/}
                    {/*<EventCard/>*/}
                    {/*<EventCard/>*/}
                    {/*<EventCard/>*/}
                    {/*<EventCard/>*/}
                    {/*<EventCard/>*/}
                    {/*<EventCard/>*/}
                    {/*<EventCard/>*/}
                    {/*<EventCard/>*/}
                </Slider>
            </div>
        </>
    )
}

export default EventCarousel;