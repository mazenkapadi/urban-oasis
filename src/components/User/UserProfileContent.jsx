import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from "../../firebaseConfig.js";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import ExploreManage from './ExploreManage';

const UserProfileContent = () => {
    const [ name, setName ] = useState('');
    const [ phone, setPhone ] = useState('');
    const [ email, setEmail ] = useState('');
    const [ userId, setUserId ] = useState(null);
    const [ profilePic, setProfilePic ] = useState('');
    const [ nextEvent, setNextEvent ] = useState(null);
    const [ nextEventImage, setNextEventImage ] = useState('');
    const [ timeLeft, setTimeLeft ] = useState({});
    const navigate = useNavigate();

    // Function to handle profile edit navigation
    const handleEditProfile = () => navigate('/userProfilePage/contact-info');

    // Function to get user initials
    const getInitials = (name) => {
        const nameParts = name.split(' ');
        return nameParts.map(part => part[0]).join('').toUpperCase();
    };

    // Effect to listen for authentication state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUserId(user.uid);
                setEmail(user.email);
                await fetchUserData(user.uid);
                await fetchUserRSVPs(user.uid);
            }
        });
        return () => unsubscribe();
    }, []);

    // Function to fetch user data from Firestore
    const fetchUserData = async (userId) => {
        try {
            const userDoc = await getDoc(doc(db, 'Users', userId));
            if (userDoc.exists()) {
                const data = userDoc.data();
                setName(`${data.name?.firstName || ''} ${data.name?.lastName || ''}`);
                setPhone(data.contact?.cellPhone || 'Phone number not available');

                // Check profile picture: uploaded picture, Google profile picture, or initials
                const profilePicture = data.profilePic || auth.currentUser?.photoURL || '';
                setProfilePic(profilePicture);
            } else {
                // Default to Google profile picture if no document exists
                setProfilePic(auth.currentUser?.photoURL || '');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    // Function to fetch user RSVPs
    const fetchUserRSVPs = async (userId) => {
        try {
            const rsvpDoc = await getDoc(doc(db, 'UserRSVPs', userId));
            if (rsvpDoc.exists()) {
                const rsvpData = rsvpDoc.data().rsvps || {};
                const upcomingEvents = Object.values(rsvpData)
                                             .filter((event) => new Date(event.eventDateTime) > new Date())
                                             .sort((a, b) => new Date(a.eventDateTime) - new Date(b.eventDateTime));
                if (upcomingEvents.length > 0) {
                    const nextEvent = upcomingEvents[0];
                    setNextEvent(nextEvent);
                    await fetchEventImage(nextEvent.eventId);
                }
            } else {
                console.log('No RSVPs found for this user.');
            }
        } catch (error) {
            console.error('Error fetching RSVP data:', error);
        }
    };

    // Function to fetch the event image
    const fetchEventImage = async (eventId) => {
        try {
            const eventDoc = await getDoc(doc(db, 'Events', eventId));
            if (eventDoc.exists()) {
                const eventData = eventDoc.data();
                const imageUrl = eventData.eventDetails?.images?.[0]?.url || '';
                setNextEventImage(imageUrl);
            } else {
                console.log("Event document not found for eventId:", eventId);
            }
        } catch (error) {
            console.error('Error fetching event image:', error);
        }
    };

    // Effect to calculate time left for the next event
    useEffect(() => {
        const calculateTimeLeft = () => {
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
    }, [ nextEvent ]);

    // JSX for UserProfileContent component
    return (
        <div className="w-full" >
            <div className="mb-6" >
                <h1 className="text-h2 font-bold text-white" >My Dashboard</h1 >
                <p className="text-secondary-light-2" >Welcome back, {name.split(' ')[0] || 'User'}</p >
            </div >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" >
                <div className="bg-secondary-dark-1 shadow-md rounded-lg p-6 col-span-1 flex flex-col items-center h-full" >
                    <div className="w-24 h-24 rounded-full bg-gray-500 flex items-center justify-center" >
                        {profilePic ? (
                            <img
                                src={profilePic}
                                alt="User Profile"
                                className="rounded-full w-24 h-24 object-cover"
                            />
                        ) : (
                            <span className="text-white font-bold text-2xl" >
                                {getInitials(name || 'User Name')}
                            </span >
                        )}
                    </div >
                    <h2 className="text-xl font-lalezar my-2 text-white" >{name || 'Your Name'}</h2 >
                    <p className=" text-secondary-light-3" >{phone}</p >
                    <p className="text-secondary-light-3" >{email}</p >
                    <button
                        onClick={handleEditProfile}
                        className="mt-4 w-full bg-accent-orange text-white font-bold py-2 rounded-md hover:bg-blue-600 transition"
                    >
                        Edit Profile
                    </button >
                </div >
                {nextEvent && (
                    <div className="lg:col-span-2 flex flex-col justify-between" >
                        <h2 className="text-xl font-bold text-gray-200 mb-4" >Your Next Event</h2 >
                        <div
                            className="relative shadow-md rounded-lg p-6 flex flex-col justify-center items-center text-center text-white h-full"
                            style={{
                                backgroundImage: nextEventImage ? `url(${nextEventImage})` : "none",
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                        >
                            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg" ></div >
                            <div className="relative z-10 flex flex-col items-center" >
                                <h2 className="text-3xl font-bold mb-2" >{nextEvent.eventTitle}</h2 >
                                <h3 className="text-base font-semibold mb-4" >{new Date(nextEvent.eventDateTime).toDateString()}</h3 >
                                <div className="flex justify-around w-full font-bold text-base mb-4 space-x-6" >
                                    <div className="flex flex-col items-center" >
                                        <div >{timeLeft.days || 0}</div >
                                        <div className="text-sm" >Days</div >
                                    </div >
                                    <div className="flex flex-col items-center" >
                                        <div >{timeLeft.hours || 0}</div >
                                        <div className="text-sm" >Hours</div >
                                    </div >
                                    <div className="flex flex-col items-center" >
                                        <div >{timeLeft.minutes || 0}</div >
                                        <div className="text-sm" >Minutes</div >
                                    </div >
                                    <div className="flex flex-col items-center" >
                                        <div >{timeLeft.seconds || 0}</div >
                                        <div className="text-sm" >Seconds</div >
                                    </div >
                                </div >
                                <button
                                    onClick={() => navigate(`/eventPage/${nextEvent.eventId}`)}
                                    className="bg-blue-600 hover:bg-blue-800 px-4 py-2 rounded text-white"
                                >
                                    View Event Details
                                </button >
                            </div >
                        </div >
                    </div >
                )}
            </div >
            <ExploreManage />
        </div >
    );
};

export default UserProfileContent;
