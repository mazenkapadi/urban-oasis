import React, { useEffect, useState } from 'react';
import eventCreation from "../services/eventCreation.js";
import { auth, storage } from "../firebaseConfig.js";
import { onAuthStateChanged } from "firebase/auth";
import { Timestamp } from "firebase/firestore";
import { PhotoIcon } from "@heroicons/react/24/outline/index.js";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import FooterComponent from "../components/FooterComponent.jsx";
import HeaderComponent from "../components/HeaderComponent.jsx";
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { googleMapsConfig } from "../locationConfig.js";
import { Modal, Button, ImageList, ImageListItem, Alert } from '@mui/material';

function EventCreationPage() {

    const [ hostId ] = useState('defaultUserID');
    const [ userId, setUserId ] = useState(null);
    const [ eventTitle, setEventTitle ] = useState('');
    const [ eventDescription, setEventDescription ] = useState('');
    const [ eventLocation, setEventLocation ] = useState('');
    const [ eventDateTime, setEventDateTime ] = useState('');
    const [ eventCapacity, setEventCapacity ] = useState(null);
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
    const [ modalOpen, setModalOpen ] = useState(false);
    const [ previewImages, setPreviewImages ] = useState(false);
    const [ eventImagesUrls, setEventImagesUrls ] = useState([]);
    const [ selectedPrimaryCategory, setSelectedPrimaryCategory ] = useState('');
    const [ selectedSubcategories, setSelectedSubcategories ] = useState([]);
    const categorizedOptions = {
        'Arts & Entertainment': [
            'Music', 'Art', 'Comedy', 'Theater & Performing Arts',
            'Film & Media', 'Photography & Art Exhibits', 'Opera',
        ],
        'Business & Networking': [
            'Business', 'Networking', 'Politics & Activism',
            'Charity & Fundraisers', 'Conferences',
        ],
        'Education & Innovation': [
            'Technology', 'Science & Innovation', 'Education',
            'Workshops & Classes', 'Talks & Seminars', 'Online Courses'
        ],
        'Lifestyle & Wellness': [
            'Health', 'Spirituality & Wellness', 'Family & Kids',
            'Fashion & Beauty', 'Mental Health',
        ],
        'Food & Leisure': [
            'Food & Drink', 'Cooking & Culinary', 'Shopping & Markets',
            'Travel & Outdoor', 'Wine Tasting', 'Dining Experiences'
        ],
        'Sports & Recreation': [
            'Sports', 'Gaming & E-sports', 'Fitness & Training',
            'Adventure Sports', 'Hiking & Nature',
        ],
    };
    const [ eventTitleEmpty, setEventTitleEmpty ] = useState(false);
    const [ eventDescriptionEmpty, setEventDescriptionEmpty ] = useState(false);
    const [ eventLocationEmpty, setEventLocationEmpty ] = useState(false);
    const [ eventDateTimeEmpty, setEventDateTimeEmpty ] = useState(false);
    const [ eventCapacityEmpty, setEventCapacityEmpty ] = useState(false);


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("User is signed in.");
                setUserId(user.uid); // Store the user's UID
            } else {
                console.log("User is not signed in.");
            }
        });
        return () => unsubscribe();
    }, []);

    const handleFileChange = (e) => {
        setPreviewImages(true);
        const imagesArray = Array.from(e.target.files);
        const imageUrls = imagesArray.map(image => URL.createObjectURL(image));
        setEventImages(imagesArray);
        setEventImagesUrls(imageUrls);
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
            setTimeout(() => {
                resetForm();
            }, 5000);

            return imageUrls;
        } catch (error) {
            console.error("Error uploading images:", error);
            throw error;
        }
    };

    const handlePrimaryCategoryChange = (e) => {
        const selectedCategory = e.target.value;
        setSelectedPrimaryCategory(selectedCategory);
        setSelectedSubcategories([]); // Reset subcategories when a new primary category is selected
    };

    const handleSubcategoryChange = (subcategory) => {
        setSelectedSubcategories((prev) =>
            prev.includes(subcategory)
                ? prev.filter((item) => item !== subcategory)
                : [ ...prev, subcategory ]
        );
    };

    const handleSubmit = async () => {
        const eventDateTimeTimestamp = Timestamp.fromDate(new Date(eventDateTime));
        try {
            const uploadedImages = await handleImageUpload(eventTitle, eventImages);
            const categories = selectedSubcategories.length > 0 ? selectedSubcategories : [ 'Uncategorized' ];

            if (eventTitle === "" || eventDescription === "" || eventLocation === "" || eventDateTime === "" || eventCapacity === null) {
                if (eventTitle === "") {
                    setEventTitleEmpty(true);
                } else setEventTitleEmpty(false);
                if (eventDescription === "") {
                    setEventDescriptionEmpty(true);
                } else setEventDescriptionEmpty(false);
                if (eventLocation === "") {
                    setEventLocationEmpty(true);
                } else setEventLocationEmpty(false);
                if (eventDateTime === "") {
                    setEventDateTimeEmpty(true);
                } else setEventDateTimeEmpty(false);
                if (eventCapacity === null) {
                    setEventCapacityEmpty(true);
                } else setEventCapacityEmpty(false);
                return;
            }

            const eventData = {
                hostId: userId || 'defaultUserID',
                attendeesCount: 0,
                basicInfo: {
                    title: eventTitle || 'Untitled Event',
                    description: eventDescription || 'No description provided',
                    location: eventLocation || 'Location not specified',
                    categories,
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
            await eventCreation.writeEventData(eventData);
            setError(null);
            setModalOpen(true);
            resetForm();
        } catch (error) {
            setError(error.message);
        }


    };

    const resetForm = () => {
        setEventTitle('');
        setEventDescription('');
        setEventLocation('');
        setEventDateTime('');
        setEventCapacity(null);
        setEventImages([]);
        setPreviewImages(false)
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
        setSelectedPrimaryCategory('');
        setSelectedSubcategories([]);
        setEventImagesUrls([]);
        setPreviewImages(false);
        setEventTitleEmpty(false);
        setEventDescriptionEmpty(false);
        setEventLocationEmpty(false);
        setEventLocationEmpty(false);
        setEventCapacityEmpty(false);
    };

    const handleModalClose = () => {
        setModalOpen(false);
        setTimeout(() => resetForm(), 3000);
    };


    return (
        <>
            <div className="event-creation-page" >
                <HeaderComponent />

                <div
                    className="flex justify-center items-center py-10 px-4 pt-32 bg-gradient-to-r from-blue-500 via-blue-800 to-blue-600 min-h-screen" >
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
                                {eventTitleEmpty && (
                                    <Alert severity="error" >
                                        Event Title cannot be empty.
                                    </Alert >
                                )}

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
                                {eventDescriptionEmpty && (
                                    <Alert severity="error" >
                                        Event Description cannot be empty.
                                    </Alert >
                                )}

                                {/* Location */}
                                <div >
                                    <label htmlFor="eventLocation"
                                           className="text-lg font-semibold text-white" >Location</label >
                                    <GooglePlacesAutocomplete
                                        required
                                        apiKey={googleMapsConfig.apiKey}
                                        selectProps={{
                                            value: eventLocation, onChange: setEventLocation,
                                            styles: {
                                                placeholder: (base) => ({
                                                    ...base,
                                                    color: '#9CA3AF'
                                                }),
                                                control: (provided, state) => ({
                                                    ...provided,
                                                    backgroundColor: '#1F2937',
                                                    borderColor: state.isFocused ? '#6366F1' : '#374151',
                                                    borderWidth: state.isFocused ? '2px' : '1px',
                                                    width: '100%',
                                                    marginTop: '2px',
                                                    padding: '3px',
                                                    borderRadius: '6px',
                                                }),
                                                menu: (provided) => ({
                                                    ...provided,
                                                    backgroundColor: '#1F2937',
                                                    borderColor: '#374151',
                                                    maxHeight: "200px",
                                                    overflowY: "auto",
                                                }),
                                                input: (provided) => ({
                                                    ...provided,
                                                    color: "white",
                                                    border: 'none',
                                                }),
                                                option: (provided, state) => ({
                                                    ...provided,
                                                    color: state.isFocused ? "#6366F1" : "white",
                                                    backgroundColor: state.isFocused ? "#374151" : "#1F2937",
                                                    cursor: "pointer",
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
                                </div >
                                {eventLocationEmpty && (
                                    <Alert severity="error" >
                                        Event Location cannot be empty.
                                    </Alert >
                                )}

                                {/* Date and Capacity */}
                                <div className="flex space-x-4" >
                                    <div className="flex-1" >
                                        <label htmlFor="eventDateTime" className="text-lg font-semibold text-white" >Event
                                            Date
                                            and Time</label >
                                        <div className="relative mt-2" >
                                            <input
                                                type="datetime-local"
                                                id="eventDateTime"
                                                value={eventDateTime}
                                                onChange={(e) => setEventDateTime(e.target.value)}
                                                className="w-full p-3 rounded-md border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                required
                                            />
                                            {/*<div*/}
                                            {/*    className="absolute inset-y-0 right-3 flex items-center text-gray-400 pointer-events-none" >*/}
                                            {/*    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"*/}
                                            {/*         viewBox="0 0 24 24" stroke="currentColor" >*/}
                                            {/*        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}*/}
                                            {/*              d="M8 7V3m8 4V3m-9 4h10M3 21h18a2 2 0 002-2V7a2 2 0 00-2-2H3a2 2 0 00-2 2v12a2 2 0 002 2z" />*/}
                                            {/*    </svg >*/}
                                            {/*</div >*/}
                                        </div >
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
                                <div className="flex space-x-4" >
                                    <div className="flex-1" >
                                        {eventDateTimeEmpty && (
                                            <Alert severity="error" >
                                                Event Date and Time cannot be empty.
                                            </Alert >
                                        )}
                                    </div >
                                    <div className="flex-1" >
                                        {eventCapacityEmpty && (
                                            <Alert severity="error" >
                                                Event Capacity cannot be empty.
                                            </Alert >
                                        )}
                                    </div >
                                </div >


                                {/* Image Upload */}
                                <div >
                                    <label htmlFor="eventImages" className="text-lg font-semibold text-white" >Upload
                                        Event
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
                                                onChange={handleFileChange}
                                                className="sr-only"
                                            />
                                        </label >
                                    </div >
                                </div >

                                {/* Image Preview */}
                                {previewImages && (
                                    <>
                                        <div >
                                            <label htmlFor="previewImages"
                                                   className="text-lg font-semibold text-white" >Event
                                                Images</label >
                                            <div className="mt-2" >
                                                <label
                                                    htmlFor="previewImages"
                                                    className="flex items-center justify-center w-full p-3 bg-gray-800 rounded-md border border-gray-700 cursor-pointer hover:bg-gray-700 transition-all"
                                                >
                                                    <ImageList sx={{width: 600, height: 200}} cols={3} rowHeight={200}
                                                               gap={10} >
                                                        {eventImagesUrls.map((item) => (
                                                            <ImageListItem key={item} >
                                                                <img
                                                                    srcSet={`${item}`}
                                                                    src={`${item}`}
                                                                    alt={item.name}
                                                                    loading="lazy"
                                                                />
                                                            </ImageListItem >
                                                        ))}
                                                    </ImageList >
                                                </label >
                                            </div >
                                        </div >
                                    </>
                                )}

                                {/* Paid Event */}
                                <div className="space-y-4" >
                                    <label htmlFor="isPaidEvent" className="text-lg font-semibold text-white" >
                                        Is this a paid event?</label >
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
                                                <label htmlFor="eventPrice"
                                                       className="text-lg font-semibold text-white" >Ticket
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
                                                <label htmlFor="refundAllowance"
                                                       className="text-lg font-semibold text-white" >Allow
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
                                        {
                                            label: "Alcohol Allowed?",
                                            id: "alcAvail",
                                            value: alcAvail,
                                            setter: setAlcAvail
                                        },
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
                                <div >
                                    <label className="text-lg font-semibold text-white" >Primary Category</label >
                                    {/* Dropdown for Primary Category Selection */}
                                    <select
                                        value={selectedPrimaryCategory}
                                        onChange={handlePrimaryCategoryChange}
                                        className="w-full mt-2 p-3 rounded-md border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="" >Select a Category</option >
                                        {Object.keys(categorizedOptions).map((category) => (
                                            <option key={category} value={category} >
                                                {category}
                                            </option >
                                        ))}
                                    </select >
                                </div >

                                {/* Subcategories Section */}
                                {selectedPrimaryCategory && (
                                    <div className="mt-4" >
                                        <label className="text-lg font-semibold text-white" >
                                            {selectedPrimaryCategory} Subcategories
                                        </label >
                                        <div className="grid grid-cols-2 gap-4 mt-2" >
                                            {categorizedOptions[selectedPrimaryCategory].map((subcategory) => (
                                                <label key={subcategory}
                                                       className="text-white flex items-center space-x-2" >
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedSubcategories.includes(subcategory)}
                                                        onChange={() => handleSubcategoryChange(subcategory)}
                                                        className="form-checkbox h-4 w-4 text-indigo-500"
                                                    />
                                                    <span >{subcategory}</span >
                                                </label >
                                            ))}
                                        </div >
                                    </div >
                                )}


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

                <Modal
                    open={modalOpen}
                    onClose={handleModalClose}
                >
                    <div
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 bg-neutral-white rounded-lg shadow-lg p-8" >
                        <h2 className="text-h3 font-semibold text-neutral-black mb-4 text-center font-archivo" >
                            Event Created!
                        </h2 >
                        <p className="text-body text-detail-gray text-center mb-6 font-inter" >
                            Your event has been successfully created.
                        </p >
                        <Button
                            onClick={handleModalClose}
                            variant="contained"
                            color="primary"
                            className="mt-4 w-full bg-accent-blue hover:bg-accent-green text-neutral-white py-2 rounded-lg font-medium"
                        >
                            Close
                        </Button >
                    </div >
                </Modal >
                <FooterComponent />
            </div >
        </>
    );
}

export default EventCreationPage;