import { useEffect, useState } from 'react';
import eventCreation from "../services/eventCreation.js";
import { auth } from "../firebaseConfig.js";
import { onAuthStateChanged } from "firebase/auth";
import { Timestamp } from "firebase/firestore";
import "firebase/storage";
import {PhotoIcon} from "@heroicons/react/24/outline/index.js";

function EventCreationPage() {

    const [ userId, setUserId ] = useState(null); // Store the authenticated user's UID
    const [ eventTitle, setEventTitle ] = useState('');
    const [ eventDescription, setEventDescription ] = useState('');
    const [ eventLocation, setEventLocation ] = useState('');
    const [ eventDateTime, setEventDateTime ] = useState(''); // Store combined date and time
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
                console.log("User is signed in.");
                setUserId(user.uid); // Store the user's UID
            } else {
                console.log("User is not signed in.");
            }
        });
        return () => unsubscribe(); // Clean up the listener on unmount
    }, []);

    const handleSubmit = async () => {
        console.log('Event button clicked');

        // Combine eventDateTime into Firestore Timestamp
        const eventDateTimeTimestamp = Timestamp.fromDate(new Date(eventDateTime));

        const eventData = {
            userId: userId || 'defaultUserID', // Replace with a meaningful default if needed
            basicInfo: {
                title: eventTitle || 'Untitled Event',
                description: eventDescription || 'No description provided',
                location: eventLocation || 'Location not specified',
            },
            eventDetails: {
                eventDateTime: eventDateTimeTimestamp, // Use Firestore Timestamp for date and time
                capacity: eventCapacity || 0, // Default capacity to 0
                images: Array.from(eventImages).length > 0 ?
                    Array.from(eventImages).map(file => URL.createObjectURL(file)) :
                    [ 'defaultImageURL' ],
                paidEvent: isPaidEvent || false, // Default to not a paid event
                eventPrice: isPaidEvent ? parseFloat(eventPrice.replace(/[^0-9.]/g, '')) || 0 : 0,
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
                createdAt: Timestamp.now(), // Use Firestore Timestamp for creation
                updatedAt: Timestamp.now(), // Use Firestore Timestamp for update
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
        setEventDateTime('');
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

    // return (
    //     <div className="event-creation-page p-4" >
    //         <div className="box-border rounded-lg bg-slate-300 p-6" >
    //             <h1 className="text-4xl text-slate-900 font-bold pb-3" >Create Your Event</h1 >
    //             {error && <div className="text-red-500" >{error}</div >} {/* Display error messages */}
    //             <div className="flex flex-col space-y-4 pt-4" >
    //                 {/* Title Input */}
    //                 <div className="flex flex-col" >
    //                     <label htmlFor="eventTitle" className="text-italic font-bold text-slate-900" >Title</label >
    //                     <input
    //                         type="text"
    //                         id="eventTitle"
    //                         value={eventTitle}
    //                         onChange={(e) => setEventTitle(e.target.value)}
    //                         placeholder="Enter event title"
    //                         className="pb-3 rounded-lg border border-slate-300 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
    //                         required
    //                     />
    //                 </div >
    //                 {/* Description Input */}
    //                 <div className="flex flex-col" >
    //                     <label htmlFor="eventDescription"
    //                            className="text-italic font-bold text-slate-900" >Description</label >
    //                     <input
    //                         id="eventDescription"
    //                         value={eventDescription}
    //                         onChange={(e) => setEventDescription(e.target.value)}
    //                         placeholder="Enter event description"
    //                         className="pb-3 rounded-lg border border-slate-300 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
    //                         required
    //                     />
    //                 </div >
    //                 {/* Location Input */}
    //                 <div className="flex flex-col" >
    //                     <label htmlFor="eventLocation"
    //                            className="text-italic font-bold text-slate-900" >Location</label >
    //                     <input
    //                         type="text"
    //                         id="eventLocation"
    //                         value={eventLocation}
    //                         onChange={(e) => setEventLocation(e.target.value)}
    //                         placeholder="Enter event location"
    //                         className="rounded-lg border border-slate-300 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
    //                         required
    //                     />
    //                 </div >
    //                 {/* Date and Time Input */}
    //                 <div className="flex flex-col" >
    //                     <label
    //                         htmlFor="eventDateTime"
    //                         className="font-bold text-slate-900 mb-2"
    //                     >
    //                         Event Date and Time
    //                     </label >
    //                     <input
    //                         type="datetime-local"
    //                         id="eventDateTime"
    //                         value={eventDateTime}
    //                         onChange={(e) => setEventDateTime(e.target.value)}
    //                         className="rounded-lg border border-slate-300 py-2 px-4 text-slate-700 bg-white hover:bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-sm transition-colors duration-300"
    //                         required
    //                     />
    //                 </div >
    //
    //                 <div className="flex flex-col" >
    //                     <label htmlFor="eventCapacity"
    //                            className="text-italic font-bold text-slate-900" >Capacity</label >
    //                     <input
    //                         type="number"
    //                         id="eventCapacity"
    //                         value={eventCapacity}
    //                         onChange={(e) => {
    //                             const parsedValue = parseInt(e.target.value, 10) || 0;
    //                             setEventCapacity(Math.max(parsedValue, 0));
    //                         }}
    //                         placeholder="Enter event capacity"
    //                         className="pb-3 w-72 rounded-lg border border-slate-300 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 text-center"
    //                         required
    //                     />
    //                 </div >
    //                 {/* Image Input */}
    //                 <div className="flex flex-col" >
    //                     <label htmlFor="eventImages"
    //                            className="text-italic font-bold text-slate-900" >Image</label >
    //                     <input
    //                         type="file"
    //                         id="eventImages"
    //                         accept="image/*"
    //                         multiple
    //                         onChange={(e) => setEventImages(e.target.files)}
    //                         className="pb-3 rounded-lg border border-slate-300 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
    //                     />
    //                 </div >
    //                 {/* Paid Event Selection */}
    //                 <div className="flex flex-col" >
    //                     <label htmlFor="isPaidEvent" className="text-italic font-bold text-slate-900" >
    //                         Is this a paid event?
    //                     </label >
    //
    //                     <select id="isPaidEvent" value={isPaidEvent} onChange={() => {
    //                         setIsPaidEvent(!isPaidEvent)
    //                         if (!isPaidEvent) {
    //                             setEventPrice('')
    //                             setRefundAllowance(false)
    //                             setRefundPolicy('')
    //                         }
    //                     }}
    //                             className="rounded-lg w-44 h-12 text-2xl text-center" >
    //                         <option value={true} >Yes</option >
    //                         <option value={false} >No</option >
    //                     </select >
    //
    //                     {isPaidEvent && (
    //                         <div className="flex flex-col" >
    //                             <label htmlFor="eventPrice" className="pt-3 text-italic font-bold text-slate-900" >
    //                                 Ticket Price
    //                             </label >
    //                             <input
    //                                 type="text"
    //                                 id="eventPrice"
    //                                 value={eventPrice}
    //                                 onChange={(e) => {
    //                                     const price = e.target.value.replace(/[^0-9.]/g, '');
    //                                     setEventPrice(`$${price}`);
    //                                 }}
    //                                 placeholder="Enter ticket price"
    //                                 className="w-44 rounded-lg border border-slate-300 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
    //                             />
    //                         </div >
    //                     )}
    //                 </div >
    //
    //                 {isPaidEvent && (
    //                     <div className="flex flex-col" >
    //                         <label htmlFor="refundAllowance" className="text-italic font-bold text-slate-900" >
    //                             Allow Refunds?
    //                         </label >
    //                         <select id="refundAllowance" value={refundAllowance}
    //                                 onChange={() => {
    //                                     setRefundAllowance(!refundAllowance)
    //                                     if (!refundAllowance) {
    //                                         setRefundPolicy('')
    //                                     }
    //                                 }}
    //                                 className="rounded-lg w-44 h-12 text-2xl text-center" >
    //                             <option value={true} >Yes</option >
    //                             <option value={false} >No</option >
    //                         </select >
    //
    //                         {refundAllowance && (
    //                             <div className="flex flex-col" >
    //                                 <label htmlFor="refundPolicy"
    //                                        className="pt-3 text-italic font-bold text-slate-900" >
    //                                     Refund Policy
    //                                 </label >
    //                                 <input
    //                                     type="text"
    //                                     id="refundPolicy"
    //                                     value={refundPolicy}
    //                                     onChange={(e) => setRefundPolicy(e.target.value)}
    //                                     placeholder="Enter refund policy"
    //                                     className="rounded-lg border border-slate-300 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
    //                                 />
    //                             </div >
    //                         )}
    //                     </div >
    //                 )}
    //
    //                 <div className="flex flex-col" >
    //                     <label htmlFor="petAllowance" className="text-italic font-bold text-slate-900" >
    //                         Allow Pets?
    //                     </label >
    //                     <select id="petAllowance" value={petAllowance}
    //                             onChange={() => setPetAllowance(!petAllowance)}
    //                             className="rounded-lg w-44 h-12 text-2xl text-center" >
    //                         <option value={true} >Yes</option >
    //                         <option value={false} >No</option >
    //                     </select >
    //                 </div >
    //
    //                 <div className="flex flex-col" >
    //                     <label htmlFor="ageRestriction" className="text-italic font-bold text-slate-900" >
    //                         What ages are allowed?
    //                     </label >
    //                     <select id="ageRestriction" value={ageRestriction}
    //                             onChange={(e) => setAgeRestriction(e.target.value)}
    //                             className="rounded-lg w-44 h-12 text-2xl text-center" >
    //                         <option value={'All'} >All</option >
    //                         <option value={'13+'} >13+</option >
    //                         <option value={'18+'} >18+</option >
    //                         <option value={'21+'} >21+</option >
    //                     </select >
    //                 </div >
    //
    //                 <div className="flex flex-col" >
    //                     <label htmlFor="fbAvail" className="text-italic font-bold text-slate-900" >
    //                         Is food and beverage available for purchase?
    //                     </label >
    //                     <select id="fbAvail" value={fbAvail}
    //                             onChange={() => setFbAvail(!fbAvail)}
    //                             className="rounded-lg w-44 h-12 text-2xl text-center" >
    //                         <option value={true} >Yes</option >
    //                         <option value={false} >No</option >
    //                     </select >
    //
    //                 </div >
    //
    //                 <div className="flex flex-col" >
    //                     <label htmlFor="merchAvailability" className="text-italic font-bold text-slate-900" >
    //                         Is merchandise available for purchase?
    //                     </label >
    //                     <select id="merchAvailability" value={merchAvailability}
    //                             onChange={() => setMerchAvailability(!merchAvailability)}
    //                             className="rounded-lg w-44 h-12 text-2xl text-center" >
    //                         <option value={true} >Yes</option >
    //                         <option value={false} >No</option >
    //                     </select >
    //
    //                 </div >
    //
    //                 <div className="flex flex-col" >
    //                     <label htmlFor="alcAvail" className="text-italic font-bold text-slate-900" >
    //                         Is alcohol allowed on premises?
    //                     </label >
    //                     <select id="alcAvail" value={alcAvail}
    //                             onChange={() => setAlcAvail(!alcAvail)}
    //                             className="rounded-lg w-44 h-12 text-2xl text-center" >
    //                         <option value={true} >Yes</option >
    //                         <option value={false} >No</option >
    //                     </select >
    //                     {alcAvail && (
    //                         <div className="flex flex-col" >
    //                             <label htmlFor="alcInfo" className="text-italic font-bold text-slate-900" >
    //                                 Is alcohol available for purchase or BYOB?
    //                             </label >
    //                             <select id="alcInfo" value={alcInfo}
    //                                     onChange={(e) => setAlcInfo(e.target.value)}
    //                                     className="rounded-lg w-44 h-12 text-2xl text-center" >
    //                                 <option value={'Available'} >Available</option >
    //                                 <option value={'BYOB'} >BYOB</option >
    //                             </select >
    //                         </div >
    //                     )}
    //                 </div >
    //
    //                 {/* Submit button */}
    //                 <button onClick={handleSubmit} className="bg-indigo-500 text-white py-2 px-4 rounded-lg" >
    //                     Create Event
    //                 </button >
    //             </div >
    //         </div >
    //     </div >
    // );


    return (
        <div
            className="event-creation-page flex justify-center items-center py-10 px-4 bg-gradient-to-r from-blue-500 via-blue-800 to-blue-600 min-h-screen" >
            <div className="box-border w-full max-w-3xl rounded-lg bg-gray-900 shadow-lg p-8" >
                <h1 className="text-5xl text-white font-extrabold pb-6 text-center" >Create Your Event</h1 >

                {/* Error message */}
                {error && <div className="text-red-500 text-center mb-4" >{error}</div >}

                <div className="flex flex-col space-y-4 pt-4" >
                    <div className="flex flex-col space-y-6" >

                        {/* Event Title */}
                        <div >
                            <label htmlFor="eventTitle" className="text-lg font-semibold text-white" >Event
                                Title</label >
                            <input
                                type="text"
                                id="eventTitle"
                                value={eventTitle}
                                onChange={(e) => setEventTitle(e.target.value)}
                                placeholder="Enter event title"
                                className="w-full mt-2 p-3 rounded-md border border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                required
                            />
                        </div >

                        {/* Description */}
                        <div >
                            <label htmlFor="eventDescription"
                                   className="text-lg font-semibold text-white" >Description</label >
                            <textarea
                                id="eventDescription"
                                value={eventDescription}
                                onChange={(e) => setEventDescription(e.target.value)}
                                placeholder="Enter event description"
                                className="w-full mt-2 p-3 rounded-md border border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                rows="4"
                                required
                            />
                        </div >

                        {/* Location */}
                        <div >
                            <label htmlFor="eventLocation"
                                   className="text-lg font-semibold text-white" >Location</label >
                            <input
                                type="text"
                                id="eventLocation"
                                value={eventLocation}
                                onChange={(e) => setEventLocation(e.target.value)}
                                placeholder="Enter event location"
                                className="w-full mt-2 p-3 rounded-md border border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                required
                            />
                        </div >

                        {/* Date and Capacity */}
                        <div className="flex space-x-4" >
                            <div className="flex-1" >
                                <label htmlFor="eventDateTime" className="text-lg font-semibold text-white" >Event Date
                                    and Time</label >
                                <input
                                    type="datetime-local"
                                    id="eventDateTime"
                                    value={eventDateTime}
                                    onChange={(e) => setEventDateTime(e.target.value)}
                                    className="w-full mt-2 p-3 rounded-md border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                            </div >
                            <div className="flex-1" >
                                <label htmlFor="eventCapacity"
                                       className="text-lg font-semibold text-white" >Capacity</label >
                                <input
                                    type="number"
                                    id="eventCapacity"
                                    value={eventCapacity}
                                    onChange={(e) => {
                                        const parsedValue = parseInt(e.target.value, 10) || 0;
                                        setEventCapacity(Math.max(parsedValue, 0));
                                    }}
                                    placeholder="Enter event capacity"
                                    className="w-full mt-2 p-3 rounded-md border border-gray-700 bg-gray-800 text-white text-center focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                            </div >
                        </div >

                        {/* Image Upload */}
                        <div >
                            <label htmlFor="eventImages" className="text-lg font-semibold text-white" >Upload Event
                                Images</label >
                            <div className="mt-2" >
                                <label
                                    htmlFor="eventImages"
                                    className="flex items-center justify-center w-full p-3 bg-gray-800 rounded-md border border-gray-700 cursor-pointer hover:bg-gray-700 transition-all"
                                >
                                    <PhotoIcon className="h-6 w-6 text-white mr-2" />
                                    <span className="text-white" >Choose Images</span >
                                    <input
                                        type="file"
                                        id="eventImages"
                                        accept="image/*"
                                        multiple
                                        onChange={(e) => setEventImages(e.target.files)}
                                        className="sr-only"
                                    />
                                </label >
                            </div >
                        </div >

                        {/* Paid Event */}
                        <div className="space-y-4" >
                            <label htmlFor="isPaidEvent" className="text-lg font-semibold text-white" >Is this a paid
                                event?</label >
                            <select
                                id="isPaidEvent"
                                value={isPaidEvent}
                                onChange={() => {
                                    setIsPaidEvent(!isPaidEvent);
                                    if (!isPaidEvent) {
                                        setEventPrice('');
                                        setRefundAllowance(false);
                                        setRefundPolicy('');
                                    }
                                }}
                                className="w-full mt-2 p-3 rounded-md border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value={true} >Yes</option >
                                <option value={false} >No</option >
                            </select >

                            {isPaidEvent && (
                                <>
                                    <div >
                                        <label htmlFor="eventPrice" className="text-lg font-semibold text-white" >Ticket
                                            Price</label >
                                        <input
                                            type="text"
                                            id="eventPrice"
                                            value={eventPrice}
                                            onChange={(e) => {
                                                const price = e.target.value.replace(/[^0-9.]/g, '');
                                                setEventPrice(`$${price}`);
                                            }}
                                            placeholder="Enter ticket price"
                                            className="w-full mt-2 p-3 rounded-md border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div >

                                    <div >
                                        <label htmlFor="refundAllowance" className="text-lg font-semibold text-white" >Allow
                                            Refunds?</label >
                                        <select
                                            id="refundAllowance"
                                            value={refundAllowance}
                                            onChange={() => {
                                                setRefundAllowance(!refundAllowance);
                                                if (!refundAllowance) setRefundPolicy('');
                                            }}
                                            className="w-full mt-2 p-3 rounded-md border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        >
                                            <option value={true} >Yes</option >
                                            <option value={false} >No</option >
                                        </select >

                                        {refundAllowance && (
                                            <div >
                                                <label htmlFor="refundPolicy"
                                                       className="text-lg font-semibold text-white" >Refund
                                                    Policy</label >
                                                <input
                                                    type="text"
                                                    id="refundPolicy"
                                                    value={refundPolicy}
                                                    onChange={(e) => setRefundPolicy(e.target.value)}
                                                    placeholder="Enter refund policy"
                                                    className="w-full mt-2 p-3 rounded-md border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                />
                                            </div >
                                        )}
                                    </div >
                                </>
                            )}
                        </div >

                        {/* Other options */}
                        <div className="grid grid-cols-2 gap-4" >
                            {[
                                {
                                    label: "Allow Pets?",
                                    id: "petAllowance",
                                    value: petAllowance,
                                    setter: setPetAllowance
                                },
                                {
                                    label: "Food/Beverage Availability",
                                    id: "fbAvail",
                                    value: fbAvail,
                                    setter: setFbAvail
                                },
                                {
                                    label: "Merchandise Available?",
                                    id: "merchAvailability",
                                    value: merchAvailability,
                                    setter: setMerchAvailability
                                },
                                {label: "Alcohol Allowed?", id: "alcAvail", value: alcAvail, setter: setAlcAvail},
                            ].map((item, index) => (
                                <div key={index} >
                                    <label htmlFor={item.id}
                                           className="text-lg font-semibold text-white" >{item.label}</label >
                                    <select
                                        id={item.id}
                                        value={item.value}
                                        onChange={() => item.setter(!item.value)}
                                        className="w-full mt-2 p-3 rounded-md border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value={true} >Yes</option >
                                        <option value={false} >No</option >
                                    </select >
                                </div >
                            ))}
                        </div >

                        {/* Submit Button */}
                        <button
                            onClick={handleSubmit}
                            className="mt-6 w-full bg-indigo-500 text-white font-bold py-3 rounded-md hover:bg-indigo-600 transition duration-300"
                        >
                            Create Event
                        </button >
                    </div >
                </div >
            </div >
        </div >
    );

}

export default EventCreationPage;
