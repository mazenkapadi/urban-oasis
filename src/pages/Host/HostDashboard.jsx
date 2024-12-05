import React, { useState, useEffect } from 'react';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from "../../firebaseConfig.js";
import { useNavigate } from "react-router-dom";
import SideBar from "../../components/User/SideBar.jsx";
import { PlusIcon } from "@heroicons/react/20/solid";
import HostEventCard from '../../components/EventCards/HostEventCard.jsx';
import { onAuthStateChanged } from "firebase/auth";
import LoadingPage from "../service/LoadingPage.jsx";
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Rating } from "@mui/material";
import themeManager from "../../utils/themeManager.jsx";
import StarBorderPurple500SharpIcon from "@mui/icons-material/StarBorderPurple500Sharp";
import resolveConfig from "tailwindcss/resolveConfig.js";
import tailwindConfig from "../../../tailwind.config.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const HostDashboard = () => {
    const fullConfig = resolveConfig(tailwindConfig);
    const colors = fullConfig.theme.colors;
    const [ name, setName ] = useState('');
    const [ email, setEmail ] = useState('');
    const [ hostType, setHostType ] = useState('');
    const [ companyName, setCompanyName ] = useState('');
    const [ bio, setBio ] = useState('');
    const [ profilePicture, setProfilePicture ] = useState('');
    const [ hostedEvents, setHostedEvents ] = useState([]);
    const [ isLoading, setIsLoading ] = useState(true);
    const [ error, setError ] = useState(null);
    const [ rating, setRating ] = useState(0);
    const [ userId, setUserId ] = useState(null);
    const [ darkMode, setDarkMode ] = useState(themeManager.isDarkMode);
    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate(`/host/${userId}`);
    };

    useEffect(() => {
        const handleThemeChange = (isDark) => setDarkMode(isDark);
        themeManager.addListener(handleThemeChange);

        return () => {
            themeManager.removeListener(handleThemeChange);
        };
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                await fetchHostData(user.uid);
            } else {
                navigate('/login'); // Change to your login route
            }
        });

        return () => unsubscribe();
    }, [ navigate ]);

    const fetchHostData = async (uid) => {
        try {
            setIsLoading(true);
            const docRef = doc(db, 'Users', uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                setName(`${data.name.firstName || ''} ${data.name.lastName || ''}`);
                setEmail(data.email || '');
                setHostType(data.hostType || '');
                setCompanyName(data.companyName || '');
                setBio(data.bio || '');
                setProfilePicture(data.profilePicture || 'https://via.placeholder.com/150');
                setRating(data.ratings.overall);
                setUserId(data.uid);

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
            setIsLoading(true);
            const eventsRef = collection(db, 'Events');
            const q = query(eventsRef, where('hostId', '==', hostId));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const events = await Promise.all(
                    querySnapshot.docs.map(async (eventDoc) => {
                        const eventData = eventDoc.data();
                        const eventId = eventDoc.id;

                        // Fetch attendeesCount from EventRSVPs
                        const eventRsvpsDocRef = doc(db, 'EventRSVPs', eventId);
                        const eventRsvpsSnap = await getDoc(eventRsvpsDocRef);
                        let attendeesCount = 0;
                        if (eventRsvpsSnap.exists()) {
                            const eventRsvps = eventRsvpsSnap.data().rsvps || {};
                            attendeesCount = Object.values(eventRsvps).reduce(
                                (acc, rsvp) => acc + (rsvp.quantity || 0),
                                0
                            );
                        }

                        return {
                            id: eventId,
                            ...eventData,
                            attendeesCount: attendeesCount,
                        };
                    })
                );
                setHostedEvents(events);
            }
        } catch (err) {
            console.error('Error fetching hosted events:', err);
            setError('An error occurred while fetching hosted events.');
        } finally {
            setIsLoading(false);
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

    const displayedEvents = [ ...futureEvents, ...pastEvents ]; // Combine future and past events

    // Calculate statistics
    const totalFutureEvents = futureEvents.length;
    const totalPastEvents = pastEvents.length;
    const totalAttendees = hostedEvents.reduce((acc, event) => acc + (event.attendeesCount || 0), 0);
    const totalCapacity = hostedEvents.reduce((acc, event) => acc + (event.eventDetails.capacity || 0), 0);


    if (isLoading) {
        return <LoadingPage />; // Render the LoadingPage component
    }

    if (error) {
        return <div >{error}</div >;
    }

    // Data for Pie Chart
    const participationData = {
        labels: [ 'Attended', 'Remaining Capacity' ],
        datasets: [
            {
                data: [ totalAttendees, totalCapacity - totalAttendees ],
                backgroundColor: [ '#EE703C', '#EB2032' ],
                hoverBackgroundColor: [ '#EE702D', '#EB2043' ],
            }
        ]
    };

    const eventStatusData = {
        labels: [ 'Future Events', 'Past Events' ],
        datasets: [
            {
                data: [ totalFutureEvents, totalPastEvents ],
                backgroundColor: [ '#0056FF', '#8B5CF6' ],
                hoverBackgroundColor: [ '#0056D5', '#8B5CD5' ],
            }
        ]
    };

    const renderGrayPie = () => ({
        labels: [ 'No Data' ],
        datasets: [
            {
                data: [ 1 ],
                backgroundColor: [ '#171A1C' ], // Gray color for no data
                hoverBackgroundColor: [ '#171A2D' ],
            }
        ]
    });

    return (
        <div className={`${darkMode ? "bg-primary-dark" : "bg-primary-light"} min-h-screen flex justify-start p-0`} >
            <div className="w-1/6 sticky top-0 h-screen rounded-lg" >
                <SideBar />
            </div >
            <div className="flex-grow p-8" >
                <div className={`${darkMode ? "bg-Dark-D2 text-primary-light" : "bg-Light-L2 text-primary-dark"} shadow-md rounded-lg p-6 h-full min-h-screen`} >
                    <div className="w-full" >
                        <div className="flex justify-between items-center mb-6" >
                            <div >
                                <h1 className={`text-3xl font-bold ${darkMode ? "text-primary-light" : "text-primary-dark"}`} >Host Dashboard</h1 >
                                <p className={`${darkMode ? "text-Light-L2" : "text-Dark-D2"}`} >Welcome back, {name.split(' ')[0] || 'User'}</p >
                            </div >
                            <div className="flex justify-between items-center mb-6" >
                                <div className="flex items-center" >
                                    <button
                                        className="flex items-center bg-accent-blue text-primary-light px-4 py-2 rounded hover:bg-blue-800 transition-colors duration-300"
                                        onClick={() => navigate('/EventCreation')}
                                    >
                                        <p className="mr-2" >Create an Event</p >
                                        <PlusIcon className="h-6 w-6" />
                                    </button >
                                    <button
                                        className="ml-4 bg-accent-blue text-primary-light px-4 py-2 rounded hover:bg-blue-800 transition"
                                        onClick={() => navigate('/')}
                                    >
                                        View All Events
                                    </button >
                                </div >
                            </div >
                        </div >

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" >
                            <div className={`${darkMode ? "bg-Dark-D1" : "bg-Light-L1"} shadow-md rounded-lg p-6 col-span-1 flex flex-col items-center`} >
                                <img
                                    src={profilePicture}
                                    alt="Host Profile"
                                    className="rounded-full w-24 h-24 object-cover mb-4"
                                />
                                <h2 onClick={handleNavigate} className={`text-xl font-semibold mb-2 ${darkMode ? "text-primary-light" : "text-primary-dark"}`} >{name}</h2 >
                                <p onClick={handleNavigate} className={`${darkMode ? "text-Light-L1" : "text-Dark-D1"}`} >{email}</p >
                                <p onClick={handleNavigate} className={`${darkMode ? "text-Light-L1" : "text-Dark-D1"}`} >{hostType === 'company' ? companyName : 'Individual Host'}</p >
                                <p onClick={handleNavigate} className={`${darkMode ? "text-Light-L1" : "text-Dark-D1"} text-center`} >{bio}</p >
                                <Rating
                                    name="read-only"
                                    value={rating}
                                    readOnly
                                    emptyIcon={<StarBorderPurple500SharpIcon
                                        sx={{
                                            color: darkMode ? colors["primary-light"] : colors["primary-dark"],
                                        }} />}
                                    precision={0.1}
                                />
                                <button
                                    onClick={() => navigate('/userProfilePage/contact-info')}
                                    className="mt-4 w-full bg-blue-800 text-white font-bold py-2 rounded-md hover:bg-blue-600 transition"
                                >
                                    Edit Profile
                                </button >
                            </div >

                            <div className="lg:col-span-2 space-y-6" >
                                <div className={`${darkMode ? "bg-Dark-D1" : "bg-Light-L1"} shadow-md rounded-lg p-6`} >
                                    <h2 className={`text-xl font-semibold mb-4 ${darkMode ? "text-primary-light" : "text-primary-dark"}`} >Your Events</h2 >
                                    {displayedEvents.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" >
                                            {displayedEvents.map(event => (
                                                <div key={event.id} onClick={() => handleEventClick(event.id)}
                                                     className="cursor-pointer" >
                                                    <HostEventCard event={event} status={event.status} />
                                                </div >
                                            ))}
                                        </div >
                                    ) : (
                                        <p className="text-center text-gray-700" >No events found.</p >
                                    )}
                                </div >

                                {/* Statistics Section */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6" >
                                    <div className={`${darkMode ? "bg-Dark-D1" : "bg-Light-L1"} shadow-md rounded-lg p-6`} >
                                        <h2 className={`text-xl font-semibold mb-4 ${darkMode ? "text-primary-light" : "text-primary-dark"}`} >Participation
                                            Rate</h2 >
                                        <div className="flex justify-center" >
                                            {totalCapacity > 0 ? (
                                                <Pie data={participationData} />
                                            ) : (
                                                <Pie data={renderGrayPie()} />
                                            )}
                                        </div >
                                    </div >

                                    <div className={`${darkMode ? "bg-Dark-D1" : "bg-Light-L1"} shadow-md rounded-lg p-6`} >
                                        <h2 className={`text-xl font-semibold mb-4 ${darkMode ? "text-primary-light" : "text-primary-dark"}`} >Event Status</h2 >
                                        <div className="flex justify-center" >
                                            {totalFutureEvents > 0 || totalPastEvents > 0 ? (
                                                <Pie data={eventStatusData} />
                                            ) : (
                                                <Pie data={renderGrayPie()} />
                                            )}
                                        </div >

                                    </div >
                                </div >
                            </div >
                        </div >
                    </div >
                </div >
            </div >
        </div >
    );
};

export default HostDashboard;
