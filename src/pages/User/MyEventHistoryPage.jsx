import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from "../../firebaseConfig.js";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const MyEventHistoryPage = () => {
    const [userId, setUserId] = useState(null);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Fetch user authentication status
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
            } else {
                console.log('No user logged in');
            }
        });
        return () => unsubscribe();
    }, []);

    // Fetch RSVP'd events for the user
    useEffect(() => {
        const fetchRSVPs = async () => {
            if (!userId) return;

            try {
                const rsvpDocRef = doc(db, 'UserRSVPs', userId);
                const rsvpDocSnap = await getDoc(rsvpDocRef);

                if (rsvpDocSnap.exists()) {
                    const rsvpData = rsvpDocSnap.data();
                    const userEvents = rsvpData.events || {};
                    setEvents(Object.values(userEvents));
                } else {
                    console.log('No RSVPs found for this user.');
                }
            } catch (error) {
                console.error("Error fetching RSVPs: ", error);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchRSVPs();
        }
    }, [userId]);

    if (loading) {
        return <div className="text-center text-white">Loading your event history...</div>;
    }

    return (
        <div className="w-full p-6">
            <h1 className="text-3xl font-bold text-white mb-6">My Event History</h1>

            {events.length === 0 ? (
                <p className="text-gray-300">You haven't RSVP'd to any events yet.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event, index) => (
                        <div
                            key={index}
                            className="bg-gray-800 shadow-md rounded-lg p-6 text-center hover:bg-gray-700 transition"
                            onClick={() => navigate(`/eventPage/${event.eventId}`)} // Navigate to the event page
                        >
                            <h3 className="text-xl font-semibold text-white mb-2">{event.eventTitle}</h3>
                            <p className="text-gray-400">{new Date(event.eventDateTime).toLocaleDateString()}</p>
                            <p className="text-gray-400">RSVP Quantity: {event.quantity}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyEventHistoryPage;
