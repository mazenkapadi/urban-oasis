import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from "../../firebaseConfig.js";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { CalendarIcon, MapPinIcon } from '@heroicons/react/24/outline';

const MyEventHistoryPage = () => {
    const [userId, setUserId] = useState(null);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortOption, setSortOption] = useState('newest');
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
                console.log("User ID:", user.uid);
            } else {
                console.log('No user logged in');
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchRSVPs = async () => {
            if (!userId) {
                console.log("User ID is null, skipping RSVP fetch.");
                return;
            }

            try {
                console.log("Fetching RSVPs for user:", userId);
                const rsvpDocRef = doc(db, 'UserRSVPs', userId);
                const rsvpDocSnap = await getDoc(rsvpDocRef);

                if (rsvpDocSnap.exists()) {
                    console.log("User RSVPs document found.");
                    const rsvpData = rsvpDocSnap.data();
                    const userEvents = rsvpData.rsvps || {}; // Access 'rsvps' subfield

                    // Fetch additional event data including images for each RSVP'd event
                    const eventDetails = await Promise.all(
                        Object.values(userEvents).map(async (event) => {
                            console.log("Fetching event details for eventId:", event.eventId);
                            const eventDocRef = doc(db, 'Events', event.eventId);
                            const eventDocSnap = await getDoc(eventDocRef);

                            if (eventDocSnap.exists()) {
                                const eventData = eventDocSnap.data();
                                const imageUrl = eventData.eventDetails?.images?.[0]?.url || '';
                                console.log("Fetched Event Image URL:", imageUrl);

                                return {
                                    ...event,
                                    imageUrl,
                                    location: eventData.basicInfo?.location?.label || 'Location not available',
                                    paidEvent: eventData.eventDetails?.paidEvent || false,
                                    price: eventData.eventDetails?.eventPrice || 0,
                                };
                            }
                            return event;
                        })
                    );

                    setEvents(eventDetails);
                } else {
                    console.log('No RSVPs found for this user.');
                }
            } catch (error) {
                console.error("Error fetching RSVPs:", error);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchRSVPs();
        }
    }, [userId]);

    const handleSortChange = (option) => {
        setSortOption(option);

        const sortedEvents = [...events];
        if (option === 'newest') {
            sortedEvents.sort((a, b) => new Date(b.eventDateTime) - new Date(a.eventDateTime));
        } else if (option === 'oldest') {
            sortedEvents.sort((a, b) => new Date(a.eventDateTime) - new Date(b.eventDateTime));
        } else if (option === 'alphabetical') {
            sortedEvents.sort((a, b) => a.eventTitle.localeCompare(b.eventTitle));
        }
        setEvents(sortedEvents);
    };

    if (loading) {
        return <div className="text-center text-white">Loading your event history...</div>;
    }

    return (
        <div className="w-full p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-white">My Events</h1>

                <select
                    value={sortOption}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="bg-gray-700 text-white px-4 py-2 rounded-md"
                >
                    <option value="newest">Newest to Oldest</option>
                    <option value="oldest">Oldest to Newest</option>
                    <option value="alphabetical">Alphabetical Order</option>
                </select>
            </div>

            {events.length === 0 ? (
                <p className="text-gray-300">You haven't RSVP'd to any events yet.</p>
            ) : (
                <div className="space-y-6">
                    {events.map((event, index) => (
                        <div
                            key={index}
                            className="flex bg-gray-800 shadow-md rounded-lg overflow-hidden hover:bg-gray-700 transition cursor-pointer"
                            onClick={() => navigate(`/eventPage/${event.eventId}`)}
                        >
                            {event.imageUrl && (
                                <img
                                    src={event.imageUrl}
                                    alt={event.eventTitle}
                                    className="w-40 h-42 object-cover"
                                />
                            )}
                            <div className="p-4 flex-1">
                                <h3 className="text-xl font-semibold text-white mb-1">{event.eventTitle}</h3>
                                <div className="flex items-center text-gray-400 text-sm mb-2">
                                    <MapPinIcon className="w-5 h-5 mr-1" />
                                    <span>{event.location}</span>
                                </div>
                                <div className="flex items-center text-gray-400 text-sm mb-2">
                                    <CalendarIcon className="w-5 h-5 mr-1" />
                                    <span>{new Date(event.eventDateTime).toLocaleDateString()}</span>
                                </div>
                                <p className="text-gray-400">RSVP Quantity: {event.quantity}</p>
                                <div className="text-lg font-bold text-white mt-2">
                                    {event.paidEvent ? `$${event.price.toFixed(2)}` : 'Free RSVP'}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyEventHistoryPage;
