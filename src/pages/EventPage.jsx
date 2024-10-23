import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, setDoc, updateDoc, arrayUnion, onSnapshot, Timestamp } from 'firebase/firestore';
import { onAuthStateChanged } from "firebase/auth";
import PhotoCarousel from "../components/PhotoCarousel.jsx";
import { CalendarDaysIcon, MapPinIcon, TicketIcon, PlusIcon, MinusIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { db, auth } from "../firebaseConfig.js";
import HeaderComponent from "../components/HeaderComponent.jsx";
import FooterComponent from "../components/FooterComponent.jsx";
import LoadingPage from "./LoadingPage.jsx"
import { Button, Modal } from "@mui/material";
import { loadStripe } from "@stripe/stripe-js";
import { v4 as uuidv4 } from "uuid";

const EventPage = () => {
    const [ quantity, setQuantity ] = useState(1);
    const {eventId} = useParams();
    const [ eventTitle, setEventTitle ] = useState('');
    const [ eventDescription, setEventDescription ] = useState('');
    const [ eventLocation, setEventLocation ] = useState('');
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
    const [ messages, setMessages ] = useState([]);
    const [ newMessage, setNewMessage ] = useState("");
    const [ chatId, setChatId ] = useState(null);
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

        const rsvpId = uuidv4();
        const totalAttendees = isPaidEvent ? quantity : Math.min(quantity, 10);
        const eventRsvpsDocRef = doc(db, 'EventRSVPs', eventId);
        const eventDocRef = doc(db, 'Events', eventId);

        const totalPrice = isPaidEvent ? eventPrice * totalAttendees : 0;

        const rsvpData = {
            rsvpId: rsvpId,
            userId: userId,
            eventId: eventId,
            name: name,
            email: email,
            phone: phone,
            quantity: totalAttendees,
            eventTitle: eventTitle,
            eventDateTime: eventDateTime,
            createdAt: new Date().toISOString(),
        };

        try {
            const eventDocSnap = await getDoc(eventDocRef);
            if (!eventDocSnap.exists()) {
                console.error("Event not found");
                return;
            }

            const eventData = eventDocSnap.data();
            const {attendeesCount = 0, capacity = Infinity} = eventData;

            if (attendeesCount + totalAttendees > capacity) {
                console.error("RSVP quantity exceeds event capacity");
                alert(`This event only has ${capacity - attendeesCount} spots left.`);
                return;
            }

            const rsvpsDocSnap = await getDoc(eventRsvpsDocRef);
            if (rsvpsDocSnap.exists()) {
                await updateDoc(eventRsvpsDocRef, {
                    [`rsvps.${rsvpId}`]: rsvpData,
                });
            } else {
                await setDoc(eventRsvpsDocRef, {
                    eventId: eventId,
                    rsvps: {
                        [rsvpId]: rsvpData,
                    },
                });
            }

            const userRsvpsDocRef = doc(db, 'UserRSVPs', userId);
            const userRsvpsDocSnap = await getDoc(userRsvpsDocRef);
            if (userRsvpsDocSnap.exists()) {
                await updateDoc(userRsvpsDocRef, {
                    [`events.${rsvpId}`]: rsvpData,
                });
            } else {
                await setDoc(userRsvpsDocRef, {
                    userId: userId,
                    events: {
                        [rsvpId]: rsvpData,
                    },
                });
            }

            const updatedDocSnap = await getDoc(eventRsvpsDocRef);
            const rsvps = updatedDocSnap.data().rsvps || {};
            const totalRSVPs = Object.values(rsvps).reduce((acc, rsvp) => acc + rsvp.quantity, 0);

            await updateDoc(eventDocRef, {
                attendeesCount: totalRSVPs,
            });

            setModalOpen(true);
        } catch (error) {
            console.error("Error adding/updating RSVP: ", error);
        }
    };

    const handleCheckout = async () => {
        console.log("Processing on Stripe...");

        const rsvpId = uuidv4();

        const checkoutData = {
            eventId: eventId,
            quantity: quantity,
            price: eventPrice,
            eventTitle: eventTitle,
            userId: userId,
        };

        const response = await fetch('/api/stripe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(checkoutData),
        });

        const sessionUrl = await response.text();

        // Save RSVP data to Firestore before redirecting to Stripe
        try {
            const totalAttendees = quantity;
            const eventRsvpsDocRef = doc(db, 'EventRSVPs', eventId);
            const eventDocRef = doc(db, 'Events', eventId);

            const rsvpData = {
                rsvpId: rsvpId,
                userId: userId,
                eventId: eventId,
                phone: phone,
                quantity: totalAttendees,
                eventTitle: eventTitle,
                eventDateTime: eventDateTime,
                createdAt: new Date().toISOString(),
            };

            const eventDocSnap = await getDoc(eventDocRef);
            if (!eventDocSnap.exists()) {
                console.error("Event not found");
                return;
            }

            const eventData = eventDocSnap.data();
            const {attendeesCount = 0, capacity = Infinity} = eventData;

            if (attendeesCount + totalAttendees > capacity) {
                console.error("RSVP quantity exceeds event capacity");
                alert(`This event only has ${capacity - attendeesCount} spots left.`);
                return;
            }

            const rsvpsDocSnap = await getDoc(eventRsvpsDocRef);
            if (rsvpsDocSnap.exists()) {
                await updateDoc(eventRsvpsDocRef, {
                    [`rsvps.${rsvpId}`]: rsvpData,
                });
            } else {
                await setDoc(eventRsvpsDocRef, {
                    eventId: eventId,
                    rsvps: {
                        [rsvpId]: rsvpData,
                    },
                });
            }

            const userRsvpsDocRef = doc(db, 'UserRSVPs', userId);
            const userRsvpsDocSnap = await getDoc(userRsvpsDocRef);
            if (userRsvpsDocSnap.exists()) {
                await updateDoc(userRsvpsDocRef, {
                    [`events.${rsvpId}`]: rsvpData,
                });
            } else {
                await setDoc(userRsvpsDocRef, {
                    userId: userId,
                    events: {
                        [rsvpId]: rsvpData,
                    },
                });
            }

            const updatedDocSnap = await getDoc(eventRsvpsDocRef);
            const rsvps = updatedDocSnap.data().rsvps || {};
            const totalRSVPs = Object.values(rsvps).reduce((acc, rsvp) => acc + rsvp.quantity, 0);

            await updateDoc(eventDocRef, {
                attendeesCount: totalRSVPs,
            });

            // Redirect to Stripe checkout after successfully saving the RSVP
            window.location.href = sessionUrl;

        } catch (error) {
            console.error("Error adding/updating RSVP after checkout: ", error);
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
                        setProfilePicture(data.profilePicture || eventImages[0] || '');
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

    const toggleChatWindow = () => {
        setChatWindowOpen(!chatWindowOpen);
    };

    const createChatId = (userId, hostId) => {
        console.log('creating id', userId < hostId ? `${userId}_${hostId}` : `${hostId}_${userId}`);
        return userId < hostId ? `${userId}_${hostId}` : `${hostId}_${userId}`;
    };

    const createOrFetchChat = async (hostId) => {

        const chatId = createChatId(userId, hostId);

        const chatRef = doc(db, 'chats', chatId);
        const chatDoc = await getDoc(chatRef);
        if (chatDoc.exists()) {

            setChatId(chatId);
            console.log('existing chat ', chatId);
            return chatId;
        } else {

            const newChatData = {
                event: {
                    id: eventId,
                    name: eventTitle,
                    image: eventImages.length > 0 ? eventImages[0] : "",
                },
                participants: [ userId, hostId ],
                messages: [],
                sender: {
                    id: userId,
                    name: name,
                    profilePicture: profilePicture,
                    email: email,
                    // phone:phone,

                },
                receiver: {
                    id: hostId,
                    name: hostDetails.name,
                    profilePicture: hostDetails.profilePicture,
                    email: hostDetails.email,
                    // phone:hostDetails.phone,

                }
            };
            await setDoc(chatRef, newChatData);
            setChatId(chatId);
            console.log('new chat ', chatId);
            return chatId;
        }
    };

    const fetchMessages = (chatId) => {
        const chatRef = doc(db, 'chats', chatId);
        return onSnapshot(chatRef, (doc) => {
            if (doc.exists()) {
                setMessages(doc.data().messages || []);
                console.log('docs ', doc.data().messages);

                console.log('messages ', messages);

            }
        });
    };

    const sendMessage = async () => {
        if (newMessage.trim() === '') return;
        const chatRef = doc(db, 'chats', chatId);
        await updateDoc(chatRef, {
            messages: arrayUnion({
                senderId: userId,
                msg: newMessage,
                ts: Timestamp.now(),
            }),
        });
        setNewMessage('');
    };

    const handleHostChatClick = async () => {
        try {
            const chatId = await createOrFetchChat(hostDetails.id);
            fetchMessages(chatId);
            toggleChatWindow();
        } catch (error) {
            console.error('Error creating or fetching chat: ', error);
        }
    };

    const handleNavigate = () => {
        navigate(`/host/${hostDetails.hostId}`);
    };

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
                                    <p className="text-gray-300" >{eventDescription}</p >
                                </div >
                            </div >
                            <div className="flex flex-col p-6 w-1/4 h-fit gap-4 bg-gray-800 rounded-lg shadow-lg" >
                                <div className="flex space-x-4" >
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
                                <div
                                    className="flex justify-center items-center w-full h-12 bg-gray-700 hover:bg-gray-500 transition duration-300 ease-in-out border-4 border-gray-500 rounded-lg" >
                                    <button
                                        className="flex items-center text-white font-bold py-2 px-4 rounded focus:outline-none"
                                        onClick={isPaidEvent ? handleCheckout : handleRSVP}
                                    >
                                        <ShoppingCartIcon className="text-gray-300 w-6 h-6 mr-2" />
                                        <span >{isPaidEvent ? 'Checkout' : 'RSVP'}</span >
                                    </button >
                                </div >
                                <div className="flex flex-row gap-6 items-center" >
                                    <MapPinIcon className="text-gray-300 w-6 h-6" />
                                    <label className="font-bold text-white opacity-80" >{eventLocation}</label >
                                </div >
                                <div
                                    className="flex flex-col justify-center items-center w-full h-auto bg-gray-700 border-4 border-gray-500 rounded-lg p-4" >
                                    <h3 className="text-white font-bold mb-2" >Hosted by</h3 >
                                    {hostDetails && (
                                        <div className="flex flex-col items-center space-y-2" >
                                            <h3 className="text-lg text-white font-semibold"
                                                onClick={handleNavigate} >{hostDetails.companyName || hostDetails.name}</h3 >
                                            <button className="" onClick={handleHostChatClick} >Host Chat</button >
                                        </div >
                                    )}
                                </div >
                            </div >
                        </div >
                    </div >
                    {chatWindowOpen && (
                        <div className="fixed bottom-0 right-0 w-96 h-96 bg-gray-800 shadow-lg p-4 rounded-t-lg" >
                            <div className="flex justify-between items-center mb-4" >
                                <h4 className="text-white font-semibold" >Chat with {hostDetails.name}</h4 >
                                <button onClick={toggleChatWindow} className="text-white" >
                                    <XMarkIcon className="w-6 h-6" />
                                </button >
                            </div >
                            <div
                                className="chat-messages flex flex-col space-y-2 overflow-y-auto h-64 bg-gray-700 p-2 rounded-lg" >
                                {messages.map((msg, index) => (
                                    <div
                                        key={index}
                                        className={`p-2 rounded-lg ${msg.senderId === userId ? 'bg-blue-500 text-white self-end' : 'bg-gray-300 text-black self-start'}`}
                                    >
                                        {msg.msg}
                                    </div >
                                ))}
                            </div >
                            <input
                                type="text"
                                className="w-full mt-2 p-2 rounded-lg bg-gray-600 text-white"
                                placeholder="Type your message..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                            />
                        </div >
                    )}
                </div >
                <Modal open={modalOpen} onClose={handleModalClose} >
                    <div
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 bg-neutral-white rounded-lg shadow-lg p-8" >
                        <h2 className="text-h3 font-semibold text-neutral-black mb-4 text-center font-archivo" >Event
                            Created!</h2 >
                        <p className="text-body text-detail-gray text-center mb-6 font-inter" >
                            Your event has been successfully created.
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