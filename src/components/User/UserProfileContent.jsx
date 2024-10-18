import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from "../../firebaseConfig.js";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return 'Phone number not available';
    const cleaned = ('' + phoneNumber).replace(/\D/g, ''); // Remove non-numeric characters
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phoneNumber;
};

const UserProfileContent = () => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [userId, setUserId] = useState(null);
    const [profilePic, setProfilePic] = useState('');
    const [events, setEvents] = useState([]); // Stores upcoming events
    const [nextEvent, setNextEvent] = useState(null); // Stores the next upcoming event
    const [nextEventImage, setNextEventImage] = useState(''); // Store the event image
    const [pastEvents, setPastEvents] = useState([]);
    const [timeLeft, setTimeLeft] = useState({}); // State for countdown timer
    const navigate = useNavigate();

    const handleEditProfile = () => {
        navigate('/userProfilePage/contact-info');
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
                setEmail(user.email);
                setProfilePic(user.photoURL || '');
            } else {
                console.log('No user logged in');
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
            if (userId) {
                try {
                    const docRef = doc(db, 'Users', userId);
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        console.log('User data:', data);

                        setName(`${data.name?.firstName || ''} ${data.name?.lastName || ''}`);

                        const formattedPhone = formatPhoneNumber(data.contact?.cellPhone);
                        setPhone(formattedPhone);

                        setEmail(data.contact?.email || email || 'Email not found');
                    } else {
                        console.log('No such document!');
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            }
        };

        const fetchUserRSVPs = async () => {
            if (userId) {
                try {
                    const rsvpRef = doc(db, 'UserRSVPs', userId);
                    const rsvpSnap = await getDoc(rsvpRef);

                    if (rsvpSnap.exists()) {
                        const rsvpData = rsvpSnap.data().events || {};
                        const allEvents = Object.values(rsvpData);

                        const upcomingEvents = allEvents.filter((event) => new Date(event.eventDateTime) > new Date());
                        const pastEvents = allEvents.filter((event) => new Date(event.eventDateTime) <= new Date());

                        if (upcomingEvents.length > 0) {
                            setNextEvent(upcomingEvents[0]); // Set the next upcoming event
                            fetchEventImage(upcomingEvents[0].eventId); // Fetch the image for the next event
                        }

                        setEvents(upcomingEvents);
                        setPastEvents(pastEvents);
                    } else {
                        console.log('No RSVPs found for this user.');
                    }
                } catch (error) {
                    console.error('Error fetching RSVP data:', error);
                }
            }
        };

        const fetchEventImage = async (eventId) => {
            try {
                const eventRef = doc(db, 'Events', eventId);
                const eventSnap = await getDoc(eventRef);

                if (eventSnap.exists()) {
                    const eventData = eventSnap.data();
                    if (eventData.eventDetails?.images?.[0]) {
                        setNextEventImage(eventData.eventDetails.images[0]); // Set event image
                    }
                } else {
                    console.log('Event not found.');
                }
            } catch (error) {
                console.error('Error fetching event image:', error);
            }
        };

        if (userId) {
            fetchUserData();
            fetchUserRSVPs();
        }
    }, [userId, email]);

    // Countdown Logic for Next Event
    useEffect(() => {
        if (nextEvent && nextEvent.eventDateTime) {
            const intervalId = setInterval(() => {
                const eventDate = new Date(nextEvent.eventDateTime).getTime();
                const now = new Date().getTime();
                const difference = eventDate - now;

                if (difference > 0) {
                    setTimeLeft({
                        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
                    });
                } else {
                    clearInterval(intervalId);
                    setTimeLeft({});
                }
            }, 1000); // Update every second

            return () => clearInterval(intervalId); // Clean up interval on component unmount
        }
    }, [nextEvent]);

    return (
        <div className="w-full">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-white">My Dashboard</h1>
                <p className="text-gray-300">Welcome back, {name.split(' ')[0] || 'User'}</p>
            </div>

            {/* Profile Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-gray-800 shadow-md rounded-lg p-6 col-span-1 flex flex-col items-center">
                    <img
                        src={profilePic}
                        alt="User Profile"
                        className="rounded-full w-24 h-24 object-cover mb-4"
                    />
                    <h2 className="text-xl font-semibold mb-2 text-white">{name || 'Your Name'}</h2>
                    <p className="text-gray-400">{phone}</p>
                    <p className="text-gray-400">{email}</p>
                    <button
                        onClick={handleEditProfile}
                        className="mt-4 w-full bg-blue-800 text-white font-bold py-2 rounded-md hover:bg-blue-600 transition">
                        Edit Profile
                    </button>
                </div>

                {/* Next Event Countdown */}
                {nextEvent && (
                    <div
                        className="bg-cover bg-center relative shadow-md rounded-lg p-6 lg:col-span-2"
                        style={{ backgroundImage: `url(${nextEventImage})` }}
                    >
                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg"></div>
                        <div className="relative z-10 flex flex-col items-center text-center">
                            <h2 className="text-2xl font-bold text-white">Your Next Event</h2>
                            <h3 className="text-lg font-semibold text-white mb-2">{nextEvent.eventTitle}</h3>
                            <div className="flex justify-around w-full text-white font-bold text-xl">
                                <div className="flex flex-col items-center">
                                    <div>{timeLeft.days || 0}</div>
                                    <div className="text-gray-300">Days</div>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div>{timeLeft.hours || 0}</div>
                                    <div className="text-gray-300">Hours</div>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div>{timeLeft.minutes || 0}</div>
                                    <div className="text-gray-300">Minutes</div>
                                </div>
                            </div>
                        </div>
                        <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 px-4 py-2 rounded-md text-white">
                            {nextEvent.eventDateTime}
                        </div>
                    </div>
                )}
            </div>

            {/* RSVPed Events */}
            <div className="mt-6">
                <h2 className="text-lg font-semibold mb-4 text-white">My Upcoming Events</h2>
                <ul className="list-disc pl-5">
                    {events.length > 0 ? (
                        events.map((event, index) => (
                            <li key={index} className="text-gray-300">
                                {event.eventTitle} - {event.eventDateTime}
                            </li>
                        ))
                    ) : (
                        <li className="text-gray-500">No upcoming events.</li>
                    )}
                </ul>
            </div>

            {/* Past Events */}
            <div className="mt-6">
                <h2 className="text-lg font-semibold mb-4 text-white">My Past Events</h2>
                <ul className="list-disc pl-5">
                    {pastEvents.length > 0 ? (
                        pastEvents.map((event, index) => (
                            <li key={index} className="text-gray-300">
                                {event.eventTitle} - {event.eventDateTime}
                            </li>
                        ))
                    ) : (
                        <li className="text-gray-500">No past events.</li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default UserProfileContent;
