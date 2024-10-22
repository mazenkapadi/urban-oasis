import React, { useState, useEffect } from 'react';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from "../firebaseConfig.js";
import { useNavigate } from "react-router-dom";
import SideBar from "../components/User/SideBar.jsx";
import { PlusIcon } from "@heroicons/react/20/solid";
import HostEventCard from '../components/HostEventCard';
import { onAuthStateChanged } from "firebase/auth";
import LoadingPage from "./LoadingPage";
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import StarIcon from "@mui/icons-material/Star";
import {Rating} from "@mui/material";

ChartJS.register(ArcElement, Tooltip, Legend);

const HostDashboard = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [hostType, setHostType] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [bio, setBio] = useState('');
    const [profilePicture, setProfilePicture] = useState('');
    const [hostedEvents, setHostedEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [ rating, setRating] = useState(0);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                await fetchHostData(user.uid);
            } else {
                navigate('/login'); // Change to your login route
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    const fetchHostData = async (uid) => {
        try {
            setIsLoading(true);
            const docRef = doc(db, 'Users', uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                setName(`${data.firstName || ''} ${data.lastName || ''}`);
                setEmail(data.email || '');
                setHostType(data.hostType || '');
                setCompanyName(data.companyName || '');
                setBio(data.bio || '');
                setProfilePicture(data.profilePicture || 'https://via.placeholder.com/150');
                setRating(data.ratings.overall)

                if (!data.isHost) {
                    navigate('/hostSignUp');
                    return;
                }

                await fetchHostedEvents(uid);
            } else {
                setError("No host profile found.");
            }
        } catch (err) {
            console.error('Error fetching host data:', err);
            setError('An error occurred while fetching host data.');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchHostedEvents = async (hostId) => {
        try {
            const eventsRef = collection(db, 'Events');
            const q = query(eventsRef, where('hostId', '==', hostId));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const events = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setHostedEvents(events);
            }
        } catch (err) {
            console.error('Error fetching hosted events:', err);
            setError('An error occurred while fetching hosted events.');
        }
    };

    const handleEventClick = (eventId) => {
        navigate(`/hostEventPage/${eventId}`); // Assuming you have a detailed Event page
    };

    const currentDateTime = new Date();

    // Combine past and future events with a status tag
    const allEvents = hostedEvents.map(event => {
        const eventDate = event.eventDetails.eventDateTime.toDate();
        return {
            ...event,
            status: eventDate > currentDateTime ? 'Future' : 'Past'
        };
    });

    const futureEvents = allEvents.filter(event => event.status === 'Future').slice(0, 2); // Get only 2 future events
    const pastEvents = allEvents.filter(event => event.status === 'Past').slice(0, 1); // Get only 1 past event

    const displayedEvents = [...futureEvents, ...pastEvents]; // Combine future and past events

    // Calculate statistics
    const totalFutureEvents = futureEvents.length;
    const totalPastEvents = pastEvents.length;
    const totalAttendees = hostedEvents.reduce((acc, event) => acc + (event.attendeesCount || 0), 0);
    const totalCapacity = hostedEvents.reduce((acc, event) => acc + (event.capacity || 0), 0);

    if (isLoading) {
        return <LoadingPage />; // Render the LoadingPage component
    }

    if (error) {
        return <div>{error}</div>;
    }

    // Data for Pie Chart
    const participationData = {
        labels: ['Attended', 'Remaining Capacity'],
        datasets: [
            {
                data: [totalAttendees, totalCapacity - totalAttendees],
                backgroundColor: ['#4CAF50', '#FFC107'],
                hoverBackgroundColor: ['#45a049', '#ffca28'],
            }
        ]
    };

    const eventStatusData = {
        labels: ['Future Events', 'Past Events'],
        datasets: [
            {
                data: [totalFutureEvents, totalPastEvents],
                backgroundColor: ['#2196F3', '#F44336'],
                hoverBackgroundColor: ['#1976D2', '#D32F2F'],
            }
        ]
    };

    // Function to render a gray pie chart
    const renderGrayPie = () => ({
        labels: ['No Data'],
        datasets: [
            {
                data: [1],
                backgroundColor: ['#B0BEC5'], // Gray color for no data
                hoverBackgroundColor: ['#9E9E9E'],
            }
        ]
    });

    return (
        <div className="bg-gray-100 min-h-screen flex justify-start p-0">
            <div className="w-1/6 bg-gray-900 sticky top-0 h-screen rounded-lg">
                <SideBar />
            </div>
            <div className="flex-grow p-8">
                <div className="bg-gray-900 text-white shadow-md rounded-lg p-6 h-full min-h-screen">
                    <div className="w-full">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h1 className="text-3xl font-bold text-white">Host Dashboard</h1>
                                <p className="text-gray-300">Welcome back, {name.split(' ')[0] || 'User'}</p>
                            </div>
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center">
                                    <button
                                        className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300"
                                        onClick={() => navigate('/EventCreation')}
                                    >
                                        <p className="mr-2">Create an Event</p>
                                        <PlusIcon className="h-6 w-6" />
                                    </button>
                                    <button
                                        className="ml-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                                        onClick={() => navigate('/')}
                                    >
                                        View All Events
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="bg-white shadow-md rounded-lg p-6 col-span-1 flex flex-col items-center">
                                <img
                                    src={profilePicture}
                                    alt="Host Profile"
                                    className="rounded-full w-24 h-24 object-cover mb-4"
                                />
                                <h2 className="text-xl font-semibold mb-2 text-gray-900">{name}</h2>
                                <p className="text-gray-700">{email}</p>
                                <p className="text-gray-700">{hostType === 'company' ? companyName : 'Individual Host'}</p>
                                <p className="text-gray-700 text-center">{bio}</p>
                                <Rating
                                    name="read-only"
                                    value={rating}
                                    readOnly
                                    precision={0.2}
                                />
                                <button
                                    onClick={() => navigate('/userProfilePage')}
                                    className="mt-4 w-full bg-blue-800 text-white font-bold py-2 rounded-md hover:bg-blue-600 transition"
                                >
                                    Edit Profile
                                </button>
                            </div>

                            <div className="lg:col-span-2 space-y-6">
                                <div className="bg-white shadow-md rounded-lg p-6">
                                    <h2 className="text-lg font-semibold mb-4 text-gray-900">Your Events</h2>
                                    {displayedEvents.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {displayedEvents.map(event => (
                                                <div key={event.id} onClick={() => handleEventClick(event.id)} className="cursor-pointer">
                                                    <HostEventCard event={event} status={event.status} />
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-center text-gray-700">No events found.</p>
                                    )}
                                </div>

                                {/* Statistics Section */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-white shadow-md rounded-lg p-6">
                                        <h2 className="text-lg font-semibold mb-4 text-gray-900">Participation Rate</h2>
                                        <div className="flex justify-center">
                                            {totalCapacity > 0 ? (
                                                <Pie data={participationData} />
                                            ) : (
                                                <Pie data={renderGrayPie()} />
                                            )}
                                        </div>
                                    </div>

                                    <div className="bg-white shadow-md rounded-lg p-6">
                                        <h2 className="text-lg font-semibold mb-4 text-gray-900">Event Status</h2>
                                        <div className="flex justify-center">
                                            {totalFutureEvents > 0 || totalPastEvents > 0 ? (
                                                <Pie data={eventStatusData} />
                                            ) : (
                                                <Pie data={renderGrayPie()} />
                                            )}
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HostDashboard;
