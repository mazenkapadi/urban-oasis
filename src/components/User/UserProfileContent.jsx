import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from "../../firebaseConfig.js";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import ExploreManage from './ExploreManage';

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
    const [nextEvent, setNextEvent] = useState(null); // Stores the next upcoming event
    const [nextEventImage, setNextEventImage] = useState(''); // Store the event image
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
                        setName(`${data.name?.firstName || ''} ${data.name?.lastName || ''}`);
                        setPhone(formatPhoneNumber(data.contact?.cellPhone));
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

                        if (upcomingEvents.length > 0) {
                            setNextEvent(upcomingEvents[0]); // Set the next upcoming event
                            fetchEventImage(upcomingEvents[0].eventId); // Fetch the image for the next event
                        }
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
                        seconds: Math.floor((difference % (1000 * 60)) / 1000),
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
                {/* Left side: Account info */}
                <div className="bg-gray-800 shadow-md rounded-lg p-6 col-span-1 flex flex-col items-center h-full">
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

                {/* Right side: Next Event */}
                {nextEvent && (
                    <div className="lg:col-span-2 flex flex-col justify-between">
                        {/* Title */}
                        <h2 className="text-xl font-bold text-gray-200 mb-4">Your Next Event</h2>

                        {/* Next Event Content */}
                        <div
                            className="relative shadow-md rounded-lg p-6 flex flex-col justify-center items-center text-center text-white h-full"
                            style={{
                                backgroundImage: nextEventImage ? `url(${nextEventImage.url})` : "none",
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            }}
                        >
                            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg"></div>
                            <div className="relative z-10 flex flex-col items-center">
                                {/* Event Title */}
                                <h2 className="text-3xl font-bold mb-2">{nextEvent.eventTitle}</h2>

                                {/* Date (small) */}
                                <h3 className="text-base font-semibold mb-4">{new Date(nextEvent.eventDateTime).toDateString()}</h3> {/* Smaller text for the date */}

                                {/* Countdown */}
                                <div className="flex justify-around w-full font-bold text-base mb-4 space-x-6"> {/* Smaller countdown */}
                                    <div className="flex flex-col items-center shadow-lg">
                                        <div className="text-lg">{timeLeft.days || 0}</div> {/* Smaller numbers */}
                                        <div className="text-sm text-gray-300">Days</div> {/* Smaller labels */}
                                    </div>
                                    <div className="flex flex-col items-center shadow-lg">
                                        <div className="text-lg">{timeLeft.hours || 0}</div> {/* Smaller numbers */}
                                        <div className="text-sm text-gray-300">Hours</div> {/* Smaller labels */}
                                    </div>
                                    <div className="flex flex-col items-center shadow-lg">
                                        <div className="text-lg">{timeLeft.minutes || 0}</div> {/* Smaller numbers */}
                                        <div className="text-sm text-gray-300">Minutes</div> {/* Smaller labels */}
                                    </div>
                                    <div className="flex flex-col items-center shadow-lg">
                                        <div className="text-lg">{timeLeft.seconds || 0}</div> {/* Smaller numbers */}
                                        <div className="text-sm text-gray-300">Seconds</div> {/* Smaller labels */}
                                    </div>
                                </div>

                                {/* View Event Details Button */}
                                <button
                                    className="bg-blue-600 hover:bg-blue-800 px-4 py-2 rounded text-lg text-white font-bold shadow-lg"
                                    onClick={() => navigate(`/eventPage/${nextEvent.eventId}`)}>
                                    View Event Details
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Explore & Manage Section */}
            <ExploreManage /> {/* Use the new component */}
        </div>
    );
};

export default UserProfileContent;
