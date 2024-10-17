import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import PhotoCarousel from "../components/PhotoCarousel.jsx";
import { CalendarDaysIcon, MapPinIcon, TicketIcon, PlusIcon, MinusIcon } from "@heroicons/react/20/solid";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { db, auth } from "../firebaseConfig.js";
import HeaderComponent from "../components/HeaderComponent.jsx";
import FooterComponent from "../components/FooterComponent.jsx";
import LoadingPage from "./LoadingPage.jsx"
import { Button, Modal } from "@mui/material";


const EventPage = () => {
    const [ quantity, setQuantity ] = useState(1);
    const {eventId} = useParams();
    const [ eventTitle, setEventTitle ] = useState('');
    const [ eventDescription, setEventDescription ] = useState('');
    const [ eventLocation, setEventLocation ] = useState('');
    const [ eventDateTime, setEventDateTime ] = useState('');
    const [ eventPrice, setEventPrice ] = useState('');
    const [ eventRefundPolicy, setEventRefundPolicy ] = useState('');
    const [ isPaidEvent, setIsPaidEvent ] = useState(false);
    const [ userId, setUserId ] = useState(null);
    const [ name, setName ] = useState('');
    const [ phone, setPhone ] = useState('');
    const [ email, setEmail ] = useState('');
    const [ eventImages, setEventImages ] = useState([]);
    const [ loading, setLoading ] = useState(true);
    const [ modalOpen, setModalOpen ] = useState(false);

    const [ hostDetails, setHostDetails ] = useState({
        bio: '',
        profilePicture: '',
        companyName: '',
        companyBio: '',
        website: '',
        logo: '',
        hostLocation: {
            line1: '',
            line2: '',
            city: '',
            state: '',
            zip: ''
        },
        ratings: {
            overall: 0,
            reviews: []
        }
    });

    const handleIncrement = () => {
        if (isPaidEvent || (quantity < 10)) {
            setQuantity(quantity + 1);
        }
    };

    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const handleRSVP = async () => {
        if (!userId) {
            console.error("User ID is undefined. Cannot proceed with RSVP.");
            return;
        }

        const totalAttendees = isPaidEvent ? quantity : Math.min(quantity, 10);
        const rsvpData = {
            userId: userId,
            name: name,
            email: email,
            phone: phone,
            quantity: totalAttendees,
            eventTitle: eventTitle,
            eventDateTime: eventDateTime,
            createdAt: new Date().toISOString(),
        };

        const eventRsvpsDocRef = doc(db, 'EventRSVPs', eventId);
        const eventDocRef = doc(db, 'Events', eventId);  // Reference to the Events collection

        try {
            // Fetch event details to get current attendees count and capacity
            const eventDocSnap = await getDoc(eventDocRef);
            if (!eventDocSnap.exists()) {
                console.error("Event not found");
                return;
            }

            const eventData = eventDocSnap.data();
            const {attendeesCount = 0, capacity = Infinity} = eventData; // Assume unlimited if capacity is not defined

            // Check if adding this RSVP exceeds the event's capacity
            if (attendeesCount + totalAttendees > capacity) {
                console.error("RSVP quantity exceeds event capacity");
                alert(`This event only has ${capacity - attendeesCount} spots left.`);
                return;
            }

            const rsvpsDocSnap = await getDoc(eventRsvpsDocRef);

            if (rsvpsDocSnap.exists()) {
                // Update RSVP data for the user
                await updateDoc(eventRsvpsDocRef, {
                    [`rsvps.${userId}`]: rsvpData,
                });
                console.log("RSVP updated for event!", rsvpData);
            } else {
                // Create a new RSVP document for the event
                await setDoc(eventRsvpsDocRef, {
                    eventId: eventId,
                    rsvps: {
                        [userId]: rsvpData,
                    },
                });
                console.log("RSVP created for event!", rsvpData);
            }

            // Calculate total number of RSVPs
            const updatedDocSnap = await getDoc(eventRsvpsDocRef);
            const rsvps = updatedDocSnap.data().rsvps || {};
            const totalRSVPs = Object.values(rsvps).reduce((acc, rsvp) => acc + rsvp.quantity, 0);

            // Update the attendeesCount in the Events collection
            await updateDoc(eventDocRef, {
                attendeesCount: totalRSVPs,
            });
            console.log("Total attendees count updated:", totalRSVPs);
            setModalOpen(true);
        } catch (error) {
            console.error("Error adding/updating RSVP: ", error);
        }
    };

    const handleCheckout = async () => {
        console.log("Processing on Stripe");
    }

    const handleModalClose = () => {
        setModalOpen(false);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
                setEmail(user.email);
            } else {
                console.log('No user logged in');
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchEventData = async () => {
            if (eventId) {
                const docRef = doc(db, 'Events', eventId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setEventTitle(data.basicInfo.title);
                    setEventDateTime(data.eventDetails.eventDateTime.toDate().toLocaleDateString());
                    setIsPaidEvent(data.eventDetails.paidEvent);
                    setEventPrice(data.eventDetails.eventPrice === 0 ? "Free" : data.eventDetails.eventPrice);
                    setEventLocation(data.basicInfo.location.label);
                    setEventDescription(data.basicInfo.description);
                    setEventRefundPolicy(data.policies.refundPolicy);

                    if (data.hostId) {
                        const hostDocRef = doc(db, 'Users', data.hostId);
                        const hostDocSnap = await getDoc(hostDocRef);
                        if (hostDocSnap.exists()) {
                            const hostData = hostDocSnap.data();
                            setHostDetails({
                                bio: hostData.bio || '',
                                profilePicture: hostData.profilePicture || '',
                                companyName: hostData.companyName || '',
                                companyBio: hostData.companyBio || '',
                                website: hostData.website || '',
                                logo: hostData.logo || '',
                                hostLocation: hostData.hostLocation || {
                                    line1: '',
                                    line2: '',
                                    city: '',
                                    state: '',
                                    zip: ''
                                },
                                ratings: hostData.ratings || {
                                    overall: 0,
                                    reviews: []
                                },
                                name: `${hostData.name?.firstName || ''} ${hostData.name?.lastName || ''}`,
                                email: hostData.contact?.email || 'Email not found'
                            });
                        } else {
                            console.log('Host data not found!');
                        }
                    }

                    if (data.eventDetails.images) {
                        const imageUrls = await Promise.all(data.eventDetails.images.map(imageUrl => imageUrl));
                        setEventImages(imageUrls);
                    }
                } else {
                    console.log('No such document!');
                }

                setLoading(false);
            }
        };

        fetchEventData();
    }, [ eventId ]);

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
                        setPhone(data.contact?.cellPhone || 'Phone number not found');
                        setEmail(data.contact?.email || email || 'Email not found');
                    } else {
                        console.log('No such document!');
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            }
        };

        fetchUserData();
    }, [ userId, email ]);

    if (loading) {
        return <LoadingPage />;
    }
    return (
        <>
            <div className="event-page" >
                <div
                    className="flex justify-center items-center py-10 px-4 pt-32 bg-gradient-to-r from-blue-500 via-blue-800 to-blue-600 min-h-screen" >
                    <HeaderComponent />
                    <div className="box-border rounded-lg bg-gray-900 p-8 pt-24 flex flex-col w-10/12 h-fit shadow-lg" >
                        <PhotoCarousel eventId={eventId} eventTitle={eventTitle} />

                        <div className="flex flex-row mt-6" >
                            <div className="flex content w-full flex-col gap-8" >
                                <div className="flex flex-col pt-4 space-y-6" >
                                    <div className="flex items-center space-x-3" >
                                        <CalendarDaysIcon className="text-gray-300 w-6 h-6" />
                                        <label className="font-bold text-white opacity-80" >{eventDateTime}</label >
                                    </div >
                                    <label className="block text-gray-300 text-5xl font-semibold" >{eventTitle}</label >\
                                </div >
                                <div className="flex flex-col" >
                                    <h2 className="text-2xl text-white font-semibold" >Description</h2 >
                                    <p className="text-gray-300" >{eventDescription}</p >
                                </div >
                            </div >
                            <div className="flex flex-col p-6 w-1/4 h-fit gap-4 bg-gray-800 rounded-lg shadow-lg" >
                                <div className="flex space-x-4" >
                                    {/* Event Price Section */}
                                    <div
                                        className="flex justify-center items-center w-52 h-12 bg-gray-500 bg-opacity-30 border-4 border-gray-500 rounded-lg" >
                                        <TicketIcon className="text-gray-300 w-6 h-6" />
                                        <label
                                            className="font-bold text-white pl-3" >{isPaidEvent && '$'}{eventPrice}</label >
                                    </div >

                                    {/* Quantity Selector Section */}
                                    <div
                                        className="flex justify-center items-center w-36 h-12 gap-3 bg-gray-500 bg-opacity-30 border-4 border-gray-500 rounded-lg" >
                                        <button onClick={handleDecrement} disabled={quantity === 1}
                                                className="text-white" >
                                            <MinusIcon className="w-6 h-6" />
                                        </button >
                                        <span className="text-white font-bold text-lg" >{quantity}</span >
                                        <button onClick={handleIncrement} className="text-white" >
                                            <PlusIcon className="w-6 h-6" />
                                        </button >
                                    </div >
                                </div >

                                {/* RSVP Button */}
                                <div
                                    className="flex justify-center items-center w-full h-12 bg-gray-700 hover:bg-gray-500 transition duration-300 ease-in-out border-4 border-gray-500 rounded-lg" >
                                    <button
                                        className="flex items-center text-white font-bold py-2 px-4 rounded focus:outline-none"
                                        onClick={isPaidEvent ? handleCheckout : handleRSVP} >
                                        <ShoppingCartIcon className="text-gray-300 w-6 h-6 mr-2" />
                                        <span >{isPaidEvent ? 'Checkout' : 'RSVP'}</span >
                                    </button >
                                </div >

                                {/* Event Location Section */}
                                <div className="flex flex-row gap-6 items-center" >
                                    <MapPinIcon className="text-gray-300 w-6 h-6" />
                                    <label className="font-bold text-white opacity-80" >{eventLocation}</label >
                                </div >

                                {/* Host Details Section */}
                                <div
                                    className="flex flex-col justify-center items-center w-full h-auto bg-gray-700 border-4 border-gray-500 rounded-lg p-4" >
                                    <h3 className="text-white font-bold mb-2" >Hosted by,</h3 >

                                    {hostDetails && (
                                        <div className="flex flex-col items-center space-y-2" >

                                            <h3 className="text-lg text-white font-semibold" >{hostDetails.companyName || hostDetails.name}</h3 >
                                            {/*<p className="text-gray-300" >{hostDetails.email}</p >*/}
                                            <button className="" >
                                                Host Chat
                                            </button >
                                        </div >
                                    )}
                                </div >
                            </div >
                        </div >
                    </div >
                </div >

                <Modal
                    open={modalOpen}
                    onClose={handleModalClose}
                >
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 bg-neutral-white rounded-lg shadow-lg p-8">
                        <h2 className="text-h3 font-semibold text-neutral-black mb-4 text-center font-archivo">
                            Event Created!
                        </h2>
                        <p className="text-body text-detail-gray text-center mb-6 font-inter">
                            Your event has been successfully created.
                        </p>
                        <Button
                            onClick={handleModalClose}
                            variant="contained"
                            color="primary"
                            className="mt-4 w-full bg-accent-blue hover:bg-primary-dark text-neutral-white py-2 rounded-lg font-medium"
                        >
                            Close
                        </Button>
                    </div>
                </Modal>

                <FooterComponent />
            </div >
        </>
    );
};

export default EventPage;