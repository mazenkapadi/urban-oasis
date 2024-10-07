import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import PhotoCarousel from "../components/PhotoCarousel.jsx";
import {CalendarDaysIcon, UserIcon, MapPinIcon, TicketIcon} from "@heroicons/react/20/solid";
import {db} from "../firebaseConfig.js";
import HeaderComponent from "../components/HeaderComponent.jsx";
import FooterComponent from "../components/FooterComponent.jsx";


const EventPage = () => {
    const [quantity, setQuantity] = useState(1);
    const {eventId: eventId} = useParams();
    const [eventTitle, setEventTitle] = useState('');
    const [eventDescription, setEventDescription] = useState('');
    const [eventLocation, setEventLocation] = useState('');
    const [eventDateTime, setEventDateTime] = useState('');
    const [eventPrice, setEventPrice] = useState('');
    const [eventRefundPolicy, setEventRefundPolicy] = useState('');
    const [userId, setUserId] = useState('null');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [eventImages, setEventImages] = useState([]);

    const handleIncrement = () => {
        setQuantity(quantity + 1);
    }
    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    }

    const handleCheckout = async () => {
        const totalAttendees = isPaidEvent ? quantity : guests + 1; // Include user in total attendees
        const rsvpData = {
            userId: userId,
            quantity: totalAttendees,
            eventTitle: eventTitle,
            eventDateTime: eventDateTime,
            createdAt: new Date().toISOString(), // Add timestamp
        };

        const eventRsvpsDocRef = doc(db, 'EventRSVPs', eventId); // Reference to the event's RSVP document

        try {
            // Fetch the existing RSVP document
            const docSnap = await getDoc(eventRsvpsDocRef);

            if (docSnap.exists()) {
                // Document exists, update it
                await updateDoc(eventRsvpsDocRef, {
                    [`rsvps.${userId}`]: rsvpData, // Use userId as the key
                });
                console.log("RSVP updated for event!", rsvpData);
            } else {
                // Document does not exist, create a new one
                await setDoc(eventRsvpsDocRef, {
                    eventId: eventId,
                    rsvps: {
                        [userId]: rsvpData, // Use userId as the key
                    },
                });
                console.log("RSVP created for event!", rsvpData);
            }
        } catch (error) {
            console.error("Error adding/updating RSVP: ", error);
        }
    };

    useEffect(() => {
        const fetchEventData = async () => {
            if (eventId) {
                console.log("Event id", eventId)
                const docRef = doc(db, 'Events', eventId);
                console.log(docRef);
                const docSnap = await getDoc(docRef);

                console.log(docSnap.exists());
                if (docSnap.exists()) {
                    console.log(docSnap.data());
                    const data = docSnap.data();
                    setEventTitle(data.basicInfo.title);
                    setEventDateTime(data.eventDetails.eventDateTime.toDate().toLocaleDateString());
                    if (data.eventDetails.eventPrice === 0) {
                        setEventPrice("Free");
                    } else {
                        setEventPrice(data.eventDetails.eventPrice);
                    }
                    setEventLocation(data.basicInfo.location);
                    setEventDescription(data.basicInfo.description);
                    setEventRefundPolicy(data.policies.refundPolicy);
                    if (data.eventDetails.images) {
                        const imageUrls = await Promise.all(
                            data.eventDetails.images.map(async (imageUrl) => {
                                return imageUrl;
                            })
                        );
                        setEventImages(imageUrls);
                    }
                    setUserId(data.userId);
                } else {
                    console.log('No such document!');
                }


            }
        };

        const fetchUserData = async () => {
            if (userId) {
                const docRef = doc(db, 'Users', userId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    // Set the state with user data
                    setName(`${data.name.firstName || ''} ${data.name.lastName || ''}`);
                    setPhone(data.contact.cellPhone || '');
                    setEmail(data.contact.email || '');

                } else {
                    console.log('No such document!');
                }
            }
        }

        fetchEventData();
        fetchUserData();
    }, []);


    return (
        <>
            <div className="event-page">
                <div
                    className="flex justify-center items-center py-10 px-4 pt-32 bg-gradient-to-r from-blue-500 via-blue-800 to-blue-600 min-h-screen">

                    <HeaderComponent/>
                    <div
                        className="box-border rounded-lg bg-gray-900 p-8 pt-24 flex flex-col w-10/12 h-screen ">

                        <div className="w-full h-96">
                            <PhotoCarousel eventId={eventId} eventTitle={eventTitle}/>
                        </div>

                        <div className="flex flex-row">
                            <div className="flex content w-full flex-col gap-8 ">
                                <div className="flex flex-col pt-4 space-y-6">
                                    <div className="flex items-center space-x-3">
                                        <CalendarDaysIcon className="text-gray-300 w-6 h-6"/>
                                        <label
                                            className="font-bold text-white opacity-50">{eventDateTime}</label>
                                    </div>
                                    <label
                                        className="block text-gray-300 text-5xl">{eventTitle}</label>

                                    <div className="flex flex-row">
                                        <UserIcon className="text-gray-300 w-6 h-6"/>
                                        <label className="font-bold text-white opacity-50 pl-3">{name}</label>
                                    </div>
                                </div>

                            </div>

                            <div className="flex flex-col p-6 w-1/4 h-fit gap-2">
                                <div
                                    className="flex flex-row gap-4">

                                    <div
                                        className="box-border rounded-lg bg-gray-500 bg-opacity-30 border-4 border-gray-500 justify-center items-center flex w-52 h-12">
                                        <TicketIcon className="text-gray-300 w-6 h-6"/>
                                        <label
                                            className="font-bold text-white pl-3">{eventPrice}</label>
                                    </div>

                                    <div
                                        className="box-border rounded-lg bg-gray-500 bg-opacity-30 border-4 border-gray-500 justify-center items-center flex w-36 h-12 gap-3">
                                        <button onClick={handleDecrement} disabled={quantity === 1}
                                                style={{color: "white", fontSize: 20}}>-
                                        </button>
                                        <span style={{
                                            color: "white",
                                            fontWeight: "bold",
                                            fontSize: 20
                                        }}>{quantity}</span>
                                        <button onClick={handleIncrement}
                                                style={{color: "white", fontSize: 20}}>+
                                        </button>
                                    </div>
                                </div>

                                <div
                                    className="box-border rounded-lg bg-gray-500 bg-opacity-30 border-4 border-gray-500 justify-center items-center flex w-full h-12">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         strokeWidth={1.5}
                                         stroke="white" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"/>
                                    </svg>

                                    <button onClick={handleCheckout}
                                            style={{
                                                color: "white",
                                                paddingLeft: "10px",
                                                fontWeight: "bold"
                                            }}>RSVP
                                    </button>
                                </div>
                                {eventRefundPolicy !== null && (
                                    <div
                                        className="flex-col">
                                        <label className="font-bold text-white pl-3">Refund Policy</label>
                                        <label className="text-white">{eventRefundPolicy}</label>
                                    </div>
                                )}
                                <div
                                    className="flex w-fit h-fit">
                                    <MapPinIcon className="text-gray-300 w-6 h-6"/>
                                    <label
                                        className="font-bold text-white pl-3">{eventLocation}</label>
                                </div>

                                <div
                                    className="flex-col box-border rounded-lg bg-gray-500 bg-opacity-30 border-4 border-gray-500 p-2 flex w-full h-fit">
                                    <label className="font-bold text-white text-2xl">Host Contact
                                        Information</label>
                                    <label className="text-white ">Email: {email}</label>
                                    <label className="text-white ">Phone: {phone}</label>

                                </div>
                            </div>
                        </div>

                        <div className="flex flex-row">
                            <div className="flex flex-col w-1/3 h-fit">
                                <label className="font-bold text-white text-2xl">About This Event</label>
                                <label className="text-white">{eventDescription}</label>
                            </div>
                        </div>

                    </div>
                </div>
                <FooterComponent/>

            </div>
        </>

    );
};

export default EventPage;