import React, {useEffect, useState} from 'react';
import eventCreation from "../services/eventCreation.js";
import {auth, storage} from "../firebaseConfig.js";
import {onAuthStateChanged} from "firebase/auth";
import {Timestamp} from "firebase/firestore";
import {PhotoIcon} from "@heroicons/react/24/outline/index.js";
import {getDownloadURL, ref, uploadBytes} from "firebase/storage";
import FooterComponent from "../components/FooterComponent.jsx";
import HeaderComponent from "../components/HeaderComponent.jsx";
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import {googleMapsConfig} from "../locationConfig.js";
import {useNavigate} from "react-router-dom";

function EventCreationPage() {

    const [hostId] = useState('defaultUserID'); // Store the authenticated user's UID
    const [userId, setUserId] = useState(null); // Store the authenticated user's UID
    const [eventTitle, setEventTitle] = useState('');
    const [eventDescription, setEventDescription] = useState('');
    const [eventLocation, setEventLocation] = useState('');
    const [eventDateTime, setEventDateTime] = useState(''); // Store combined date and time
    const [eventCapacity, setEventCapacity] = useState(0);
    const [eventImages, setEventImages] = useState([]);
    const [eventPrice, setEventPrice] = useState('');
    const [isPaidEvent, setIsPaidEvent] = useState(false);
    const [error, setError] = useState(null); // Fixed error handling
    const [petAllowance, setPetAllowance] = useState(false);
    const [refundAllowance, setRefundAllowance] = useState(false);
    const [refundPolicy, setRefundPolicy] = useState('');
    const [ageRestriction, setAgeRestriction] = useState('All');
    const [fbAvail, setFbAvail] = useState(false);
    const [merchAvailability, setMerchAvailability] = useState(false);
    const [alcAvail, setAlcAvail] = useState(false);
    const [alcInfo, setAlcInfo] = useState('');
    const [selectedLocation, setSelectedLocation] = useState(null);

    const navigate = useNavigate();

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

    const handleFileChange = (e) => {
        const imagesArray = Array.from(e.target.files);
        setEventImages(imagesArray);
    };

    const handleImageUpload = async (eventTitle, imageFiles) => {
        if (!imageFiles || !imageFiles.length) {
            setEventImages([]);
            return [];
        }

        try {
            const imageUrls = await Promise.all(
                Array.from(imageFiles).map(async (imageFile) => {
                    const storageRef = ref(storage, `eventImages/${eventTitle}/${imageFile.name}`);

                    await uploadBytes(storageRef, imageFile);
                    const imageUrl = await getDownloadURL(storageRef);

                    return {
                        name: imageFile.name,
                        url: imageUrl,
                    };
                })
            );

            setEventImages(imageUrls);
            return imageUrls;
        } catch (error) {
            console.error("Error uploading images:", error);
            throw error;
        }
    };


    const handleSubmit = async () => {
        console.log('Event button clicked');

        const eventDateTimeTimestamp = Timestamp.fromDate(new Date(eventDateTime));

        try {
            const uploadedImages = await handleImageUpload(eventTitle, eventImages);

            const eventData = {
                hostId: userId || 'defaultUserID',
                basicInfo: {
                    title: eventTitle || 'Untitled Event',
                    description: eventDescription || 'No description provided',
                    location: eventLocation || 'Location not specified',
                },
                eventDetails: {
                    eventDateTime: eventDateTimeTimestamp,
                    capacity: eventCapacity || 0,
                    images: uploadedImages,
                    paidEvent: isPaidEvent || false,
                    eventPrice: isPaidEvent ? parseFloat(eventPrice.replace(/[^0-9.]/g, '')) || 0 : 0,
                },
                policies: {
                    petAllowance: petAllowance || false,
                    refundAllowance: refundAllowance || false,
                    refundPolicy: refundAllowance ? refundPolicy || 'No refund policy specified' : null,
                    ageRestriction: ageRestriction || 'No age restriction',
                },
                availability: {
                    fbAvail: fbAvail || false,
                    merchAvailability: merchAvailability || false,
                    alcAvail: alcAvail || false,
                    alcInfo: alcAvail ? alcInfo || 'No additional alcohol information' : null,
                },
                timestamps: {
                    createdAt: Timestamp.now(),
                    updatedAt: Timestamp.now(),
                },
            };

            console.log("Final Event Data:", eventData);
            await eventCreation.writeEventData(eventData);
            setError(null);
            resetForm();
            const delayInMilliseconds = 2000; // 2 seconds
            setTimeout(() => {
                navigate(`/eventPage/${eventData.id}`); // Replace eventId with actual event ID
            }, delayInMilliseconds);
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

    const handleLocationChange = (suggestion) => {
        setEventLocation(suggestion.description); // Update form state
        setSelectedLocation(suggestion); // Update location details
    };

    const handleLocationBlur = (event) => {
        if (event.target.value !== selectedLocation?.description) {
            // Update selected location with the modified value
            setSelectedLocation({ ...selectedLocation, description: event.target.value });
        }
    };


    return (
        <>
            <div className="event-creation-page">
                <HeaderComponent/>

                <div
                    className="flex justify-center items-center py-10 px-4 pt-32 bg-gradient-to-r from-blue-500 via-blue-800 to-blue-600 min-h-screen">
                    <div className="box-border w-full max-w-3xl rounded-lg bg-gray-900 shadow-lg p-8">
                        <h1 className="text-5xl text-white font-extrabold pb-6 text-center">Create Your Event</h1>

                        {/* Error message */}
                        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

                        <div className="flex flex-col space-y-4 pt-4">
                            <div className="flex flex-col space-y-6">

                                {/* Event Title */}
                                <div>
                                    <label htmlFor="eventTitle" className="text-lg font-semibold text-white">Event
                                        Title</label>
                                    <input
                                        type="text"
                                        id="eventTitle"
                                        value={eventTitle}
                                        onChange={(e) => setEventTitle(e.target.value)}
                                        placeholder="Enter event title"
                                        className="w-full mt-2 p-3 rounded-md border border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label htmlFor="eventDescription"
                                           className="text-lg font-semibold text-white">Description</label>
                                    <textarea
                                        id="eventDescription"
                                        value={eventDescription}
                                        onChange={(e) => setEventDescription(e.target.value)}
                                        placeholder="Enter event description"
                                        className="w-full mt-2 p-3 rounded-md border border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        rows="4"
                                        required
                                    />
                                </div>

                                {/* Location */}
                                <div>
                                    <label htmlFor="eventLocation"
                                           className="text-lg font-semibold text-white">Location</label>
                                    <GooglePlacesAutocomplete
                                        required
                                        apiKey={googleMapsConfig.apiKey}
                                        selectProps={{
                                            value: eventLocation, onChange: setEventLocation,
                                            styles: {
                                                control: (provided, state) => ({
                                                    ...provided,
                                                    backgroundColor: '#1F2937',
                                                    borderColor: state.isFocused? '#6366F1': '#374151',
                                                    borderWidth: state.isFocused? '2px': '1px',
                                                    width: '100%',
                                                    marginTop: '2px',
                                                    padding: '3px',
                                                    borderRadius: '6px',
                                                }),
                                                menu: (provided) => ({
                                                    ...provided,
                                                    backgroundColor: '#1F2937',
                                                    borderColor: '#374151',
                                                }),
                                                input: (provided) => ({
                                                    ...provided,
                                                    color: "white",
                                                    border: 'none',
                                                }),
                                                option: (provided) => ({
                                                    ...provided,
                                                    color: "white",
                                                    backgroundColor: '#1F2937',
                                                }),
                                                singleValue: (provided) => ({
                                                    ...provided,
                                                    color: "white",
                                                    backgroundColor: '#1F2937',
                                                }),

                                            },
                                            placeholder: 'Enter location',
                                        }}

                                    />
                                </div>

                                {/* Date and Capacity */}
                                <div className="flex space-x-4">
                                    <div className="flex-1">
                                        <label htmlFor="eventDateTime" className="text-lg font-semibold text-white">Event
                                            Date
                                            and Time</label>
                                        <input
                                            type="datetime-local"
                                            id="eventDateTime"
                                            value={eventDateTime}
                                            onChange={(e) => setEventDateTime(e.target.value)}
                                            className="w-full mt-2 p-3 rounded-md border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            required
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label htmlFor="eventCapacity"
                                               className="text-lg font-semibold text-white">Capacity</label>
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
                                    </div>
                                </div>

                                {/* Image Upload */}
                                <div>
                                    <label htmlFor="eventImages" className="text-lg font-semibold text-white">Upload
                                        Event
                                        Images</label>
                                    <div className="mt-2">
                                        <label
                                            htmlFor="eventImages"
                                            className="flex items-center justify-center w-full p-3 bg-gray-800 rounded-md border border-gray-700 cursor-pointer hover:bg-gray-700 transition-all"
                                        >
                                            <PhotoIcon className="h-6 w-6 text-white mr-2"/>
                                            <span className="text-white">Choose Images</span>
                                            <input
                                                type="file"
                                                id="eventImages"
                                                accept="image/*"
                                                multiple
                                                onChange={handleFileChange}
                                                className="sr-only"
                                            />
                                        </label>
                                    </div>
                                </div>

                                {/* Paid Event */}
                                <div className="space-y-4">
                                    <label htmlFor="isPaidEvent" className="text-lg font-semibold text-white">Is
                                        this a
                                        paid
                                        event?</label>
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
                                        <option value={true}>Yes</option>
                                        <option value={false}>No</option>
                                    </select>

                                    {isPaidEvent && (
                                        <>
                                            <div>
                                                <label htmlFor="eventPrice"
                                                       className="text-lg font-semibold text-white">Ticket
                                                    Price</label>
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
                                            </div>

                                            <div>
                                                <label htmlFor="refundAllowance"
                                                       className="text-lg font-semibold text-white">Allow
                                                    Refunds?</label>
                                                <select
                                                    id="refundAllowance"
                                                    value={refundAllowance}
                                                    onChange={() => {
                                                        setRefundAllowance(!refundAllowance);
                                                        if (!refundAllowance) setRefundPolicy('');
                                                    }}
                                                    className="w-full mt-2 p-3 rounded-md border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                >
                                                    <option value={true}>Yes</option>
                                                    <option value={false}>No</option>
                                                </select>

                                                {refundAllowance && (
                                                    <div>
                                                        <label htmlFor="refundPolicy"
                                                               className="text-lg font-semibold text-white">Refund
                                                            Policy</label>
                                                        <input
                                                            type="text"
                                                            id="refundPolicy"
                                                            value={refundPolicy}
                                                            onChange={(e) => setRefundPolicy(e.target.value)}
                                                            placeholder="Enter refund policy"
                                                            className="w-full mt-2 p-3 rounded-md border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Other options */}
                                <div className="grid grid-cols-2 gap-4">
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
                                        {
                                            label: "Alcohol Allowed?",
                                            id: "alcAvail",
                                            value: alcAvail,
                                            setter: setAlcAvail
                                        },
                                    ].map((item, index) => (
                                        <div key={index}>
                                            <label htmlFor={item.id}
                                                   className="text-lg font-semibold text-white">{item.label}</label>
                                            <select
                                                id={item.id}
                                                value={item.value}
                                                onChange={() => item.setter(!item.value)}
                                                className="w-full mt-2 p-3 rounded-md border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            >
                                                <option value={true}>Yes</option>
                                                <option value={false}>No</option>
                                            </select>
                                        </div>
                                    ))}
                                </div>

                                {/* Submit Button */}
                                <button
                                    onClick={handleSubmit}
                                    className="mt-6 w-full bg-indigo-500 text-white font-bold py-3 rounded-md hover:bg-indigo-600 transition duration-300"
                                >
                                    Create Event
                                </button>
                            </div>
                        </div>

                    </div>


                </div>
                <FooterComponent/>
            </div>
        </>
    );

}

export default EventCreationPage;
