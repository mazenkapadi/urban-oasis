import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from "../../firebaseConfig.js";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/20/solid";
import ExploreManage from './ExploreManage';

const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return 'Phone number not available';
    const cleaned = ('' + phoneNumber).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    return match ? `(${match[1]}) ${match[2]}-${match[3]}` : phoneNumber;
};

const UserProfileContent = () => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [userId, setUserId] = useState(null);
    const [profilePic, setProfilePic] = useState('');
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [activeEventIndex, setActiveEventIndex] = useState(0);
    const [nextEventImage, setNextEventImage] = useState('');
    const [timeLeft, setTimeLeft] = useState({});
    const navigate = useNavigate();

    const handleEditProfile = () => navigate('/userProfilePage/contact-info');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
                setEmail(user.email);
                setProfilePic(user.photoURL || '');
            }
        });
        return unsubscribe;
    }, []);

    const fetchEventImage = async (eventId) => {
        try {
            const eventDoc = await getDoc(doc(db, 'Events', eventId));
            if (eventDoc.exists()) {
                const eventData = eventDoc.data();
                setNextEventImage(eventData.eventDetails?.images?.[0]?.url || '');
            }
        } catch (error) {
            console.error('Error fetching event image:', error);
        }
    };

    useEffect(() => {
        const fetchUserData = async () => {
            if (userId) {
                try {
                    const userDoc = await getDoc(doc(db, 'Users', userId));
                    if (userDoc.exists()) {
                        const data = userDoc.data();
                        setName(`${data.name?.firstName || ''} ${data.name?.lastName || ''}`);
                        setPhone(formatPhoneNumber(data.contact?.cellPhone));
                        setEmail(data.contact?.email || email);
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            }
        };

        const fetchUserRSVPs = async () => {
            if (userId) {
                try {
                    const rsvpDoc = await getDoc(doc(db, 'UserRSVPs', userId));
                    if (rsvpDoc.exists()) {
                        const rsvpData = rsvpDoc.data().events || {};
                        const upcomingEvents = Object.values(rsvpData)
                            .filter((event) => new Date(event.eventDateTime) > new Date())
                            .sort((a, b) => new Date(a.eventDateTime) - new Date(b.eventDateTime));

                        setUpcomingEvents(upcomingEvents);
                        if (upcomingEvents.length > 0) {
                            fetchEventImage(upcomingEvents[0].eventId); // Load the image for the first upcoming event
                        }
                    } else {
                        console.log('No RSVPs found for this user.');
                    }
                } catch (error) {
                    console.error('Error fetching RSVP data:', error);
                }
            }
        };

        if (userId) {
            fetchUserData();
            fetchUserRSVPs();
        }
    }, [userId, email]);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const nextEvent = upcomingEvents[activeEventIndex];
            if (nextEvent && nextEvent.eventDateTime) {
                const eventDate = new Date(nextEvent.eventDateTime).getTime();
                const now = new Date().getTime();
                const difference = eventDate - now;

                if (difference > 0) {
                    setTimeLeft({
                        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
                        seconds: Math.floor((difference % (1000 * 60)) / 1000),
                    });
                } else {
                    setTimeLeft({});
                }
            }
        };

        const timer = setInterval(calculateTimeLeft, 1000);
        return () => clearInterval(timer);
    }, [upcomingEvents, activeEventIndex]);

    const handleNextEvent = () => {
        if (activeEventIndex < upcomingEvents.length - 1) {
            const newIndex = activeEventIndex + 1;
            setActiveEventIndex(newIndex);
            fetchEventImage(upcomingEvents[newIndex].eventId); // Load the image for the next event
        }
    };

    const handlePrevEvent = () => {
        if (activeEventIndex > 0) {
            const newIndex = activeEventIndex - 1;
            setActiveEventIndex(newIndex);
            fetchEventImage(upcomingEvents[newIndex].eventId); // Load the image for the previous event
        }
    };

    const nextEvent = upcomingEvents[activeEventIndex];

    return (
        <div className="w-full">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-white">My Dashboard</h1>
                <p className="text-gray-300">Welcome back, {name.split(' ')[0] || 'User'}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-gray-800 shadow-md rounded-lg p-6 col-span-1 flex flex-col items-center h-full">
                    <img src={profilePic} alt="User Profile" className="rounded-full w-24 h-24 object-cover mb-4" />
                    <h2 className="text-xl font-semibold mb-2 text-white">{name || 'Your Name'}</h2>
                    <p className="text-gray-400">{phone}</p>
                    <p className="text-gray-400">{email}</p>
                    <button
                        onClick={handleEditProfile}
                        className="mt-4 w-full bg-blue-800 text-white font-bold py-2 rounded-md hover:bg-blue-600 transition"
                    >
                        Edit Profile
                    </button>
                </div>

                {nextEvent && (
                    <div className="lg:col-span-2 flex flex-col justify-between">
                        <h2 className="text-xl font-bold text-gray-200 mb-4">Your Next Event</h2>
                        <div
                            className="relative shadow-md rounded-lg p-6 flex flex-col justify-center items-center text-center text-white h-full"
                            style={{
                                backgroundImage: nextEventImage ? `url(${nextEventImage})` : "none",
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                        >
                            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg"></div>
                            <div className="relative z-10 flex flex-col items-center">
                                <h2 className="text-3xl font-bold mb-2">{nextEvent.eventTitle}</h2>
                                <h3 className="text-base font-semibold mb-4">{new Date(nextEvent.eventDateTime).toDateString()}</h3>

                                <div className="flex justify-around w-full font-bold text-base mb-4 space-x-6">
                                    <div className="flex flex-col items-center shadow-lg">
                                        <div className="text-lg">{timeLeft.days || 0}</div>
                                        <div className="text-sm text-gray-300">Days</div>
                                    </div>
                                    <div className="flex flex-col items-center shadow-lg">
                                        <div className="text-lg">{timeLeft.hours || 0}</div>
                                        <div className="text-sm text-gray-300">Hours</div>
                                    </div>
                                    <div className="flex flex-col items-center shadow-lg">
                                        <div className="text-lg">{timeLeft.minutes || 0}</div>
                                        <div className="text-sm text-gray-300">Minutes</div>
                                    </div>
                                    <div className="flex flex-col items-center shadow-lg">
                                        <div className="text-lg">{timeLeft.seconds || 0}</div>
                                        <div className="text-sm text-gray-300">Seconds</div>
                                    </div>
                                </div>

                                <button
                                    className="bg-blue-600 hover:bg-blue-800 px-4 py-2 rounded text-lg text-white font-bold shadow-lg"
                                    onClick={() => navigate(`/eventPage/${nextEvent.eventId}`)}
                                >
                                    View Event Details
                                </button>
                            </div>

                            {/* Left and Right Arrows */}
                            <button
                                onClick={handlePrevEvent}
                                disabled={activeEventIndex === 0}
                                className={`absolute left-2 top-1/2 transform -translate-y-1/2 text-white-300 hover:text-white ${activeEventIndex === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                            >
                                <ChevronLeftIcon className="w-8 h-8"/>
                            </button>
                            <button
                                onClick={handleNextEvent}
                                disabled={activeEventIndex === upcomingEvents.length - 1}
                                className={`absolute right-2 top-1/2 transform -translate-y-1/2 text-white-300 hover:text-white ${activeEventIndex === upcomingEvents.length - 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                            >
                                <ChevronRightIcon className="w-8 h-8"/>
                            </button>
                        </div>

                    </div>
                    )}
            </div>
            <ExploreManage/>
        </div>
    );
};

export default UserProfileContent;
