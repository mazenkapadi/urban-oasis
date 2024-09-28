import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {collection, doc, getDoc, getDocs, query, where} from "firebase/firestore";
import PhotoCarousel from "../components/PhotoCarousel.jsx";
import {CalendarDaysIcon, UserIcon, MapPinIcon, TicketIcon} from "@heroicons/react/20/solid";
import {auth, db} from "../firebaseConfig.js";
import {onAuthStateChanged} from "firebase/auth";


function EventPage() {
    const [userId, setUserId] = useState(null);
    const [eventData, setEventData] = useState(null);
    const {eventId} = useParams();
    const [quantity, setQuantity] = useState(1);

    const handleIncrement = () => {
        setQuantity(quantity + 1);
    }
    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    }

    const handleCheckout = () => {

    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("User is signed in.");
                setUserId(user.uid);
            } else {
                console.log("User is not signed in.");
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchEventData = async () => {
            const id = eventId;
            try {
                console.log("eventId:", id);
                const eventDocRef = doc(db, "Events", id);
                console.log("eventDocRef", eventDocRef);
                const eventDocSnap = await getDoc(eventDocRef);
                console.log("eventDocSnap", eventDocSnap);
                console.log("Event Data:", eventDocSnap.data());
                if (eventDocSnap.exists()) {
                    console.log("Event Data:", eventDocSnap.data());
                    setEventData(eventDocSnap.data());
                } else {
                    console.error("No such document!");
                }
            } catch (error) {
                console.error("Error fetching event:", error);
            }
        };

        fetchEventData();
    }, [eventId]);


    return (
        (eventData ? (
                <>
                    <div className="event-page">
                        <div className="flex h-full w-full">
                            <div className="bg-blue-800 p-6 flex flex-col w-full h-full gap-3">
                                <div
                                    className="box-border rounded-lg bg-gray-900 p-8 flex flex-col w-full h-full gap-4">

                                    <div className="box-border rounded-lg bg-amber-500 w-full h-96">
                                        <PhotoCarousel/>
                                    </div>

                                    <div className="flex flex-row">
                                        <div className="flex content w-full flex-col gap-8 ">
                                            <div className="flex flex-col pt-4 space-y-2">
                                                <label
                                                    className="block text-gray-300 text-5xl">{eventData.basicInfo.title}</label>
                                                <div className="flex items-center space-x-3">
                                                    <CalendarDaysIcon className="text-gray-300 w-6 h-6"/>
                                                    <label
                                                        className="font-bold text-white opacity-50">{new Date(eventData.eventDetails.eventDateTime.toDate()).toLocaleString()}</label>
                                                </div>
                                            </div>
                                            <div className="flex flex-row">
                                                <UserIcon className="text-gray-300 w-6 h-6"/>
                                                <label className="font-bold text-white opacity-50 pl-3">Host</label>
                                            </div>
                                        </div>

                                        <div className="flex flex-col p-6 w-1/4 h-52 gap-2">
                                            <div
                                                className="flex flex-row gap-4">

                                                <div
                                                    className="box-border rounded-lg bg-gray-500 bg-opacity-30 border-4 border-gray-500 justify-center items-center flex w-52 h-12">
                                                    <TicketIcon className="text-gray-300 w-6 h-6"/>
                                                    <label
                                                        className="font-bold text-white pl-3">{eventData.eventDetails.eventPrice}</label>
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
                                            <div
                                                className="flex w-96 h-64">
                                                <MapPinIcon className="text-gray-300 w-6 h-6"/>
                                                <label
                                                    className="font-bold text-white pl-3">{eventData.basicInfo.location}</label>
                                            </div>
                                            <div
                                                className="box-border rounded-lg bg-gray-500 bg-opacity-30 border-4 border-gray-500 p-2 flex w-full h-72">
                                                <label className="font-bold text-white text-2xl">Host Contact
                                                    Information</label>
                                            </div>
                                        </div>
                                    </div>


                                    <div className="flex flex-row">
                                        <label className="font-bold text-white text-2xl">About This Event</label>
                                        <label className="font-bold text-white pl-3">Refund Policy</label>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div>Loading...</div>
            )
        )
    );
}

export default EventPage;