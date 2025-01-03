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
import {Modal, Button, ImageList, ImageListItem} from '@mui/material';
import {CalendarDaysIcon} from "@heroicons/react/24/outline";
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '/tailwind.config.js';
import themeManager from "../utils/themeManager.jsx";
import Tooltip from "@mui/material/Tooltip";

function EventCreationPage() {
    const fullConfig = resolveConfig(tailwindConfig);
    const colors = fullConfig.theme.colors;
    const [userId, setUserId] = useState(null);
    const [eventTitle, setEventTitle] = useState('');
    const [eventDescription, setEventDescription] = useState('');
    const [eventLocation, setEventLocation] = useState('');
    const [eventDateTime, setEventDateTime] = useState('');
    const [eventCapacity, setEventCapacity] = useState(null);
    const [eventImages, setEventImages] = useState([]);
    const [eventPrice, setEventPrice] = useState('');
    const [isPaidEvent, setIsPaidEvent] = useState(false);
    const [petAllowance, setPetAllowance] = useState(false);
    const [refundAllowance, setRefundAllowance] = useState(false);
    const [refundPolicy, setRefundPolicy] = useState('');
    const [ageRestriction, setAgeRestriction] = useState('All');
    const [fbAvail, setFbAvail] = useState(false);
    const [merchAvailability, setMerchAvailability] = useState(false);
    const [alcAvail, setAlcAvail] = useState(false);
    const [alcInfo, setAlcInfo] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [previewImages, setPreviewImages] = useState(false);
    const [eventLong, setEventLong] = useState(0);
    const [eventLat, setEventLat] = useState(0);
    const [eventImagesUrls, setEventImagesUrls] = useState([]);
    const [selectedPrimaryCategory, setSelectedPrimaryCategory] = useState('');
    const [selectedSubcategories, setSelectedSubcategories] = useState([]);
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
        'All Categories': [
            'Sports', 'Gaming & E-sports', 'Fitness & Training',
            'Adventure Sports', 'Hiking & Nature', 'Food & Drink',
            'Cooking & Culinary', 'Shopping & Markets', 'Travel & Outdoor',
            'Wine Tasting', 'Dining Experiences', 'Health',
            'Spirituality & Wellness', 'Family & Kids', 'Fashion & Beauty',
            'Mental Health', 'Technology', 'Science & Innovation', 'Education',
            'Workshops & Classes', 'Talks & Seminars', 'Online Courses',
            'Business', 'Networking', 'Politics & Activism', 'Charity & Fundraisers',
            'Conferences', 'Music', 'Art', 'Comedy', 'Theater & Performing Arts',
            'Film & Media', 'Photography & Art Exhibits', 'Opera',
        ],
    };
    const [darkMode, setDarkMode] = useState(themeManager.isDarkMode);
    const [showTitleTooltip, setShowTitleTooltip] = useState(false);
    const [showDescTooltip, setShowDescTooltip] = useState(false);
    const [showDNTTooltip, setShowDNTTooltip] = useState(false);
    const [showCapacityTooltip, setShowCapacityTooltip] = useState(false);
    const [showConfirmFirestoreTooltip, setShowConfirmFirestoreTooltip] = useState(false);

    useEffect(() => {
        const handleThemeChange = (isDark) => setDarkMode(isDark);
        themeManager.addListener(handleThemeChange);

        return () => {
            themeManager.removeListener(handleThemeChange);
        };
    }, []);

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
                : [...prev, subcategory]
        );
    };

    const geocodePlaceId = async (placeId) => {
        try {
            const service = new google.maps.places.PlacesService(document.createElement('div'));
            const request = {
                placeId: placeId,
                fields: ['geometry'],
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
            const categories = selectedSubcategories.length > 0 ? selectedSubcategories : ['Uncategorized'];

            if (eventTitle === "" || eventDescription === "" || eventLocation === "" || eventDateTime === "" || eventCapacity === null) {
                if (eventTitle === "") {
                    setShowTitleTooltip(true);
                } else setShowTitleTooltip(false);
                if (eventDescription === "") {
                    setShowDescTooltip(true);
                } else setShowDescTooltip(false);
                if (eventDateTime === "") {
                    setShowDNTTooltip(true);
                } else setShowDNTTooltip(false);
                if (eventCapacity === null) {
                    setShowCapacityTooltip(true);
                } else setShowCapacityTooltip(false);
                return;
            }

            const isAvailable = eventCapacity > 0;

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
                    isAvailable,
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
            setShowConfirmFirestoreTooltip(false);
            setModalOpen(true);
        } catch {
            setShowConfirmFirestoreTooltip(true);
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
        setEventLong(0);
        setEventLat(0);
        setShowTitleTooltip(false);
        setShowDescTooltip(false);
        setShowDNTTooltip(false);
        setShowCapacityTooltip(false);
        setShowConfirmFirestoreTooltip(false);
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

            <div className="event-creation-page">

                <div
                    className={`flex flex-col justify-center items-center pb-10 px-4 min-h-screen ${darkMode ? "bg-Dark-D2" : "bg-Light-L2"}`}>
                    <HeaderComponent/>

                    <div
                        className={`box-border w-full max-w-3xl rounded-lg shadow-lg p-8 ${darkMode ? "bg-primary-dark" : "bg-primary-light"}`}>
                        <div className="text-center">
                            <span
                                className={`text-h1 font-lalezar pb-3 text-center uppercase font-bold ${darkMode ? "text-primary-light" : "text-primary-dark"}`}>Create Your Event</span>
                        </div>

                        <div className="flex flex-col space-y-4 pt-4">
                            <div className="flex flex-col space-y-6">

                                {/* Event Title */}

                                <div>
                                    <span htmlFor="eventTitle"
                                          className={`text-body font-bold font-inter ${darkMode ? "text-primary-light" : "text-primary-dark"}`}>Event
                                        Title</span>
                                    <Tooltip
                                        title="Event Title is required"
                                        open={showTitleTooltip}
                                        arrow
                                        placement="bottom"
                                    >
                                        <input
                                            type="text"
                                            id="eventTitle"
                                            value={eventTitle}
                                            onChange={(e) => setEventTitle(e.target.value)}
                                            placeholder="Enter event title"
                                            className={`w-full mt-2 p-3 rounded-md ${darkMode ? "text-primary-light border-Dark-D1 bg-Dark-D2" : "text-primary-dark border-Light-L1 bg-Light-L2"}`}
                                            required
                                        />
                                    </Tooltip>
                                </div>

                                {/* Description */}
                                <div>
                                    <span htmlFor="eventDescription"
                                          className={`font-inter text-body font-bold ${darkMode ? "text-primary-light" : "text-primary-dark"}`}>Description</span>
                                    <Tooltip
                                        title="Event Description is required"
                                        open={showDescTooltip}
                                        arrow
                                        placement="bottom"
                                    >
                                        <textarea
                                            id="eventDescription"
                                            value={eventDescription}
                                            onChange={(e) => setEventDescription(e.target.value)}
                                            placeholder="Enter event description"
                                            className={`w-full mt-2 p-3 rounded-md ${darkMode ? "text-primary-light border-Dark-D1 bg-Dark-D2" : "text-primary-dark border-Light-L1 bg-Light-L2"}`}
                                            rows="4"
                                            required
                                        />
                                    </Tooltip>
                                </div>

                                {/* Location */}
                                <div>
                                    <span htmlFor="eventLocation"
                                          className={`font-inter text-body font-bold ${darkMode ? "text-primary-light" : "text-primary-dark"}`}>Location</span>
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
                                                        backgroundColor: darkMode ? colors["Dark-D2"] : colors["Light-L2"],
                                                        borderColor: state.isFocused ? (darkMode ? colors["Light-L1"] : colors["Dark-D1"]) : (darkMode ? colors["Dark-D1"] : colors["Light-L1"]),
                                                        ':hover': {
                                                            borderColor: darkMode ? colors["Light-L1"] : colors["Dark-D1"],
                                                        },
                                                        // borderWidth: state.isFocused ? '2px' : '1px',
                                                        width: '100%',
                                                        marginTop: '2px',
                                                        padding: '3px',
                                                        borderRadius: '6px',
                                                    }),
                                                    menu: (provided) => ({
                                                        ...provided,
                                                        backgroundColor: darkMode ? colors["Dark-D2"] : colors["Light-L2"],
                                                        borderColor: darkMode ? colors["Light-L1"] : colors["Dark-D1"],
                                                        maxHeight: "200px",
                                                        overflowY: "auto",
                                                    }),
                                                    input: (provided, state) => ({
                                                        ...provided,
                                                        color: darkMode ? colors["primary-light"] : colors["primary-dark"],
                                                        borderColor: state.isFocused ? (darkMode ? colors["Light-L1"] : colors["Dark-D1"]) : (darkMode ? colors["Dark-D1"] : colors["Light-L1"]),
                                                        ':hover': {
                                                            borderColor: darkMode ? colors["Light-L1"] : colors["Dark-D1"],
                                                        },
                                                        border: 'none',
                                                    }),
                                                    option: (provided, state) => ({
                                                        ...provided,
                                                        color: state.isFocused ? (darkMode ? colors["primary-dark"] : colors["primary-light"]) : (darkMode ? colors["primary-light"] : colors["primary-dark"]),
                                                        backgroundColor: state.isFocused ? (darkMode ? colors["Light-L2"] : colors["Dark-D2"]) : (darkMode ? colors["Dark-D2"] : colors["Light-L2"]),
                                                        cursor: "pointer",
                                                    }),
                                                    singleValue: (provided) => ({
                                                        ...provided,
                                                        color: darkMode ? colors["primary-light"] : colors["primary-dark"],
                                                        backgroundColor: darkMode ? colors["Dark-D2"] : colors["Light-L2"],
                                                    }),

                                                },
                                                placeholder: 'Enter location',
                                            }}
                                        />
                                </div>

                                {/* Date and Capacity */}
                                <div className="flex space-x-4">
                                    <div className="flex-1">
                                        <span htmlFor="eventDateTime"
                                              className={`font-inter text-body font-bold ${darkMode ? "text-primary-light" : "text-primary-dark"}`}>Event
                                            Date
                                            and Time</span>
                                        <Tooltip
                                            title="Event Date and Time are required"
                                            open={showDNTTooltip}
                                            arrow
                                            placement="left"
                                        >
                                            <div className="relative mt-2">
                                                <input
                                                    type="datetime-local"
                                                    id="eventDateTime"
                                                    value={eventDateTime}
                                                    onChange={(e) => setEventDateTime(e.target.value)}
                                                    className={`w-full mt-2 p-3 rounded-md ${darkMode ? "text-primary-light border-Dark-D1 bg-Dark-D2" : "text-primary-dark border-Light-L1 bg-Light-L2"}`}
                                                    required
                                                />
                                                <div
                                                    className={`absolute inset-y-0 right-3 flex items-center pointer-events-none ${darkMode ? "text-primary-light" : "text-primary-dark"}`}>

                                                    < CalendarDaysIcon
                                                        className={`h-5 w-5`}/>
                                                </div>
                                            </div>
                                        </Tooltip>
                                    </div>
                                    <div className="flex-1">
                                        <span htmlFor="eventCapacity"
                                              className={`font-inter text-body font-bold ${darkMode ? "text-primary-light" : "text-primary-dark"}`}>Capacity</span>
                                        <Tooltip
                                            title="Event Capacity is required"
                                            open={showCapacityTooltip}
                                            arrow
                                            placement="right"
                                        >
                                            <input
                                                type="number"
                                                id="eventCapacity"
                                                value={eventCapacity === null ? '' : eventCapacity}
                                                onChange={(e) => {
                                                    const parsedValue = parseInt(e.target.value === '' ? null : parseInt(e.target.value, 10));
                                                    setEventCapacity(Math.max(parsedValue, 0));
                                                }}
                                                placeholder="Enter event capacity"
                                                className={`relative w-full mt-4 p-3 rounded-md ${darkMode ? "text-primary-light border-Dark-D1 bg-Dark-D2" : "text-primary-dark border-Light-L1 bg-Light-L2"}`}
                                                required
                                            />
                                        </Tooltip>
                                    </div>
                                </div>

                                <div>
                                    <span htmlFor="eventImages"
                                          className={`font-inter text-body font-bold ${darkMode ? "text-primary-light" : "text-primary-dark"}`}>Upload
                                        Event
                                        Images</span>
                                    <div className="mt-2">
                                        <label
                                            htmlFor="eventImages"
                                            className={`flex items-center justify-center w-full p-3 ${darkMode ? "bg-Dark-D2 border-primary-dark" : "bg-Light-L2 border-primary-light"} rounded-md border cursor-pointer hover:bg-accent-purple transition-all`}
                                        >
                                            <PhotoIcon
                                                className={`h-6 w-6 mr-2 ${darkMode ? "text-Light-L2" : "text-Dark-D2"}`}/>
                                            <span
                                                className={`font-inter font-medium ${darkMode ? "text-Light-L2" : "text-Dark-D2"}`}>Choose Images</span>
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

                                {/* Image Preview */}
                                {previewImages && (
                                    <>
                                        <div>
                                            <span htmlFor="previewImages"
                                                  className={`font-inter text-body font-bold ${darkMode ? "text-primary-light" : "text-primary-dark"}`}>Event
                                                Images</span>
                                            <div className="mt-2">
                                                <label
                                                    htmlFor="previewImages"
                                                    className={`flex items-center justify-center w-full p-3 ${darkMode ? "bg-Dark-D2 border-Dark-D1 hover:bg-Light-L3" : "bg-Light-L2 border-Light-L1 hover:bg-Dark-D2"} rounded-md border  cursor-pointer transition-all`}
                                                >
                                                    <ImageList sx={{width: 600, height: 200}} cols={3} rowHeight={200}
                                                               gap={10}>
                                                        {eventImagesUrls.map((item) => (
                                                            <ImageListItem key={item}>
                                                                <img
                                                                    srcSet={`${item}`}
                                                                    src={`${item}`}
                                                                    alt={item.name}
                                                                    loading="lazy"
                                                                />
                                                            </ImageListItem>
                                                        ))}
                                                    </ImageList>
                                                </label>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Paid Event */}
                                <div className="space-y-4">
                                    <span htmlFor="isPaidEvent"
                                          className={`font-inter text-body font-bold ${darkMode ? "text-primary-light" : "text-primary-dark"}`}>
                                        Is this a paid event?</span>
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
                                        className={`w-full mt-2 p-3 rounded-md border ${darkMode ? "border-Dark-D1 bg-Dark-D2 text-Light-L2" : "border-Light-L1 bg-Light-L2 text-Dark-D2"} focus:outline-none focus:ring-2 focus:ring-accent-blue`}
                                    >
                                        <option value={true}>Yes</option>
                                        <option value={false}>No</option>
                                    </select>

                                    {isPaidEvent && (
                                        <>
                                            <div>
                                                <span htmlFor="eventPrice"
                                                      className={`font-inter text-body font-bold ${darkMode ? "text-primary-light" : "text-primary-dark"}`}>Ticket
                                                    Price</span>
                                                <input
                                                    type="text"
                                                    id="eventPrice"
                                                    value={eventPrice}
                                                    onChange={(e) => {
                                                        const price = e.target.value.replace(/[^0-9.]/g, '');
                                                        setEventPrice(`$${price}`);
                                                    }}
                                                    placeholder="Enter ticket price"
                                                    className={`w-full mt-2 p-3 rounded-md ${darkMode ? "text-primary-light border-Dark-D1 bg-Dark-D2" : "text-primary-dark border-Light-L1 bg-Light-L2"}`}
                                                />
                                            </div>

                                            <div>
                                                <span htmlFor="refundAllowance"
                                                      className={`font-inter text-body font-bold ${darkMode ? "text-primary-light" : "text-primary-dark"}`}>Allow
                                                    Refunds?</span>
                                                <select
                                                    id="refundAllowance"
                                                    value={refundAllowance}
                                                    onChange={() => {
                                                        setRefundAllowance(!refundAllowance);
                                                        if (!refundAllowance) setRefundPolicy('');
                                                    }}
                                                    className={`w-full mt-2 p-3 rounded-md border ${darkMode ? "border-Dark-D1 bg-Dark-D2 text-Light-L2" : "border-Light-L1 bg-Light-L2 text-Dark-D2"} focus:outline-none focus:ring-2 focus:ring-accent-blue`}
                                                >
                                                    <option value={true}>Yes</option>
                                                    <option value={false}>No</option>
                                                </select>

                                                {refundAllowance && (
                                                    <div className="pt-2">
                                                        <span htmlFor="refundPolicy"
                                                              className={`font-inter text-body font-bold ${darkMode ? "text-primary-light" : "text-primary-dark"}`}>Refund
                                                            Policy</span>
                                                        <input
                                                            type="text"
                                                            id="refundPolicy"
                                                            value={refundPolicy}
                                                            onChange={(e) => setRefundPolicy(e.target.value)}
                                                            placeholder="Enter refund policy"
                                                            className={`w-full mt-2 p-3 rounded-md ${darkMode ? "text-primary-light border-Dark-D1 bg-Dark-D2" : "text-primary-dark border-Light-L1 bg-Light-L2"}`}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>

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
                                            <span htmlFor={item.id}
                                                  className={`font-inter text-body font-bold ${darkMode ? "text-primary-light" : "text-primary-dark"}`}>{item.label}</span>
                                            <select
                                                id={item.id}
                                                value={item.value}
                                                onChange={() => item.setter(!item.value)}
                                                className={`${darkMode ? "border-Dark-D1 bg-Dark-D2 text-Light-L2" : "border-Light-L1 bg-Light-L2 text-Dark-D2"} w-full mt-2 p-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-accent-blue`}
                                            >
                                                <option value={true}>Yes</option>
                                                <option value={false}>No</option>
                                            </select>
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <span
                                        className={`font-inter text-body font-bold ${darkMode ? "text-primary-light" : "text-primary-dark"}`}>Primary Category</span>
                                    {/* Dropdown for Primary Category Selection */}
                                    <select
                                        value={selectedPrimaryCategory}
                                        onChange={handlePrimaryCategoryChange}
                                        className={`w-full mt-2 p-3 rounded-md border ${darkMode ? "border-Dark-D1 bg-Dark-D2 text-Light-L2" : "border-Light-L1 bg-Light-L2 text-Dark-D2"} focus:outline-none focus:ring-2 focus:ring-accent-blue`}
                                    >
                                        <option value="">Select a Category</option>
                                        {Object.keys(categorizedOptions).map((category) => (
                                            <option key={category} value={category}>
                                                {category}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Subcategories Section */}
                                {selectedPrimaryCategory && (
                                    <div className="mt-4">
                                        <span
                                            className={`font-inter text-body font-bold ${darkMode ? "text-primary-light" : "text-primary-dark"}`}>
                                            {selectedPrimaryCategory} Subcategories
                                        </span>
                                        <div className="grid grid-cols-2 gap-4 mt-2">
                                            {categorizedOptions[selectedPrimaryCategory].map((subcategory) => (
                                                <label key={subcategory}
                                                       className={` flex items-center space-x-2 ${darkMode ? "text-primary-light" : "text-primary-dark"}`}>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedSubcategories.includes(subcategory)}
                                                        onChange={() => handleSubcategoryChange(subcategory)}
                                                        className="form-checkbox h-4 w-4 text-accent-blue"
                                                    />
                                                    <span>{subcategory}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                )}


                                <Tooltip
                                    title="Could not create event"
                                    open={showConfirmFirestoreTooltip}
                                    arrow
                                    placement="bottom"
                                >
                                    <button
                                        onClick={handleSubmit}
                                        className="mt-6 w-full py-3 btn btn-primary"
                                    >
                                        Create Event
                                    </button>
                                </Tooltip>

                            </div>
                        </div>
                    </div>
                </div>

                <Modal
                    open={modalOpen}
                    onClose={handleModalClose}
                >
                    <div

                        className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 rounded-lg shadow-lg p-8 ${darkMode ? "bg-Light-L1" : "bg-Dark-D1"}`}>
                        <h2 className={`text-h2 mb-4 text-center ${darkMode ? "text-primary-dark" : "text-primary-light"}`}>
                            Event Created!
                        </h2>
                        <span className={`text-body text-center mb-6 ${darkMode ? "text-Dark-D2" : "text-Light-L2"}`}>
                            Your event has been successfully created.
                        </span>
                        <Button
                            onClick={handleModalClose}
                            variant="contained"
                            color="primary"
                            className="mt-4 w-full py-2 btn btn-primary"
                        >
                            Close
                        </Button>
                    </div>
                </Modal>
                <FooterComponent/>
            </div>
        </>
    );
}

export default EventCreationPage;