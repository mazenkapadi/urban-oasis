import { useEffect, useState } from 'react';
import eventCreation from "../services/eventCreation.js";
import { v4 } from 'uuid';
import { auth } from "../firebaseConfig.js";
import { useNavigate } from "react-router-dom";
import {onAuthStateChanged} from "firebase/auth";

function EventCreationPage() {
    const [ userId, setUserId ] = useState(null); // Store the authenticated user's UID
    const [ eventTitle, setEventTitle ] = useState('');
    const [ eventDescription, setEventDescription ] = useState('');
    const [ eventLocation, setEventLocation ] = useState('');
    const [ eventDate, setEventDate ] = useState('');
    const [ eventTime, setEventTime ] = useState('');
    const [ eventCapacity, setEventCapacity ] = useState(0);
    const [ eventImages, setEventImages ] = useState([]);
    const [ eventPrice, setEventPrice ] = useState('');
    const [ isPaidEvent, setIsPaidEvent ] = useState(false);
    const [ error, setError ] = useState(null); // Fixed error handling
    const [ petAllowance, setPetAllowance ] = useState(false);
    const [ refundAllowance, setRefundAllowance ] = useState(false);
    const [ refundPolicy, setRefundPolicy ] = useState('');
    const [ ageRestriction, setAgeRestriction ] = useState('All');
    const [ fbAvail, setFbAvail ] = useState(false);
    const [ merchAvailability, setMerchAvailability ] = useState(false);
    const [ alcAvail, setAlcAvail ] = useState(false);
    const [ alcInfo, setAlcInfo ] = useState('');


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("user is signed in.")
                setUserId(user.uid); // Store the user's UID
            } else {
                console.log("User is not signed in.");
            }
        });
        return () => unsubscribe(); // Clean up the listener on unmount
    }, []);

    const handleSubmit = async () => {

        console.log('Event button clicked');

        const eventData = {
            id: userId || 'defaultUserID', // Replace with a meaningful default if needed
            basicInfo: {
                title: eventTitle || 'Untitled Event',
                description: eventDescription || 'No description provided',
                location: eventLocation || 'Location not specified',
            },
            eventDetails: {
                date: eventDate || '2024-01-01', // Default to a specific date
                time: eventTime || '00:00', // Default to midnight
                capacity: eventCapacity || 0, // Default capacity to 0
                images: Array.from(eventImages).length > 0 ?
                    Array.from(eventImages).map(file => URL.createObjectURL(file)) :
                    ['defaultImageURL'], // Replace with a meaningful default image URL
                paidEvent: isPaidEvent || false, // Default to not a paid event
                eventPrice: isPaidEvent ? parseFloat(eventPrice.replace(/[^0-9.]/g, '')) || 0 : 0, // Default to 0 if not a paid event

            },
            policies: {
                petAllowance: petAllowance || false, // Default to no pets allowed
                refundAllowance: refundAllowance || false, // Default to no refunds allowed
                refundPolicy: refundAllowance ? refundPolicy || 'No refund policy specified' : null,
                ageRestriction: ageRestriction || 'No age restriction', // Default to no restrictions
            },
            availability: {
                fbAvail: fbAvail || false, // Default to false
                merchAvailability: merchAvailability || false, // Default to false
                alcAvail: alcAvail || false, // Default to false
                alcInfo: alcAvail ? alcInfo || 'No additional alcohol information' : null,
            },
            timestamps: {
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
        };


        try {
            console.log('Event Data:', eventData);
            await eventCreation.writeEventData(eventData);
            setError(null);
            // resetForm();
        } catch (error) {
            setError(error.message);
        }
    };

    const resetForm = () => {
        setEventTitle('');
        setEventDescription('');
        setEventLocation('');
        setEventDate('');
        setEventTime('');
        setEventCapacity(0);
        setEventImages([]);
        setEventPrice('');
        setIsPaidEvent(false);
        setPetAllowance(false);
        setRefundAllowance(false);
        setRefundPolicy('');
        setAgeRestriction('All');
        setFbAvail(false);
        setMerchAvailability(false);
        setAlcAvail(false);
        setAlcInfo('');
    };

    return (
        <>
            <div className="event-creation-page p-4" >
                <div className="box-border rounded-lg bg-slate-300 p-6" >
                    <h1 className="text-4xl text-slate-900 font-bold pb-3" >Create Your Event</h1 >
                    {error && <div className="text-red-500" >{error}</div >} {/* Display error messages */}
                    <form onSubmit={handleSubmit} className="flex flex-col space-y-4 pt-4" >
                        {/* Title Input */}
                        <div className="flex flex-col" >
                            <label htmlFor="eventTitle" className="text-italic font-bold text-slate-900" >Title</label >
                            <input
                                type="text"
                                id="eventTitle"
                                value={eventTitle}
                                onChange={(e) => setEventTitle(e.target.value)}
                                placeholder="Enter event title"
                                className="pb-3 rounded-lg border border-slate-300 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                                required
                            />
                        </div >
                        {/* Description Input */}
                        <div className="flex flex-col" >
                            <label htmlFor="eventDescription"
                                   className="text-italic font-bold text-slate-900" >Description</label >
                            <input
                                id="eventDescription"
                                value={eventDescription}
                                onChange={(e) => setEventDescription(e.target.value)}
                                placeholder="Enter event description"
                                className="pb-3 rounded-lg border border-slate-300 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                                required
                            />
                        </div >
                        {/* Location Input */}
                        <div className="flex flex-col" >
                            <label htmlFor="eventLocation"
                                   className="text-italic font-bold text-slate-900" >Location</label >
                            <input
                                type="text"
                                id="eventLocation"
                                value={eventLocation}
                                onChange={(e) => setEventLocation(e.target.value)}
                                placeholder="Enter event location"
                                className="rounded-lg border border-slate-300 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                                required
                            />
                        </div >
                        {/* Date and Time Inputs */}
                        <div className="flex flex-row items-center pt-3" >
                            <label htmlFor="eventDate"
                                   className="text-italic font-bold text-slate-900 mr-4" >Date</label >
                            <input
                                type="date"
                                id="eventDate"
                                value={eventDate}
                                onChange={(e) => setEventDate(e.target.value)}
                                className="pb-3 rounded-lg w-full border border-slate-300 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                                required
                            />
                            <label htmlFor="eventTime"
                                   className="pe-3 text-italic font-bold text-slate-900 ml-4" >Time</label >
                            <input
                                type="time"
                                id="eventTime"
                                value={eventTime}
                                onChange={(e) => setEventTime(e.target.value)}
                                className="pb-3 rounded-lg w-full border border-slate-300 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                                required
                            />
                        </div >
                        {/* Capacity Input */}
                        <div className="flex flex-col" >
                            <label htmlFor="eventCapacity"
                                   className="text-italic font-bold text-slate-900" >Capacity</label >
                            <input
                                type="number"
                                id="eventCapacity"
                                value={eventCapacity}
                                onChange={(e) => {
                                    const parsedValue = parseInt(e.target.value, 10) || 0;
                                    setEventCapacity(Math.max(parsedValue, 0));
                                }}
                                placeholder="Enter event capacity"
                                className="pb-3 w-72 rounded-lg border border-slate-300 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 text-center"
                                required
                            />
                        </div >
                        {/* Image Input */}
                        <div className="flex flex-col" >
                            <label htmlFor="eventImages"
                                   className="text-italic font-bold text-slate-900" >Image</label >
                            <input
                                type="file"
                                id="eventImages"
                                accept="image/*"
                                multiple
                                onChange={(e) => setEventImages(e.target.files)}
                                className="pb-3 rounded-lg border border-slate-300 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                            />
                        </div >
                        {/* Paid Event Selection */}
                        <div className="flex flex-col" >
                            <label htmlFor="isPaidEvent" className="text-italic font-bold text-slate-900" >
                                Is this a paid event?
                            </label >

                            <select id="isPaidEvent" value={isPaidEvent} onChange={() => {
                                setIsPaidEvent(!isPaidEvent)
                                if (!isPaidEvent) {
                                    setEventPrice('')
                                    setRefundAllowance(false)
                                    setRefundPolicy('')
                                }
                            }}
                                    className="rounded-lg w-44 h-12 text-2xl text-center" >
                                <option value={true} >Yes</option >
                                <option value={false} >No</option >
                            </select >

                            {isPaidEvent && (
                                <div className="flex flex-col" >
                                    <label htmlFor="eventPrice" className="pt-3 text-italic font-bold text-slate-900" >
                                        Ticket Price
                                    </label >
                                    <input
                                        type="text"
                                        id="eventPrice"
                                        value={eventPrice}
                                        onChange={(e) => {
                                            const price = e.target.value.replace(/[^0-9.]/g, '');
                                            setEventPrice(`$${price}`);
                                        }}
                                        placeholder="Enter ticket price"
                                        className="w-44 rounded-lg border border-slate-300 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                                    />
                                </div >
                            )}
                        </div >

                        {isPaidEvent && (
                            <div className="flex flex-col" >
                                <label htmlFor="refundAllowance" className="text-italic font-bold text-slate-900" >
                                    Allow Refunds?
                                </label >
                                <select id="refundAllowance" value={refundAllowance}
                                        onChange={() => {
                                            setRefundAllowance(!refundAllowance)
                                            if (!refundAllowance) {
                                                setRefundPolicy('')
                                            }
                                        }}
                                        className="rounded-lg w-44 h-12 text-2xl text-center" >
                                    <option value={true} >Yes</option >
                                    <option value={false} >No</option >
                                </select >

                                {refundAllowance && (
                                    <div className="flex flex-col" >
                                        <label htmlFor="refundPolicy"
                                               className="pt-3 text-italic font-bold text-slate-900" >
                                            Refund Policy
                                        </label >
                                        <input
                                            type="text"
                                            id="refundPolicy"
                                            value={refundPolicy}
                                            onChange={(e) => setRefundPolicy(e.target.value)}
                                            placeholder="Enter refund policy"
                                            className="rounded-lg border border-slate-300 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                                        />
                                    </div >
                                )}
                            </div >
                        )}

                        <div className="flex flex-col" >
                            <label htmlFor="petAllowance" className="text-italic font-bold text-slate-900" >
                                Allow Pets?
                            </label >
                            <select id="petAllowance" value={petAllowance}
                                    onChange={() => setPetAllowance(!petAllowance)}
                                    className="rounded-lg w-44 h-12 text-2xl text-center" >
                                <option value={true} >Yes</option >
                                <option value={false} >No</option >
                            </select >
                        </div >

                        <div className="flex flex-col" >
                            <label htmlFor="ageRestriction" className="text-italic font-bold text-slate-900" >
                                What ages are allowed?
                            </label >
                            <select id="ageRestriction" value={ageRestriction}
                                    onChange={(e) => setAgeRestriction(e.target.value)}
                                    className="rounded-lg w-44 h-12 text-2xl text-center" >
                                <option value={'All'} >All</option >
                                <option value={'13+'} >13+</option >
                                <option value={'18+'} >18+</option >
                                <option value={'21+'} >21+</option >
                                ß
                            </select >
                        </div >

                        <div className="flex flex-col" >
                            <label htmlFor="fbAvail" className="text-italic font-bold text-slate-900" >
                                Is food and beverage available for purchase?
                            </label >
                            <select id="fbAvail" value={fbAvail}
                                    onChange={() => setFbAvail(!fbAvail)}
                                    className="rounded-lg w-44 h-12 text-2xl text-center" >
                                <option value={true} >Yes</option >
                                <option value={false} >No</option >
                            </select >

                        </div >

                        <div className="flex flex-col" >
                            <label htmlFor="merchAvailability" className="text-italic font-bold text-slate-900" >
                                Is merchandise available for purchase?
                            </label >
                            <select id="merchAvailability" value={merchAvailability}
                                    onChange={() => setMerchAvailability(!merchAvailability)}
                                    className="rounded-lg w-44 h-12 text-2xl text-center" >
                                <option value={true} >Yes</option >
                                <option value={false} >No</option >
                            </select >

                        </div >

                        <div className="flex flex-col" >
                            <label htmlFor="alcAvail" className="text-italic font-bold text-slate-900" >
                                Is alcohol allowed on premises?
                            </label >
                            <select id="alcAvail" value={alcAvail}
                                    onChange={() => setAlcAvail(!alcAvail)}
                                    className="rounded-lg w-44 h-12 text-2xl text-center" >
                                <option value={true} >Yes</option >
                                <option value={false} >No</option >
                            </select >
                            {alcAvail && (
                                <div className="flex flex-col" >
                                    <label htmlFor="alcInfo" className="text-italic font-bold text-slate-900" >
                                        Is alcohol available for purchase or BYOB?
                                    </label >
                                    <select id="alcInfo" value={alcInfo}
                                            onChange={(e) => setAlcInfo(e.target.value)}
                                            className="rounded-lg w-44 h-12 text-2xl text-center" >
                                        <option value={'Available'} >Available</option >
                                        <option value={'BYOB'} >BYOB</option >
                                    </select >
                                </div >
                            )}
                        </div >
                        {/* Submit Button */}
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            className="mt-6 rounded-lg bg-indigo-600 py-2 text-white hover:bg-indigo-700"
                        >
                            Create Event
                        </button >
                    </form >
                </div >
            </div >
        </>
    );
}

export default EventCreationPage;
