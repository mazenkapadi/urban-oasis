import React, { useState, useEffect } from 'react';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
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
    const [nextEvent, setNextEvent] = useState(null); // Store the next event
    const [timeRemaining, setTimeRemaining] = useState({ days: 0, hours: 0, minutes: 0 });
    const navigate = useNavigate();

    const handleEditProfile = () => {
        navigate('/userProfilePage/contact-info');
    };

    // Fetch authenticated user
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

    // Fetch user data and RSVP-ed events
    useEffect(() => {
        const fetchUserData = async () => {
            if (userId) {
                try {
                    const docRef = doc(db, 'Users', userId);
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        setName(`${data.name?.firstName || ''} ${data.name?.lastName || ''}`);
                        const formattedPhone = formatPhoneNumber(data.contact?.cellPhone);
                        setPhone(formattedPhone);
                        setEmail(data.contact?.email || email || 'Email not found');

                        // Fetch the user's RSVPs
                        await fetchUserRSVPs();
                    } else {
                        console.log('No such document!');
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            }
        };

        const fetchUserRSVPs = async () => {
            const userRSVPRef = collection(db, 'UserRSVPs');
            const q = query(userRSVPRef, where('userId', '==', userId));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const events = querySnapshot.docs.map(doc => doc.data());
                // Sort by event date and get the next upcoming event
                const sortedEvents = events.sort((a, b) => new Date(a.eventDateTime) - new Date(b.eventDateTime));
                const upcomingEvent = sortedEvents.find(event => new Date(event.eventDateTime) > new Date());

                if (upcomingEvent) {
                    setNextEvent(upcomingEvent);
                    initializeCountdown(new Date(upcomingEvent.eventDateTime));
                }
            }
        };

        if (userId) {
            fetchUserData();
        }
    }, [userId, email]);

    // Initialize countdown for the next event
    const initializeCountdown = (eventDate) => {
        const updateCountdown = () => {
            const now = new Date().getTime();
            const distance = eventDate.getTime() - now;

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

            setTimeRemaining({ days, hours, minutes });

            if (distance < 0) {
                clearInterval(interval);
            }
        };

        const interval = setInterval(updateCountdown, 60000); // Update every minute
        updateCountdown(); // Call immediately to set the initial value
    };

    return (
        <div className="w-full">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-white">My Dashboard</h1>
                <p className="text-gray-300">Welcome back, {name.split(' ')[0] || 'User'}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Section */}
                <div className="bg-gray-800 shadow-md rounded-lg p-6 col-span-1 flex flex-col items-center">
                    <img
                        src={profilePic}
                        alt="User Profile"
                        className="rounded-full w-24 h-24 object-cover mb-4"
                    />
                    <h2 className="text-xl font-semibold mb-2 text-white">{name || 'Your Name'}</h2>
                    <p className="text-gray-400">{phone}</p>
                    <p className="text-gray-400">{email || 'Email not available'}</p>
                    <button
                        onClick={handleEditProfile}
                        className="mt-4 w-full bg-blue-800 text-white font-bold py-2 rounded-md hover:bg-blue-600 transition">
                        Edit Profile
                    </button>
                </div>

                {/* Next Event Section */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-gray-800 shadow-md rounded-lg p-6">
                        {nextEvent ? (
                            <>
                                <h2 className="text-lg font-semibold mb-4 text-white">Your Next Event</h2>
                                <div className="flex justify-between items-center">
                                    {/* Event banner */}
                                    <img
                                        src={nextEvent.eventBanner || 'https://via.placeholder.com/400'}
                                        alt="Event Banner"
                                        className="w-1/3 rounded-lg shadow-md"
                                    />
                                    <div className="w-2/3 flex flex-col items-center">
                                        {/* Countdown Timer */}
                                        <div className="countdownTable flex flex-col items-center bg-gray-700 p-4 rounded-lg shadow-lg">
                                            <div className="countdownClock flex justify-center space-x-10">
                                                <div className="time-box flex flex-col items-center">
                                                    <div className="days text-5xl text-yellow-500">{timeRemaining.days}</div>
                                                    <span className="text-lg text-teal-600">Days</span>
                                                </div>
                                                <div className="time-box flex flex-col items-center">
                                                    <div className="hours text-5xl text-yellow-500">{timeRemaining.hours}</div>
                                                    <span className="text-lg text-teal-600">Hours</span>
                                                </div>
                                                <div className="time-box flex flex-col items-center">
                                                    <div className="minutes text-5xl text-yellow-500">{timeRemaining.minutes}</div>
                                                    <span className="text-lg text-teal-600">Minutes</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-4 text-white text-center">
                                            <p className="text-xl font-semibold">{nextEvent.eventTitle}</p>
                                            <p className="text-sm">{new Date(nextEvent.eventDateTime).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <p className="text-gray-500 text-center">No upcoming events</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfileContent;
