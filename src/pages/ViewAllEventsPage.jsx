import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig.js";
import HeaderComponent from "../components/HeaderComponent.jsx";
import FooterComponent from "../components/FooterComponent.jsx";
import NotFound from "./404NotFound.jsx";
import WideEventCard from "../components/EventCards/WideEventCard.jsx";
import FiltersComponent from "../components/FiltersComponent.jsx";
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { googleMapsConfig } from "../locationConfig.js";

// import { getDistance } from 'geolib';

const ViewAllEventsPage = () => {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeFilters, setActiveFilters] = useState({ dateFilter: null, paid: null , availability: null , customDate:null});
    const [userLat, setUserLat] = useState(null);
    const [userLong, setUserLong] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setLoading(true);
                const querySnapshot = await getDocs(collection(db, "Events"));
                const eventData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setEvents(eventData);
                setFilteredEvents(eventData);
                setLoading(false);
                setError(null);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };
        

        fetchEvents();
    }, []);
    
    useEffect(() => {
        // Get user's location when the component mounts
        navigator.geolocation.getCurrentPosition((position) => {
            setUserLat(position.coords.latitude);
            setUserLong(position.coords.longitude);
        });
    }, []);
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: googleMapsConfig.apiKey,
        libraries: ['places'],
    });

    const applyFilters = async (filters) => {
        setActiveFilters(filters);

        let filtered = [...events];

        if (filters.dateFilter) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            

            if (filters.dateFilter === "Today") {
                filtered = filtered.filter((event) => {
                    const eventDate = eventDateTimeParser(event.eventDetails.eventDateTime);
                    eventDate.setHours(0, 0, 0, 0);
                    return eventDate.getTime() === today.getTime();
                });
            } else if (filters.dateFilter === "Tomorrow") {
                const tomorrow = new Date(today);
                tomorrow.setDate(today.getDate() + 1);
                filtered = filtered.filter((event) => {
                    const eventDate = eventDateTimeParser(event.eventDetails.eventDateTime);
                    eventDate.setHours(0, 0, 0, 0);
                    return eventDate.getTime() === tomorrow.getTime();
                });
            } else if (filters.dateFilter === "Weekend") {
                const dayOfWeek = today.getDay();
                const weekendStart = new Date(today);
                weekendStart.setDate(today.getDate() + (6 - dayOfWeek));
                const weekendEnd = new Date(weekendStart);
                weekendEnd.setDate(weekendStart.getDate() + 1);

                filtered = filtered.filter((event) => {
                    const eventDate = eventDateTimeParser(event.eventDetails.eventDateTime);
                    return eventDate >= weekendStart && eventDate <= weekendEnd;
                });
            }
        }

        if (filters.customDate) {
            const customDate = new Date(filters.customDate);
            customDate.setHours(0, 0, 0, 0);
    
            filtered = filtered.filter((event) => {
                console.log('here')
                const eventDate = eventDateTimeParser(event.eventDetails.eventDateTime);
                eventDate.setHours(0, 0, 0, 0);
                // console.log(event.eventDetails.capacity);
                console.log(eventDate);

                
                return eventDate.getDate() === customDate.getDate()+1;
            });
        }

        if (filters.paid !== null) {
            filtered = filtered.filter((event) => event.eventDetails.paidEvent === filters.paid);
        }
        if (filters.availability) {
            
            if(filters.availability=='Available'){
                filtered = filtered.filter((event) => event.attendeesCount <= event.eventDetails.capacity )
            }
            else if(filters.availability=='Unavailable'){
                filtered = filtered.filter((event) => event.attendeesCount >= event.eventDetails.capacity )
            }
            
        }
        if (filters.nearMe) {
            const eventsWithCoordinates = await Promise.all(filtered.map(async (event) => {
                console.log(event.basicInfo.location);
                if(isLoaded){
                const coordinates = await getCoordinates(event.basicInfo.location.value.place_id);
                return { ...event, lat: coordinates.lat, long: coordinates.long };
                }
                
            }));

            const distanceLimit = 5; //it's km not mi
            filtered = eventsWithCoordinates.filter((event) => {
                console.log('event with co-',event);
                const distance = calculateDistance(userLat, userLong, event.lat, event.long);
                return distance <= distanceLimit;
            });
        }

        setFilteredEvents(filtered);
    };

    const getCoordinates = async (placeId) => {
        return new Promise((resolve, reject) => {
            const service = new google.maps.places.PlacesService(document.createElement('div'));
            const request = {
                placeId: placeId,
                fields: ['geometry'],
            };

            service.getDetails(request, (place, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    const location = place.geometry.location;
                    resolve({ lat: location.lat(), long: location.lng() });
                } else {
                    reject('Error geocoding place ID:', status);
                }
            });
        });
    };

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Radius of the Earth in kilometers
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in kilometers
    };

    const removeFilter = (filterType) => {
        const updatedFilters = { ...activeFilters, [filterType]: null };
        setActiveFilters(updatedFilters);
        applyFilters(updatedFilters);
    };

    const eventDateTimeParser = (date) => {
        if (date.toDate) {
            return date.toDate();
        }
        return new Date(date);
    };

    if (error) return <NotFound />;

    return (
        <>
            <HeaderComponent />
            <div className="pt-52 md:pt-24 lg:pt-24 xl:pt-24 bg-primary-light text-primary-dark">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="flex">

                        <div className="w-1/4 pr-6">

                            <FiltersComponent
                                onApplyFilters={applyFilters}
                                activeFilters={activeFilters}
                                removeFilter={removeFilter}
                            />
                        </div>

                        <div className="w-3/4 space-y-6">
                            {(activeFilters.dateFilter || activeFilters.paid !== null || activeFilters.availability||activeFilters.customDate) && (
                                <div className="mb-6 flex space-x-4">
                                    {activeFilters.dateFilter && (
                                        <div className="flex items-center bg-gray-200 px-3 py-1 rounded-full">
                                            <span className="text-gray-500 text-sm">{activeFilters.dateFilter}</span>
                                            <button
                                                className="ml-2 text-red-500"
                                                onClick={() => removeFilter('dateFilter')}
                                            >
                                                x
                                            </button>
                                        </div>
                                    )}
                                    {activeFilters.paid !== null && (
                                        <div className="flex items-center bg-gray-200 px-3 py-1 rounded-full">
                                            <span className="text-gray-500 text-sm">{activeFilters.paid ? 'Paid' : 'Free'}</span>
                                            <button
                                                className="ml-2 text-red-500"
                                                onClick={() => removeFilter('paid')}
                                            >
                                                x
                                            </button>
                                        </div>
                                    )}
                                    {activeFilters.availability && (
                                        <div className="flex items-center bg-gray-200 px-3 py-1 rounded-full">
                                            <span className="text-gray-500 text-sm">{activeFilters.availability}</span>
                                            <button
                                                className="ml-2 text-red-500"
                                                onClick={() => removeFilter('availability')}
                                            >
                                                x
                                            </button>
                                        </div>
                                    )}
                                    {activeFilters.customDate && (
                                        <div className="flex items-center bg-gray-200 px-3 py-1 rounded-full">
                                            <span className="text-gray-500 text-sm">{activeFilters.customDate}</span>
                                            <button
                                                className="ml-2 text-red-500"
                                                onClick={() => removeFilter('customDate')}
                                            >
                                                x
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                            {loading ? (
                                <p>Loading...</p>
                            ) : filteredEvents.length > 0 ? (
                                filteredEvents.map((event) => (
                                    <WideEventCard key={event.id} event={event} />
                                ))
                            ) : (
                                <p>No events found.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <FooterComponent />
        </>
    );
};

export default ViewAllEventsPage;



