import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { arrayUnion, deleteField, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from "firebase/auth";
import PhotoCarousel from "../components/Carousels/PhotoCarousel.jsx";
import { CalendarDaysIcon, MapPinIcon, MinusIcon, PlusIcon, TicketIcon } from "@heroicons/react/20/solid";
import { ShoppingCartIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { auth, db } from "../firebaseConfig.js";
import HeaderComponent from "../components/HeaderComponent.jsx";
import FooterComponent from "../components/FooterComponent.jsx";
import LoadingPage from "./service/LoadingPage.jsx"
import { Button, Modal } from "@mui/material";
import { loadStripe } from "@stripe/stripe-js";
import { v4 as uuidv4 } from "uuid";
import ForecastComponent from "../components/ForecastComponent.jsx";
import ChatWindowComponent from "../components/ChatWindowComponent.jsx";
import { googleMapsConfig } from "../locationConfig.js";
import { useJsApiLoader } from '@react-google-maps/api';
import Tooltip from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';
import {
    EmailIcon,
    EmailShareButton,
    FacebookIcon,
    FacebookMessengerIcon,
    FacebookMessengerShareButton,
    FacebookShareButton,
    LinkedinIcon,
    LinkedinShareButton,
    RedditIcon,
    RedditShareButton,
    TwitterShareButton,
    WhatsappIcon,
    WhatsappShareButton,
    XIcon,
} from "react-share";
import GoogleMapComponent from "../components/GoogleMapComponent.jsx"


const EventPage = () => {
    const [ quantity, setQuantity ] = useState(1);
    const {eventId} = useParams();
    const [ eventTitle, setEventTitle ] = useState('');
    const [ eventDescription, setEventDescription ] = useState('');
    const [ eventLocation, setEventLocation ] = useState('');
    const [ eventCity, setEventCity ] = useState('');
    const [ eventDateTime, setEventDateTime ] = useState('');
    const [ eventPrice, setEventPrice ] = useState(0);
    const [ eventRefundPolicy, setEventRefundPolicy ] = useState('');
    const [ isPaidEvent, setIsPaidEvent ] = useState(false);
    const [ userId, setUserId ] = useState(null);
    const [ name, setName ] = useState('');
    const [ phone, setPhone ] = useState('');
    const [ email, setEmail ] = useState('');
    const [ eventImages, setEventImages ] = useState([]);
    const [ loading, setLoading ] = useState(true);
    const [ modalOpen, setModalOpen ] = useState(false);
    const [ profilePicture, setProfilePicture ] = useState('');
    const [ chatWindowOpen, setChatWindowOpen ] = useState(false);
    const [ eventPlaceId, setEventPlaceId ] = useState('');
    const [ eventLong, setEventLong ] = useState(0);
    const [ eventLat, setEventLat ] = useState(0);
    const [ hostName, setHostName ] = useState('');
    const [ eventCapacity, setEventCapacity ] = useState('');
    const [ eventAttendee, setEventAttendee ] = useState('');
    const [ userHasRSVPed, setUserHasRSVPed ] = useState(false);
    const [ userRSVPQuantity, setUserRSVPQuantity ] = useState(0);
    const [ availableTickets, setAvailableTickets ] = useState(0);
    const location = useLocation();
    const eventPageUrl = 'urban-oasis490.vercel.app' + location.pathname;


    const navigate = useNavigate();
    const rsvpId = uuidv4();


    const stripePromise = loadStripe(import.meta.env.VITE_PUBLIC_STRIPE_PUBLISHABLE_KEY);
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
        },
        hostId: ''
    });

    // const handleIncrement = () => {
    //     if (isPaidEvent || (quantity < 10)) {
    //         setQuantity(quantity + 1);
    //     }
    // };

    const handleIncrement = () => {
        const maxQuantity = isPaidEvent ? availableTickets : Math.min(availableTickets, 10);
        if (quantity < maxQuantity) {
            setQuantity(quantity + 1);
        } else {
            alert(`Only ${availableTickets} tickets are available.`);
        }
    };


    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const updateAttendeesCount = async (eventId, eventDocRef) => {
        const eventRsvpsDocRef = doc(db, 'EventRSVPs', eventId);
        const eventRsvpsSnap = await getDoc(eventRsvpsDocRef);

        if (!eventRsvpsSnap.exists()) {
            await updateDoc(eventDocRef, {attendeesCount: 0});
            return;
        }

        const eventRsvps = eventRsvpsSnap.data().rsvps || {};
        const totalRSVPs = Object.values(eventRsvps).reduce(
            (acc, rsvp) => acc + (rsvp.quantity || 0),
            0
        );

        await updateDoc(eventDocRef, {attendeesCount: totalRSVPs});
    };


    const findExistingRsvpId = async (collectionRef, userId, eventId) => {
        const snapshot = await getDoc(collectionRef);
        if (!snapshot.exists()) return null;

        const rsvps = snapshot.data().rsvps || {};
        for (const [ id, rsvp ] of Object.entries(rsvps)) {
            if (rsvp.userId === userId && rsvp.eventId === eventId) {
                return id;
            }
        }
        return null;
    };

    // Adjust the function signature to accept rsvpId as a parameter
    const saveOrUpdateRsvp = async (collectionRef, rsvpId, rsvpData, topLevelId, isEventRsvp = true) => {
        // if (rsvpId) {
        //     await updateDoc(collectionRef, {
        //         [`rsvps.${rsvpId}`]: rsvpData,
        //     });
        // } else {
        const newRsvpId = rsvpId || uuidv4(); // Use provided rsvpId or generate a new one
        const topLevelField = isEventRsvp ? {eventId: topLevelId} : {userId: topLevelId};

        await setDoc(collectionRef, {
            ...topLevelField,
            rsvps: {
                [newRsvpId]: {...rsvpData, rsvpId: newRsvpId},
            },
        }, {merge: true});
        // }
    };

    const handleRSVP = async () => {
        if (!userId) {
            console.error("User ID is undefined. Cannot proceed with RSVP.");
            return;
        }

        const totalAttendees = isPaidEvent ? quantity : Math.min(quantity, 10);
        const eventRsvpsDocRef = doc(db, 'EventRSVPs', eventId);
        const userRsvpsDocRef = doc(db, 'UserRSVPs', userId);
        const eventDocRef = doc(db, 'Events', eventId);
        const eventWaitlistDocRef = doc(db, 'EventWaitlist', eventId);

        const rsvpData = {
            userId,
            eventId,
            eventTitle,
            eventDateTime,
            name,
            email,
            phone,
            quantity: totalAttendees,
            createdAt: new Date().toISOString(),
        };

        try {
            const eventDocSnap = await getDoc(eventDocRef);
            if (!eventDocSnap.exists()) {
                console.error("Event not found");
                return;
            }

            const eventData = eventDocSnap.data();
            const eventCapacity = eventData.eventDetails.capacity || 0;
            const eventAttendee = eventData.attendeesCount || 0;
            const availableTickets = eventCapacity - eventAttendee;

            if (availableTickets <= 0) {
                await handleWaitlist(eventWaitlistDocRef, rsvpData); // Add to waitlist if at capacity
                return;
            }

            if (totalAttendees > availableTickets) {
                alert(`Only ${availableTickets} tickets are available. Please reduce your quantity.`);
                return;
            }

            const existingEventRsvpId = await findExistingRsvpId(eventRsvpsDocRef, userId, eventId);
            const existingUserRsvpId = await findExistingRsvpId(userRsvpsDocRef, userId, eventId);
            const rsvpId = existingEventRsvpId || existingUserRsvpId || uuidv4();

            await saveOrUpdateRsvp(eventRsvpsDocRef, rsvpId, rsvpData, eventId, true);
            await saveOrUpdateRsvp(userRsvpsDocRef, rsvpId, rsvpData, userId, false);
            await updateAttendeesCount(eventId, eventDocRef);

            console.log("RSVP successfully saved");

            setModalOpen(true);
            setUserHasRSVPed(true);
            setUserRSVPQuantity(totalAttendees);
            const qrResponse = await fetch('/api/sendQR-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    rsvpId,
                    userId,
                    eventId,
                    email,
                    phone,
                    quantity: totalAttendees,
                    eventTitle,
                    eventDateTime,
                }),
            });

            if (!qrResponse.ok) {
                console.error("Error sending QR code email");
                alert("RSVP registered, but the QR code email failed to send.");
            } else {
                console.log("QR code email sent successfully.");
            }

            setAvailableTickets(availableTickets - totalAttendees);
        } catch (error) {
            console.error("Error handling RSVP:", error);
        }
    };

    // const handleCheckout = async () => {
    //     console.log("Processing on Stripe...");
    //
    //     if (!userId) {
    //         console.error("User ID is undefined. Cannot proceed with checkout.");
    //         return;
    //     }
    //
    //     const eventRsvpsDocRef = doc(db, 'EventRSVPs', eventId);
    //     const userRsvpsDocRef = doc(db, 'UserRSVPs', userId);
    //     const eventDocRef = doc(db, 'Events', eventId);
    //     const eventWaitlistDocRef = doc(db, 'EventWaitlist', eventId);
    //
    //     const rsvpData = {
    //         userId,
    //         eventId,
    //         eventTitle,
    //         eventDateTime,
    //         name,
    //         email,
    //         phone,
    //         quantity,
    //         createdAt: new Date().toISOString(),
    //     };
    //
    //     try {
    //         // Fetch current event data
    //         const eventDocSnap = await getDoc(eventDocRef);
    //         if (!eventDocSnap.exists()) {
    //             console.error("Event not found");
    //             return;
    //         }
    //
    //         const eventData = eventDocSnap.data();
    //         const eventCapacity = eventData.eventDetails.capacity || 0;
    //         const eventAttendee = eventData.attendeesCount || 0;
    //         const availableTickets = eventCapacity - eventAttendee;
    //
    //         if (availableTickets <= 0) {
    //             await handleWaitlist(eventWaitlistDocRef, rsvpData);
    //             return;
    //         }
    //
    //         if (quantity > availableTickets) {
    //             alert(`Only ${availableTickets} tickets are available. Please reduce your quantity.`);
    //             return;
    //         }
    //
    //         const checkoutData = {eventId, quantity, price: eventPrice, eventTitle, userId};
    //         const response = await fetch('/api/stripe', {
    //             method: 'POST',
    //             headers: {'Content-Type': 'application/json'},
    //             body: JSON.stringify(checkoutData),
    //         });
    //         window.location.href = await response.text();
    //
    //         // everythonig after here should be moved to the webhook
    //
    //         const existingEventRsvpId = await findExistingRsvpId(eventRsvpsDocRef, userId, eventId);
    //         const existingUserRsvpId = await findExistingRsvpId(userRsvpsDocRef, userId, eventId);
    //
    //         const rsvpId = existingEventRsvpId || existingUserRsvpId || uuidv4();
    //
    //         await saveOrUpdateRsvp(eventRsvpsDocRef, rsvpId, rsvpData, eventId, true);
    //         await saveOrUpdateRsvp(userRsvpsDocRef, rsvpId, rsvpData, userId, false);
    //
    //         await updateAttendeesCount(eventId, eventDocRef);
    //
    //         setAvailableTickets(availableTickets - quantity);
    //         setModalOpen(true);
    //         setUserHasRSVPed(true);
    //     } catch (error) {
    //         console.error("Error handling checkout:", error);
    //     }
    // };


    const handleCheckout = async () => {
        console.log("Processing on Stripe...");

        if (!userId) {
            console.error("User ID is undefined. Cannot proceed with checkout.");
            return;
        }

        const eventDocRef = doc(db, 'Events', eventId);
        const eventWaitlistDocRef = doc(db, 'EventWaitlist', eventId);

        try {
            // Fetch current event data
            const eventDocSnap = await getDoc(eventDocRef);
            if (!eventDocSnap.exists()) {
                console.error("Event not found");
                return;
            }

            const eventData = eventDocSnap.data();
            const eventCapacity = eventData.eventDetails.capacity || 0;
            const eventAttendee = eventData.attendeesCount || 0;
            const availableTickets = eventCapacity - eventAttendee;

            if (availableTickets <= 0) {
                const rsvpData = {
                    userId,
                    eventId,
                    eventTitle,
                    eventDateTime,
                    name,
                    email,
                    phone,
                    quantity,
                    createdAt: new Date().toISOString(),
                };
                await handleWaitlist(eventWaitlistDocRef, rsvpData);
                return;
            }

            if (quantity > availableTickets) {
                alert(`Only ${availableTickets} tickets are available. Please reduce your quantity.`);
                return;
            }

            const checkoutData = {
                eventId,
                quantity,
                price: eventPrice,
                eventTitle,
                userId,
            };
            const response = await fetch('/api/stripe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(checkoutData),
            });

            // Redirect to Stripe Checkout
            const sessionUrl = await response.text();
            window.location.href = sessionUrl;

        } catch (error) {
            console.error("Error handling checkout:", error);
        }
    };

    const handleCancel = async () => {
        if (!userId) {
            console.error("User ID is undefined. Cannot proceed with cancellation.");
            return;
        }

        const eventRsvpsDocRef = doc(db, 'EventRSVPs', eventId);
        const eventDocRef = doc(db, 'Events', eventId);
        const waitlistDocRef = doc(db, 'EventWaitlist', eventId);

        try {
            const eventDocSnap = await getDoc(eventDocRef);
            if (!eventDocSnap.exists()) {
                console.error("Event not found");
                return;
            }

            const eventData = eventDocSnap.data();
            const eventDate = eventData.eventDetails.eventDateTime.toDate();
            const daysUntilEvent = (eventDate - new Date()) / (1000 * 60 * 60 * 24);

            const eventRsvpsSnap = await getDoc(eventRsvpsDocRef);
            if (!eventRsvpsSnap.exists()) {
                console.error("No RSVPs found for this event.");
                return;
            }

            const rsvps = eventRsvpsSnap.data().rsvps || {};
            const userRsvpEntryId = Object.keys(rsvps).find(
                key => rsvps[key].userId === userId && rsvps[key].eventId === eventId
            );

            if (userRsvpEntryId) {

                if (daysUntilEvent <= 7 && isPaidEvent) {
                    console.log("Cannot cancel RSVP with 7 or fewer days remaining for this paid event.");
                    alert("Cancellation not allowed with less than 7 days remaining.");
                    return;
                }

                await updateDoc(eventRsvpsDocRef, {
                    [`rsvps.${userRsvpEntryId}`]: deleteField()
                });

                const userRsvpsDocRef = doc(db, 'UserRSVPs', userId);
                await updateDoc(userRsvpsDocRef, {
                    [`rsvps.${userRsvpEntryId}`]: deleteField()
                });

                await updateAttendeesCount(eventId, eventDocRef);

                const waitlistDocSnap = await getDoc(waitlistDocRef);
                const waitlist = waitlistDocSnap.exists() ? waitlistDocSnap.data().waitlist || [] : [];

                if (waitlist.length > 0) {
                    notifyWaitlist(waitlist);
                }

                alert(`RSVP cancellation processed.`);
                console.log("RSVP cancellation processed.");

                if (isPaidEvent) {
                    console.log("processRefund(userId, eventId);");
                }
            } else {
                const waitlistDocSnap = await getDoc(waitlistDocRef);
                if (waitlistDocSnap.exists()) {
                    const waitlist = waitlistDocSnap.data().waitlist || [];
                    const userInWaitlist = waitlist.some(entry => entry.userId === userId);

                    if (userInWaitlist) {
                        alert(`You have been removed from the waitlist.`);
                        console.log("User found in waitlist");
                        const updatedWaitlist = waitlist.filter(entry => entry.userId !== userId);
                        await updateDoc(waitlistDocRef, {waitlist: updatedWaitlist});
                        console.log("Waitlist updated.");
                    } else {
                        alert(`You need to RSVP or join waitlist to perform this action.`);
                        console.log("User is not in the waitlist; no update needed.");
                    }
                } else {
                    alert(`You need to RSVP or join waitlist to perform this action.`);
                    console.log("Waitlist document does not exist.");
                }
            }
        } catch (error) {
            console.error("Error during cancellation:", error);
        }
    };


    const handleModifyRSVP = async () => {
        if (!userId) {
            console.error("User ID is undefined. Cannot proceed with modifying RSVP.");
            return;
        }

        const totalAttendees = isPaidEvent ? quantity : Math.min(quantity, 10);
        const eventRsvpsDocRef = doc(db, 'EventRSVPs', eventId);
        const userRsvpsDocRef = doc(db, 'UserRSVPs', userId);
        const eventDocRef = doc(db, 'Events', eventId);

        const rsvpData = {
            userId,
            eventId,
            eventTitle,
            eventDateTime,
            name,
            email,
            phone,
            quantity: totalAttendees,
            createdAt: new Date().toISOString(),
        };

        try {
            // Fetch current event data
            const eventDocSnap = await getDoc(eventDocRef);
            if (!eventDocSnap.exists()) {
                console.error("Event not found");
                return;
            }

            const eventData = eventDocSnap.data();
            const eventCapacity = eventData.eventDetails.capacity || 0;
            const eventAttendee = eventData.attendeesCount || 0;

            const newTotalAttendees = eventAttendee - userRSVPQuantity + totalAttendees;

            if (newTotalAttendees > eventCapacity) {
                alert("Cannot increase RSVP quantity beyond event capacity.");
                return;
            }

            const existingEventRsvpId = await findExistingRsvpId(eventRsvpsDocRef, userId, eventId);
            const existingUserRsvpId = await findExistingRsvpId(userRsvpsDocRef, userId, eventId);

            // Save or update the RSVP in EventRSVPs and UserRSVPs collections
            await saveOrUpdateRsvp(eventRsvpsDocRef, existingEventRsvpId, rsvpData, eventId, true);
            await saveOrUpdateRsvp(userRsvpsDocRef, existingUserRsvpId, rsvpData, userId, false);

            // Update the attendee count in the event document
            await updateAttendeesCount(eventId, eventDocRef);

            console.log("RSVP successfully modified");
            setModalOpen(true);
            setUserRSVPQuantity(totalAttendees); // Update the user's RSVP quantity
        } catch (error) {
            console.error("Error modifying RSVP:", error);
        }
    };

    const notifyWaitlist = (waitlist) => {
        waitlist.forEach(user => {
            // emailUser(value);
            console.log(`Notification sent to waitlist user: ${user.email}`);
        });
    };

    const handleWaitlist = async (waitlistDocRef, waitlistData) => {
        try {
            const waitlistDocSnap = await getDoc(waitlistDocRef);
            const currentWaitlist = waitlistDocSnap.exists() ? waitlistDocSnap.data().waitlist || [] : [];
            const userAlreadyInWaitlist = currentWaitlist.some(waitlistEntry => waitlistEntry.userId === waitlistData.userId);

            if (userAlreadyInWaitlist) {
                console.log("User is already on the waitlist.");
                alert("You are already on the waitlist for this event.");
                return;
            }

            await setDoc(waitlistDocRef, {
                waitlist: arrayUnion(waitlistData)
            }, {merge: true});
            alert("You have been added to waitlist successfully.")
            console.log("User added to waitlist successfully.");
        } catch (error) {
            alert("Unable to add to waitlist now.")
            console.error("Error adding user to waitlist:", error);
        }
    };

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

    const {isLoaded} = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: googleMapsConfig.apiKey,
        libraries: [ 'places' ],
    });

    useEffect(() => {
        if (isLoaded && eventPlaceId) {
            geocodePlaceId(eventPlaceId);
        }
    }, [ isLoaded, eventPlaceId ]);

    const geocodePlaceId = async (placeId) => {
        try {
            const service = new google.maps.places.PlacesService(document.createElement('div'));
            const request = {
                placeId: placeId,
                fields: [ 'geometry' ],
            };

            service.getDetails(request, (place, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    const location = place.geometry.location;
                    setEventLat(location.lat());
                    setEventLong(location.lng());
                } else {
                    console.error('Error geocoding place ID:', status);
                }
            });
        } catch (error) {
            console.error('Error geocoding place ID:', error);
        }
    };

    // const emailUser = (value) => {
    //     const emailData = {
    //         user_name: value.name,
    //         user_email: value.email,
    //         message: `Dear ${value.name},\n\nWe are excited to let you know that a spot has just opened up for the event ${value.eventTitle}. You can now rsvp by visiting Urban Oasis.\n\nBest regards,\nUrban Oasis Team`
    //     };
    //
    //     emailjs.send(
    //         import.meta.env.VITE_PUBLIC_EMAIL_SERVICE_KEY,
    //         'template_5lpk33l',
    //         emailData,
    //         import.meta.env.VITE_PUBLIC_EMAIL_PUBLIC_KEY
    //     )
    //            .then((result) => {
    //                console.log(`Email successfully sent to ${value.email}`);
    //            })
    //            .catch((error) => {
    //                console.error(`Failed to send email to ${value.email}:`, error);
    //            });
    // };

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
                    setEventPlaceId(data.basicInfo.location.value.place_id);
                    setEventCity(data.basicInfo.location);
                    setEventDescription(data.basicInfo.description);
                    setEventRefundPolicy(data.policies.refundPolicy);
                    setEventCapacity(data.eventDetails.capacity);
                    setEventAttendee(data.attendeesCount || 0);
                    const ticketsAvailable = data.eventDetails.capacity - (data.attendeesCount || 0);
                    setAvailableTickets(ticketsAvailable);

                    if (data.hostId) {
                        const hostDocRef = doc(db, 'Users', data.hostId);
                        const hostDocSnap = await getDoc(hostDocRef);
                        if (hostDocSnap.exists()) {
                            const hostData = hostDocSnap.data();
                            setHostDetails({
                                id: data.hostId,
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
                                email: hostData.contact?.email || 'Email not found',
                                hostId: hostData.uid
                            });
                            setHostName(hostData.companyName || `${hostData.name?.firstName || ''} ${hostData.name?.lastName || ''}`);
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
        const checkUserRSVP = async () => {
            if (userId && eventId) {
                try {
                    const userRsvpsDocRef = doc(db, 'UserRSVPs', userId);
                    const snapshot = await getDoc(userRsvpsDocRef);
                    if (snapshot.exists()) {
                        const rsvps = snapshot.data().rsvps || {};
                        for (const rsvpId in rsvps) {
                            const rsvp = rsvps[rsvpId];
                            if (rsvp.eventId === eventId) {
                                setUserHasRSVPed(true);
                                setUserRSVPQuantity(rsvp.quantity);
                                setQuantity(rsvp.quantity); // Set quantity to user's existing RSVP quantity
                                return;
                            }
                        }
                    }
                    setUserHasRSVPed(false);
                } catch (error) {
                    console.error("Error checking user RSVP:", error);
                }
            }
        };
        checkUserRSVP();
    }, [ userId, eventId ]);

    if (loading) {
        return <LoadingPage />;
    }

    const handleNavigate = () => {
        navigate(`/host/${hostDetails.hostId}`);
    };

    const toggleChatWindow = () => {
        setChatWindowOpen(!chatWindowOpen);
    };

    const ttip = "View " + `${hostName}` + "'s Page";

    const shareData = `Check out this event on Urban Oasis!\n\n${eventTitle}\n\n` + `${eventDescription}\n\n` + `${eventDateTime}\n` + `${eventLocation}\n\n`// + `${eventImages[0]}\n`

    const formattedDescription = eventDescription
        .replace(/(?:\r\n|\r|\n)/g, '<br/>');

    return (
        <>
            <div className="event-page min-h-screen flex flex-col" >
                <div className="w-full bg-primary-dark" >
                    <HeaderComponent />
                </div >
                <div
                    className="flex flex-col justify-center items-center py-12 bg-gradient-to-r from-blue-500 via-blue-800 to-blue-600" >
                    <div className="box-border rounded-lg bg-gray-900 p-8 flex flex-col w-10/12 h-fit shadow-lg" >
                        <PhotoCarousel eventId={eventId} eventTitle={eventTitle} />
                        <div className="flex flex-row mt-6" >
                            <div className="flex content w-full flex-col gap-8" >
                                <div className="flex flex-col pt-4 space-y-6" >
                                    <div className="flex items-center space-x-3" >
                                        <CalendarDaysIcon className="text-gray-300 w-6 h-6" />
                                        <label className="font-bold text-white opacity-80" >{eventDateTime}</label >
                                    </div >
                                    <label className="block text-gray-300 text-5xl font-semibold" >{eventTitle}</label >
                                </div >
                                <div className="flex flex-col" >
                                    <h2 className="text-2xl text-white font-semibold" >Description</h2 >
                                    <div className="text-gray-300"
                                         dangerouslySetInnerHTML={{__html: formattedDescription}} />
                                </div >
                                <ForecastComponent lat={eventLat} lon={eventLong} eventDate={eventDateTime} />
                            </div >
                            <div className="flex flex-col p-6 w-1/4 h-fit gap-4 " >
                                <div className="flex flex-col p-6 h-fit gap-4 bg-gray-800 rounded-lg shadow-lg" >
                                    <div className="flex space-x-4" >
                                        {availableTickets < 10 && availableTickets > 0 && (
                                            <p className="text-white text-center" >
                                                Only {availableTickets} tickets left!
                                            </p >
                                        )}
                                        <div
                                            className="flex justify-center items-center w-52 h-12 bg-gray-500 bg-opacity-30 border-4 border-gray-500 rounded-lg" >
                                            <TicketIcon className="text-gray-300 w-6 h-6" />
                                            <label
                                                className="font-bold text-white pl-3" >{isPaidEvent && '$'}{eventPrice}</label >
                                        </div >
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

                                    {userHasRSVPed ? (
                                        <>
                                            <div
                                                className="flex justify-center items-center w-full h-12 bg-gray-700 hover:bg-gray-500 transition duration-300 ease-in-out border-4 border-gray-500 rounded-lg" >
                                                <button
                                                    className="flex items-center text-white font-bold py-2 px-4 rounded focus:outline-none"
                                                    onClick={handleCancel}
                                                >
                                                    <XMarkIcon className="text-gray-300 w-6 h-6 mr-2" />
                                                    <span >{'Cancel RSVP'}</span >
                                                </button >
                                            </div >
                                            <div
                                                className="flex justify-center items-center w-full h-12 bg-gray-700 hover:bg-gray-500 transition duration-300 ease-in-out border-4 border-gray-500 rounded-lg" >
                                                <button
                                                    className="flex items-center text-white font-bold py-2 px-4 rounded focus:outline-none"
                                                    onClick={handleModifyRSVP}
                                                >
                                                    <ShoppingCartIcon className="text-gray-300 w-6 h-6 mr-2" />
                                                    <span >{'Modify RSVP'}</span >
                                                </button >
                                            </div >
                                        </>
                                    ) : (
                                        <div
                                            className="flex justify-center items-center w-full h-12 bg-gray-700 hover:bg-gray-500 transition duration-300 ease-in-out border-4 border-gray-500 rounded-lg" >
                                            <button
                                                className="flex items-center text-white font-bold py-2 px-4 rounded focus:outline-none"
                                                onClick={
                                                    eventCapacity > eventAttendee
                                                        ? isPaidEvent
                                                            ? handleCheckout
                                                            : handleRSVP
                                                        : handleRSVP
                                                }
                                            >
                                                <ShoppingCartIcon className="text-gray-300 w-6 h-6 mr-2" />
                                                <span >
                                                    {eventCapacity > eventAttendee ? isPaidEvent ? 'Checkout' : 'RSVP' : 'Join Waitlist'} </span >
                                            </button >
                                        </div >
                                    )}


                                    <div className="flex flex-row gap-6 items-center" >
                                        <MapPinIcon className="text-gray-300 w-6 h-6" />
                                        <label className="font-bold text-white opacity-80" >{eventLocation}</label >
                                    </div >
                                    <div
                                        className="flex flex-col justify-center items-center w-full h-auto bg-gray-700 border-4 border-gray-500 rounded-lg p-4" >
                                        <h3 className="text-white font-bold mb-2" >Hosted by</h3 >
                                        {hostDetails && (
                                            <div className="flex flex-col items-center space-y-2" >
                                                <Tooltip TransitionComponent={Zoom} title={ttip} arrow >
                                                    <h3 className="text-lg text-white font-semibold cursor-pointer"
                                                        onClick={handleNavigate} >{hostDetails.companyName || hostDetails.name}</h3 >
                                                </Tooltip >
                                                <button className="" onClick={toggleChatWindow} >Host Chat</button >
                                            </div >
                                        )}
                                    </div >
                                    <div className="flex flex-row justify-between" >
                                        <Tooltip TransitionComponent={Zoom} title="Share to Facebook" arrow >
                                            <FacebookShareButton title={shareData} url={eventPageUrl} >
                                                <FacebookIcon size={28} round />
                                            </FacebookShareButton >
                                        </Tooltip >

                                        <Tooltip TransitionComponent={Zoom} title="Share to Facebook Messenger" arrow >
                                            <FacebookMessengerShareButton url={eventPageUrl}
                                                                          appId="root" >
                                                <FacebookMessengerIcon size={28} round />
                                            </FacebookMessengerShareButton >
                                        </Tooltip >

                                        <Tooltip TransitionComponent={Zoom} title="Share to Twitter" arrow >
                                            <TwitterShareButton
                                                url={eventPageUrl}
                                                title={shareData}
                                            >
                                                <XIcon size={28} round />
                                            </TwitterShareButton >
                                        </Tooltip >

                                        <Tooltip TransitionComponent={Zoom} title="Share to Whatsapp" arrow >
                                            <WhatsappShareButton
                                                url={eventPageUrl}
                                                title={shareData}
                                                separator=":: "
                                            >
                                                <WhatsappIcon size={28} round />
                                            </WhatsappShareButton >
                                        </Tooltip >

                                        <Tooltip TransitionComponent={Zoom} title="Share to Linkedin" arrow >
                                            <LinkedinShareButton url={eventPageUrl} title={shareData} >
                                                <LinkedinIcon size={28} round />
                                            </LinkedinShareButton >
                                        </Tooltip >

                                        <Tooltip TransitionComponent={Zoom} title="Share to Reddit" arrow >
                                            <RedditShareButton
                                                url={eventPageUrl}
                                                title={shareData}
                                                windowWidth={660}
                                                windowHeight={460}
                                            >
                                                <RedditIcon size={28} round />
                                            </RedditShareButton >
                                        </Tooltip >

                                        <Tooltip TransitionComponent={Zoom} title="Share to Email" arrow >
                                            <EmailShareButton
                                                url={eventPageUrl}
                                                subject={"Check out this event on Urban Oasis!"}
                                                body={shareData}
                                            >
                                                <EmailIcon size={28} round />
                                            </EmailShareButton >
                                        </Tooltip >
                                    </div >
                                </div >
                                <GoogleMapComponent lat={eventLat} lon={eventLong} />
                            </div >
                        </div >
                    </div >
                    <ChatWindowComponent
                        userId={userId}
                        hostDetails={hostDetails}
                        eventId={eventId}
                        eventTitle={eventTitle}
                        eventImages={eventImages}
                        chatWindowOpen={chatWindowOpen}
                        toggleChatWindow={toggleChatWindow}
                    />
                </div >
                <Modal open={modalOpen} onClose={handleModalClose} >
                    <div
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 bg-neutral-white rounded-lg shadow-lg p-8" >
                        <h2 className="text-h3 font-semibold text-neutral-black mb-4 text-center font-archivo" >RSVP
                            Successful</h2 >
                        <p className="text-body text-detail-gray text-center mb-6 font-inter" >
                            Your RSVP has been successfully registered.
                        </p >
                        <Button
                            onClick={handleModalClose}
                            variant="contained"
                            color="primary"
                            className="mt-4 w-full bg-accent-blue hover:bg-primary-dark text-neutral-white py-2 rounded-lg font-medium"
                        >
                            Close
                        </Button >
                    </div >
                </Modal >
                <FooterComponent />
            </div >
        </>
    );
};

export default EventPage;