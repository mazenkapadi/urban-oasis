import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig.js";
import HeaderComponent from "../components/HeaderComponent.jsx";
import FooterComponent from "../components/FooterComponent.jsx";
import NotFound from "./404NotFound.jsx";
import WideEventCard from "../components/WideEventCard.jsx";
import FiltersComponent from "../components/FiltersComponent.jsx";

const ViewAllEventsPage = () => {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeFilters, setActiveFilters] = useState({ dateFilter: null, paid: null });

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

    const applyFilters = (filters) => {
        setActiveFilters(filters);

        let filtered = [...events];

        if (filters.dateFilter) {
            const today = new Date();
            today.setHours(0, 0, 0, 0); 
            const eventDateTimeParser = (date) => {
                if (date.toDate) {
                    return date.toDate();
                }
                return new Date(date);
            };

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

        if (filters.paid !== null) {
            filtered = filtered.filter((event) => event.eventDetails.paidEvent === filters.paid);
        }

        setFilteredEvents(filtered);
    };

    const removeFilter = (filterType) => {
        const updatedFilters = { ...activeFilters, [filterType]: null };
        setActiveFilters(updatedFilters); 
        applyFilters(updatedFilters); 
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
                            {(activeFilters.dateFilter || activeFilters.paid !== null) && (
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



