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
import { CalendarDaysIcon } from "@heroicons/react/24/outline";

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
    const [ eventLong, setEventLong ] = useState(0);
    const [ eventLat, setEventLat ] = useState(0);
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

    const geocodePlaceId = async (placeId)=> {
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
                _geoloc: {
                    lat: eventLat,
                    lng: eventLong,
                }
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
        setEventLong(0);
        setEventLat(0);
    };

    const handleModalClose = () => {
        setModalOpen(false);
        setTimeout(() => resetForm(), 3000);
    };

    const handleLocationChange = (value) => {
        setEventLocation(value);
        geocodePlaceId(value.value.place_id.toString());
    };


    return (
        <>

            <div className="event-creation-page" >

                <div
                    className="flex flex-col justify-center items-center pb-10 px-4 min-h-screen" style={{backgroundColor: 'var(--secondary-dark-2)'}} >
                    <HeaderComponent />


                    <div className="box-border w-full max-w-3xl rounded-lg bg-primary-dark shadow-lg p-8" >
                        <h1 className="text-5xl text-primary-light pb-6 text-center" >Create Your Event</h1 >

                        {/* Error message */}
                        {error && <div className="text-red-500 text-center mb-4" >{error}</div >}

                        <div className="flex flex-col space-y-4 pt-4" >
                            <div className="flex flex-col space-y-6" >

                                {/* Event Title */}
                                <div >
                                    <p htmlFor="eventTitle" className="text-lg font-semibold text-primary-light" >Event
                                        Title</p >
                                    <input
                                        type="text"
                                        id="eventTitle"
                                        value={eventTitle}
                                        onChange={(e) => setEventTitle(e.target.value)}
                                        placeholder="Enter event title"
                                        className="text-box w-full mt-2 p-3 text-box:focus"
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
                                    <p htmlFor="eventDescription"
                                           className="text-lg font-semibold text-primary-light" >Description</p >
                                    <textarea
                                        id="eventDescription"
                                        value={eventDescription}
                                        onChange={(e) => setEventDescription(e.target.value)}
                                        placeholder="Enter event description"
                                        className="w-full mt-2 p-3 text-box"
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
                                    <p htmlFor="eventLocation"
                                           className="text-lg font-semibold text-primary-light" >Location</p >
                                    <GooglePlacesAutocomplete
                                        required
                                        apiKey={googleMapsConfig.apiKey}
                                        selectProps={{
                                            value: eventLocation, onChange: handleLocationChange,
                                            styles: {
                                                placeholder: (base) => ({
                                                    ...base,
                                                    color: '#9ca3af',
                                                }),
                                                control: (provided, state) => ({
                                                    ...provided,
                                                    backgroundColor: 'var(--primary-light)',
                                                    borderColor: state.isFocused ? 'var(--secondary-light-1)' : 'var(--accent-blue)',
                                                    // borderWidth: state.isFocused ? '2px' : '1px',
                                                    width: '100%',
                                                    marginTop: '2px',
                                                    padding: '3px',
                                                    borderRadius: '6px',
                                                }),
                                                menu: (provided) => ({
                                                    ...provided,
                                                    backgroundColor: 'var(--primary-light)',
                                                    borderColor: 'var(--secondary-light-1)',
                                                    maxHeight: "200px",
                                                    overflowY: "auto",
                                                }),
                                                input: (provided) => ({
                                                    ...provided,
                                                    color: 'var(--primary-dark)',
                                                    border: 'none',
                                                }),
                                                option: (provided, state) => ({
                                                    ...provided,
                                                    color: state.isFocused ? 'var(--accent-blue)' : 'var(--primary-light)',
                                                    backgroundColor: state.isFocused ?  'var(--primary-light)' : 'var(--primary-dark)',
                                                    cursor: "pointer",
                                                }),
                                                singleValue: (provided) => ({
                                                    ...provided,
                                                    color: 'var(Dark-D1)',
                                                    backgroundColor: 'var(primary-light)',
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
                                        <p htmlFor="eventDateTime" className="text-lg font-semibold text-primary-light" >Event
                                            Date
                                            and Time</p >
                                        <div className="relative mt-2" >
                                            <input
                                                type="datetime-local"
                                                id="eventDateTime"
                                                value={eventDateTime}
                                                onChange={(e) => setEventDateTime(e.target.value)}
                                                className="w-full p-3 text-box"
                                                required
                                            />
                                            <div
                                                className="absolute inset-y-0 right-3 flex items-center text-primary-dark pointer-events-none" >

                                                < CalendarDaysIcon className=" h-5 w-5" />
                                            </div >
                                        </div >
                                    </div >
                                    <div className="flex-1" >
                                        <p htmlFor="eventCapacity"
                                               className="text-lg font-semibold text-primary-light" >Capacity</p >
                                        <input
                                            type="number"
                                            id="eventCapacity"
                                            value={eventCapacity}
                                            onChange={(e) => {
                                                const parsedValue = parseInt(e.target.value, 10) || 0;
                                                setEventCapacity(Math.max(parsedValue, 0));
                                            }}
                                            placeholder="Enter event capacity"
                                            className="w-full mt-2 p-3 text-box"
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


                                <div >
                                    <p htmlFor="eventImages" className="text-lg font-semibold text-primary-light" >Upload
                                        Event
                                        Images</p >
                                    <div className="mt-2" >
                                        <label
                                            htmlFor="eventImages"
                                            className="flex items-center justify-center w-full p-3 bg-primary-light rounded-md border border-secondary-dark-1 cursor-pointer hover:bg-secondary-dark-1 transition-all"
                                        >
                                            <PhotoIcon className="h-6 w-6 text-primary-dark mr-2" />
                                            <span className="text-primary-dark" >Choose Images</span >
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
                                            <p htmlFor="previewImages"
                                                   className="text-lg font-semibold text-primary-light" >Event
                                                Images</p >
                                            <div className="mt-2" >
                                                <label
                                                    htmlFor="previewImages"
                                                    className="flex items-center justify-center w-full p-3 bg-primary-light rounded-md border border-secondary-dark-1 cursor-pointer hover:bg-secondary-light-3 transition-all"
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
                                    <p htmlFor="isPaidEvent" className="text-lg font-semibold text-primary-light" >
                                        Is this a paid event?</p >
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
                                        className="w-full mt-2 p-3 rounded-md border border-secondary-dark-1 bg-primary-light text-primary-dark focus:outline-none focus:ring-2 focus:ring-accent-blue"
                                    >
                                        <option value={true} >Yes</option >
                                        <option value={false} >No</option >
                                    </select >

                                    {isPaidEvent && (
                                        <>
                                            <div >
                                                <p htmlFor="eventPrice"
                                                       className="text-lg font-semibold text-primary-light" >Ticket
                                                    Price</p >
                                                <input
                                                    type="text"
                                                    id="eventPrice"
                                                    value={eventPrice}
                                                    onChange={(e) => {
                                                        const price = e.target.value.replace(/[^0-9.]/g, '');
                                                        setEventPrice(`$${price}`);
                                                    }}
                                                    placeholder="Enter ticket price"
                                                    className="w-full mt-2 p-3 rounded-md border border-secondary-dark-1 bg-primary-light text-primary-dark focus:outline-none focus:ring-2 focus:ring-accent-blue"
                                                />
                                            </div >

                                            <div >
                                                <p htmlFor="refundAllowance"
                                                       className="text-lg font-semibold text-primary-light" >Allow
                                                    Refunds?</p >
                                                <select
                                                    id="refundAllowance"
                                                    value={refundAllowance}
                                                    onChange={() => {
                                                        setRefundAllowance(!refundAllowance);
                                                        if (!refundAllowance) setRefundPolicy('');
                                                    }}
                                                    className="w-full mt-2 p-3 rounded-md border border-secondary-dark-1 bg-primary-light text-primary-dark focus:outline-none focus:ring-2 focus:ring-accent-blue"
                                                >
                                                    <option value={true} >Yes</option >
                                                    <option value={false} >No</option >
                                                </select >

                                                {refundAllowance && (
                                                    <div >
                                                        <p htmlFor="refundPolicy"
                                                               className="text-lg font-semibold text-primary-light" >Refund
                                                            Policy</p >
                                                        <input
                                                            type="text"
                                                            id="refundPolicy"
                                                            value={refundPolicy}
                                                            onChange={(e) => setRefundPolicy(e.target.value)}
                                                            placeholder="Enter refund policy"
                                                            className="w-full mt-2 p-3 text-box"
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
                                            <p htmlFor={item.id}
                                                   className="text-lg font-semibold text-primary-light" >{item.label}</p >
                                            <select
                                                id={item.id}
                                                value={item.value}
                                                onChange={() => item.setter(!item.value)}
                                                className="w-full mt-2 p-3 rounded-md border border-secondary-dark-1 bg-primary-light text-primary-dark focus:outline-none focus:ring-2 focus:ring-accent-blue"
                                            >
                                                <option value={true} >Yes</option >
                                                <option value={false} >No</option >
                                            </select >
                                        </div >
                                    ))}
                                </div >
                                <div >
                                    <p className="text-lg font-semibold text-primary-light" >Primary Category</p >
                                    {/* Dropdown for Primary Category Selection */}
                                    <select
                                        value={selectedPrimaryCategory}
                                        onChange={handlePrimaryCategoryChange}
                                        className="w-full mt-2 p-3 rounded-md border border-secondary-dark-1 bg-primary-light text-primary-dark focus:outline-none focus:ring-2 focus:ring-accent-blue"
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
                                        <p className="text-lg font-semibold text-primary-light" >
                                            {selectedPrimaryCategory} Subcategories
                                        </p >
                                        <div className="grid grid-cols-2 gap-4 mt-2" >
                                            {categorizedOptions[selectedPrimaryCategory].map((subcategory) => (
                                                <label key={subcategory}
                                                       className="text-primary-light flex items-center space-x-2" >
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedSubcategories.includes(subcategory)}
                                                        onChange={() => handleSubcategoryChange(subcategory)}
                                                        className="form-checkbox h-4 w-4 text-accent-blue"
                                                    />
                                                    <span >{subcategory}</span >
                                                </label >
                                            ))}
                                        </div >
                                    </div >
                                )}


                                <button
                                    onClick={handleSubmit}
                                    className="mt-6 w-full py-3 btn btn-primary"
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
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 rounded-lg shadow-lg p-8" style={{ backgroundColor: 'var(--secondary-light-1)' }}  >
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
                            className="mt-4 w-full py-2 btn btn-primary"
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