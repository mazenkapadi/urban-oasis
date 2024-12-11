import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { arrayUnion, deleteField, doc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth, storage } from "../../firebaseConfig.js";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import PhotoCarousel from "../../components/Carousels/PhotoCarousel.jsx";
import HeaderComponent from "../../components/HeaderComponent.jsx";
import FooterComponent from "../../components/FooterComponent.jsx";
import LoadingPage from "../service/LoadingPage.jsx";
import { ImageList, ImageListItem } from '@mui/material';
import { PhotoIcon } from "@heroicons/react/24/outline";

const HostEventPage = () => {
    const {eventId} = useParams();
    const [ eventTitle, setEventTitle ] = useState('');
    const [ eventDescription, setEventDescription ] = useState('');
    const [ eventLocation, setEventLocation ] = useState('');
    const [ eventDateTime, setEventDateTime ] = useState('');
    const [ eventPrice, setEventPrice ] = useState('');
    const [ isPaidEvent, setIsPaidEvent ] = useState(false);
    const [ userId, setUserId ] = useState(null);
    const [ eventCapacity, setEventCapacity ] = useState(0);
    const [ attendeesCount, setAttendeesCount ] = useState(0);
    const [ editable, setEditable ] = useState(false);
    const [ eventData, setEventData ] = useState({eventId: '', rsvpId: ''});

    const [ hostDetails, setHostDetails ] = useState({
        bio: '',
        companyName: '',
        website: '',
        hostLocation: {city: '', state: ''},
    });

    const [ loading, setLoading ] = useState(true);
    const [ isHost, setIsHost ] = useState(false);
    const [ attendeeDetails, setAttendeeDetails ] = useState([]);
    const [ showModal, setShowModal ] = useState(false);
    const [ showCancelModal, setShowCancelModal ] = useState(false);
    const [ emailData, setEmailData ] = useState({
        to: '',
        subject: '',
        body: '',
    });

    const [ showBlastModal, setShowBlastModal ] = useState(false);
    const [ blastEmailData, setBlastEmailData ] = useState({
        subject: '',
        body: '',
    });

    // New state variables for editing event details
    const [ selectedPrimaryCategory, setSelectedPrimaryCategory ] = useState('');
    const [ selectedSubcategories, setSelectedSubcategories ] = useState([]);
    const [ previewImages, setPreviewImages ] = useState(false);
    const [ eventImagesUrls, setEventImagesUrls ] = useState([]);
    const [ newEventImages, setNewEventImages ] = useState([]);
    const [ eventImages, setEventImages ] = useState([]);

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

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchEventData = async () => {
            if (eventId) {
                const EventDocRef = doc(db, 'Events', eventId);
                const EventDocSnap = await getDoc(EventDocRef);

                if (EventDocSnap.exists()) {
                    const data = EventDocSnap.data();
                    setEventTitle(data.basicInfo.title);
                    setEventDescription(data.basicInfo.description);
                    setEventDateTime(data.eventDetails.eventDateTime.toDate().toLocaleDateString());
                    setIsPaidEvent(data.eventDetails.paidEvent);
                    setEventPrice(data.eventDetails.eventPrice === 0 ? "Free" : data.eventDetails.eventPrice);
                    setEventLocation(data.basicInfo.location);
                    setEventCapacity(data.eventDetails.capacity || 0);
                    setAttendeesCount(data.attendeesCount || 0);
                    setEventImages(data.eventDetails.images || []);
                    setSelectedSubcategories(data.basicInfo.categories || []);

                    if (data.hostId === userId) {
                        setIsHost(true);
                    }

                    // Fetch host data if available
                    if (data.hostId) {
                        const hostDocRef = doc(db, 'Users', data.hostId);
                        const hostDocSnap = await getDoc(hostDocRef);
                        if (hostDocSnap.exists()) {
                            const hostData = hostDocSnap.data();
                            setHostDetails({
                                bio: hostData.bio || '',
                                companyName: hostData.companyName || '',
                                website: hostData.website || '',
                                hostLocation: hostData.hostLocation || {city: '', state: ''}
                            });
                        }
                    }
                }

                const EventRSVPDocRef = doc(db, 'EventRSVPs', eventId);
                const EventRSVPDocSnap = await getDoc(EventRSVPDocRef);

                if (EventRSVPDocSnap.exists()) {
                    const data = EventRSVPDocSnap.data();
                    const rsvps = data.rsvps;
                    const attendees = [];

                    for (const [ key, innerMap ] of Object.entries(rsvps)) {
                        const userId = innerMap.userId;
                        const quantity = innerMap.quantity;

                        const attendeeDocRef = doc(db, 'Users', userId);
                        const attendeeDocSnap = await getDoc(attendeeDocRef);

                        if (attendeeDocSnap.exists()) {
                            const attendeeData = attendeeDocSnap.data();
                            attendees.push({
                                firstName: attendeeData.name.firstName,
                                lastName: attendeeData.name.lastName,
                                quantity,
                                email: attendeeData.contact.email,
                                rsvpId: key,
                                userId: userId
                            });
                        }
                    }

                    setAttendeeDetails(attendees);
                }

                setLoading(false);
            }
        };

        fetchEventData();
    }, [ eventId, userId ]);

    const toggleEditMode = () => {
        if (editable) {
            setEventTitle('');
            setEventDescription('');
            setEventCapacity(0);
            setEventImages([]);
            setSelectedPrimaryCategory('');
            setSelectedSubcategories([]);
            setEventImagesUrls([]);
            setNewEventImages([]);
            setPreviewImages(false);
            // fetchEventData();
        }
        setEditable(!editable);
    };

    const handleUpdateHostDetails = async () => {
        if (!editable) return;

        try {
            const hostDocRef = doc(db, 'Users', userId);
            await updateDoc(hostDocRef, {
                bio: hostDetails.bio,
                companyName: hostDetails.companyName,
                website: hostDetails.website,
                hostLocation: hostDetails.hostLocation,
            });
            console.log("Host details updated successfully!");
            toggleEditMode();
        } catch (error) {
            console.error("Error updating host details: ", error);
        }
    };

    const handleUpdateEventDetails = async () => {
        if (!editable) return;

        try {
            let uploadedImages = [];
            if (newEventImages.length > 0) {
                uploadedImages = await handleImageUpload(eventTitle, newEventImages);
            }

            const updatedEventData = {
                'basicInfo.title': eventTitle,
                'basicInfo.description': eventDescription,
                'basicInfo.categories': selectedSubcategories,
                'eventDetails.capacity': eventCapacity,
            };

            if (uploadedImages.length > 0) {
                const allImages = [ ...eventImages, ...uploadedImages ];
                updatedEventData['eventDetails.images'] = allImages;
            }

            const eventDocRef = doc(db, 'Events', eventId);
            await updateDoc(eventDocRef, updatedEventData);

            console.log("Event details updated successfully!");
            toggleEditMode();
        } catch (error) {
            console.error("Error updating event details: ", error);
        }
    };

    const handleCapacityChange = (e) => {
        const newCapacity = parseInt(e.target.value, 10);
        if (newCapacity >= attendeesCount) {
            setEventCapacity(newCapacity);
        } else {
            alert(`Capacity cannot be less than the number of attendees (${attendeesCount}).`);
        }
    };

    // const handleInputChange = (e) => {
    //     const {name, value} = e.target;
    //     setHostDetails((prevDetails) => ({...prevDetails, [name]: value}));
    // };

    const handlePrimaryCategoryChange = (e) => {
        const selectedCategory = e.target.value;
        setSelectedPrimaryCategory(selectedCategory);
        setSelectedSubcategories([]);
    };

    const handleSubcategoryChange = (subcategory) => {
        setSelectedSubcategories((prev) =>
            prev.includes(subcategory)
                ? prev.filter((item) => item !== subcategory)
                : [ ...prev, subcategory ]
        );
    };

    const handleFileChange = (e) => {
        setPreviewImages(true);
        const imagesArray = Array.from(e.target.files);
        const imageUrls = imagesArray.map((image) => URL.createObjectURL(image));
        setNewEventImages(imagesArray);
        setEventImagesUrls(imageUrls);
    };

    const handleImageUpload = async (eventTitle, imageFiles) => {
        if (!imageFiles || !imageFiles.length) {
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
            return imageUrls;
        } catch (error) {
            console.error("Error uploading images:", error);
            throw error;
        }
    };

    if (loading) {
        return <LoadingPage />;
    }

    const handleAttendeeCancel = async (eventId, rsvpId, attendeeEmail, attendeeUserId) => {
        const subject = emailData.subject || `RSVP Canceled - ${eventTitle}`;
        const body = emailData.body || `We regret to inform you that your RSVP for the event "${eventTitle}" scheduled for ${eventDateTime} has been canceled.\n\nIf you have any questions or need further assistance, please feel free to reach out.\n\n-Team Urban Oasis`;

        try {
            const eventRsvpDocRef = doc(db, "EventRSVPs", eventId);
            const userRsvpDocRef = doc(db, "UserRSVPs", attendeeUserId);  // Use attendeeUserId here

            await updateDoc(userRsvpDocRef, {
                [`rsvps.${rsvpId}`]: deleteField(),
            });

            await updateDoc(eventRsvpDocRef, {
                [`rsvps.${rsvpId}`]: deleteField(),
            });

            const response = await fetch("/api/send-email", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    recipient: attendeeEmail,
                    subject: subject,
                    html_content: `<html lang="en">${body}</html>`,
                }),
            });

            if (response.ok) {
                alert("RSVP canceled and email sent successfully!");
            } else {
                const errorText = await response.text();
                alert(`Failed to send email: ${errorText}`);
            }
        } catch (error) {
            console.error("Error handling attendee cancellation:", error);
            alert("An error occurred while trying to cancel RSVP and send the email.");
        } finally {
            setShowCancelModal(false);
            setEmailData({to: "", subject: "", body: ""});
        }
    };

    const handleSendEmail = async () => {
        try {
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    recipient: emailData.to,
                    subject: emailData.subject,
                    html_content: `<html lang="en">${emailData.body}</html>`,
                }),
            });

            if (response.ok) {
                alert('Email sent successfully!');
                setShowModal(false);
                setEmailData({to: '', subject: '', body: ''});
            } else {
                const errorText = await response.text();
                alert(`Failed to send email: ${errorText}`);
            }
        } catch (error) {
            console.error('Error sending email:', error);
            alert('An error occurred while trying to send the email.');
        }
    };

    const openEmailModal = (email) => {
        setEmailData((prev) => ({...prev, to: email}));
        setShowModal(true);
    };

    const openCancelEmailModal = (email, eventId, rsvpId, attendeeUserId) => {
        const defaultSubject = `RSVP Canceled - ${eventTitle}`;
        const defaultBody = `We regret to inform you that your RSVP for the event "${eventTitle}" scheduled for ${eventDateTime} has been canceled.\n\nIf you have any questions or need further assistance, please feel free to reach out.\n\n-Team Urban Oasis`;

        setEmailData({
            to: email,
            subject: defaultSubject,
            body: defaultBody,
        });

        setShowCancelModal(true);

        setEventData({eventId, rsvpId, attendeeUserId});
    };

    const handleBlastEmail = async () => {
        try {
            const emailPromises = attendeeDetails.map((attendee) =>
                fetch('/api/send-email', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        recipient: attendee.email,
                        subject: blastEmailData.subject,
                        html_content: `<html lang="en">${blastEmailData.body}</html>`,
                    }),
                })
            );

            const results = await Promise.allSettled(emailPromises);

            const failedEmails = [];
            results.forEach((result, index) => {
                if (result.status === 'rejected' || (result.status === 'fulfilled' && !result.value.ok)) {
                    failedEmails.push(attendeeDetails[index].email);
                }
            });

            if (failedEmails.length > 0) {
                alert(`Some emails failed to send: ${failedEmails.join(', ')}`);
            } else {
                alert('All blast emails sent successfully!');
            }

            setShowBlastModal(false);
            setBlastEmailData({subject: '', body: ''});
        } catch (error) {
            console.error('Error sending blast emails:', error);
            alert('An error occurred while trying to send the blast emails.');
        }
    };

    return (
        <>
            <HeaderComponent />
            <div className="event-page py-10 px-4 pt-32 bg-gray-200 min-h-screen" >
                <div className="box-border bg-white p-8 rounded-lg shadow-lg" >
                    <PhotoCarousel eventId={eventId} />

                    <div className="flex flex-col mt-6" >
                        <h1 className="text-3xl font-bold" >{eventTitle}</h1 >
                        <p className="text-gray-500" >{eventDateTime}</p >
                        <p className="mt-4" >{eventDescription}</p >
                        {isHost && (
                            <div className="event-edit-form mt-8" >
                                <h2 className="text-2xl font-bold" >Edit Event Details</h2 >

                                <div className="mt-4" >
                                    {/* Event Title */}
                                    <label className="block text-gray-600" >Event Title</label >
                                    <input
                                        type="text"
                                        name="eventTitle"
                                        value={eventTitle}
                                        onChange={(e) => setEventTitle(e.target.value)}
                                        disabled={!editable}
                                        className="input-field"
                                    />

                                    {/* Description */}
                                    <label className="block text-gray-600 mt-4" >Description</label >
                                    <textarea
                                        name="eventDescription"
                                        value={eventDescription}
                                        onChange={(e) => setEventDescription(e.target.value)}
                                        disabled={!editable}
                                        className="input-field"
                                    />

                                    {/* Capacity */}
                                    <label className="block text-gray-600 mt-4" >Capacity</label >
                                    <input
                                        type="number"
                                        name="eventCapacity"
                                        value={eventCapacity}
                                        onChange={handleCapacityChange}
                                        disabled={!editable}
                                        className="input-field"
                                    />

                                    {/* Categories */}
                                    <label className="block text-gray-600 mt-4" >Primary Category</label >
                                    <select
                                        value={selectedPrimaryCategory}
                                        onChange={handlePrimaryCategoryChange}
                                        disabled={!editable}
                                        className="input-field"
                                    >
                                        <option value="" >Select a Category</option >
                                        {Object.keys(categorizedOptions).map((category) => (
                                            <option key={category} value={category} >
                                                {category}
                                            </option >
                                        ))}
                                    </select >

                                    {selectedPrimaryCategory && (
                                        <div className="mt-4" >
                                            <label
                                                className="block text-gray-600" >{selectedPrimaryCategory} Subcategories</label >
                                            <div className="grid grid-cols-2 gap-4 mt-2" >
                                                {categorizedOptions[selectedPrimaryCategory].map((subcategory) => (
                                                    <label key={subcategory} className="flex items-center space-x-2" >
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedSubcategories.includes(subcategory)}
                                                            onChange={() => handleSubcategoryChange(subcategory)}
                                                            disabled={!editable}
                                                            className="form-checkbox h-4 w-4 text-accent-blue"
                                                        />
                                                        <span >{subcategory}</span >
                                                    </label >
                                                ))}
                                            </div >
                                        </div >
                                    )}

                                    {/* Event Images */}
                                    <label className="block text-gray-600 mt-4" >Upload Event Images</label >
                                    <div className="mt-2" >
                                        <label
                                            htmlFor="eventImages"
                                            className={`flex items-center justify-center w-full p-3 bg-gray-100 border rounded-md cursor-pointer hover:bg-gray-200`}
                                        >
                                            <PhotoIcon className="h-6 w-6 mr-2 text-gray-600" />
                                            <span className="font-medium text-gray-600" >Choose Images</span >
                                            <input
                                                type="file"
                                                id="eventImages"
                                                accept="image/*"
                                                multiple
                                                onChange={handleFileChange}
                                                className="sr-only"
                                                disabled={!editable}
                                            />
                                        </label >
                                    </div >

                                    {/* Image Preview */}
                                    {(eventImagesUrls.length > 0 || eventImages.length > 0) && (
                                        <div className="mt-4" >
                                            <label className="block text-gray-600" >Event Images</label >
                                            <ImageList sx={{width: 600, height: 200}} cols={3} rowHeight={200}
                                                       gap={10} >
                                                {eventImagesUrls.map((item) => (
                                                    <ImageListItem key={item} >
                                                        <img src={`${item}`} alt="New Upload" loading="lazy" />
                                                    </ImageListItem >
                                                ))}
                                                {eventImages.map((image) => (
                                                    <ImageListItem key={image.url} >
                                                        <img src={`${image.url}`} alt={image.name} loading="lazy" />
                                                    </ImageListItem >
                                                ))}
                                            </ImageList >
                                        </div >
                                    )}

                                    {/* Edit and Save Buttons */}
                                    <div className="mt-4" >
                                        <button
                                            className={`button ${editable ? 'bg-red-500' : 'bg-blue-500'}`}
                                            onClick={toggleEditMode}
                                        >
                                            {editable ? 'Cancel' : 'Edit Event'}
                                        </button >
                                        {editable && (
                                            <button
                                                className="button bg-green-500 ml-2"
                                                onClick={handleUpdateEventDetails}
                                            >
                                                Save Changes
                                            </button >
                                        )}
                                    </div >
                                </div >
                            </div >
                        )}
                    </div >

                    {isHost && (
                        <div className="mt-6" >
                            <div className="flex items-center justify-between mb-4" >
                                <label className="text-Dark-D2a font-lalezar text-body font-medium" >
                                    Attendees
                                </label >
                                <button
                                    onClick={() => setShowBlastModal(true)}
                                    className="bg-primary-dark text-primary-light px-4 py-2 rounded-lg"
                                >
                                    Blast Email
                                </button >
                            </div >
                            <div className="bg-primary-light rounded-lg p-4 shadow-md" >
                                {attendeeDetails.map((attendee, index) => (
                                    <div
                                        className="flex items-center justify-between border-b border-Light-L3 py-3"
                                        key={index}
                                    >
                                        <div className="flex flex-col" >
                                            <p className="text-primary-dark font-archivo text-body font-bold" >
                                                {attendee.firstName} {attendee.lastName}
                                                <br />
                                                {attendee.email}
                                            </p >
                                            <p className="text-accent-orange font-archivo text-h4 font-bold" >
                                                Tickets: {attendee.quantity}
                                            </p >
                                        </div >

                                        <div className="flex items-center gap-2" >
                                            <button
                                                className="bg-accent-purple text-neutral-white font-roboto text-button font-bold px-4 py-2 rounded-lg transition-transform transform hover:scale-105"
                                                onClick={() => openCancelEmailModal(attendee.email, eventId, attendee.rsvpId, attendee.userId)}
                                            >
                                                Cancel Ticket
                                            </button >

                                            <button
                                                className="bg-Dark-D1 text-Light-L1 font-roboto text-button font-bold px-4 py-2 rounded-lg transition-transform transform hover:scale-105"
                                                onClick={() => openEmailModal(attendee.email)}
                                            >
                                                Contact Attendee
                                            </button >
                                        </div >
                                    </div >
                                ))}
                            </div >
                        </div >
                    )}
                    {showModal && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" >
                            <div className="bg-white p-6 rounded-lg shadow-lg w-[500px]" >
                                <h2 className="text-2xl font-bold mb-6" >Send Email</h2 >
                                <p className="mb-4 text-lg" >To: {emailData.to}</p >
                                <input
                                    type="text"
                                    placeholder="Subject"
                                    value={emailData.subject}
                                    onChange={(e) => setEmailData((prev) => ({...prev, subject: e.target.value}))}
                                    className="w-full p-3 border rounded-lg mb-4 text-lg"
                                />
                                <textarea
                                    placeholder="Message"
                                    value={emailData.body}
                                    onChange={(e) => setEmailData((prev) => ({...prev, body: e.target.value}))}
                                    className="w-full p-3 border rounded-lg mb-4 text-lg h-32"
                                />
                                <div className="flex justify-end gap-4" >
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="px-6 py-2 bg-gray-400 text-white rounded-lg text-lg"
                                    >
                                        Cancel
                                    </button >
                                    <button
                                        onClick={handleSendEmail}
                                        className="px-6 py-2 bg-blue-500 text-white rounded-lg text-lg"
                                    >
                                        Send
                                    </button >
                                </div >
                            </div >
                        </div >
                    )}
                    {showBlastModal && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" >
                            <div className="bg-white p-6 rounded-lg shadow-lg w-[500px]" >
                                <h2 className="text-2xl font-bold mb-6" >Send Blast Email</h2 >
                                <input
                                    type="text"
                                    placeholder="Subject"
                                    value={blastEmailData.subject}
                                    onChange={(e) => setBlastEmailData((prev) => ({...prev, subject: e.target.value}))}
                                    className="w-full p-3 border rounded-lg mb-4 text-lg"
                                />
                                <textarea
                                    placeholder="Message"
                                    value={blastEmailData.body}
                                    onChange={(e) => setBlastEmailData((prev) => ({...prev, body: e.target.value}))}
                                    className="w-full p-3 border rounded-lg mb-4 text-lg h-32"
                                />
                                <div className="flex justify-end gap-4" >
                                    <button
                                        onClick={() => setShowBlastModal(false)}
                                        className="px-6 py-2 bg-gray-400 text-white rounded-lg text-lg"
                                    >
                                        Cancel
                                    </button >
                                    <button
                                        onClick={handleBlastEmail}
                                        className="px-6 py-2 bg-blue-500 text-white rounded-lg text-lg"
                                    >
                                        Send
                                    </button >
                                </div >
                            </div >
                        </div >
                    )}
                    {showCancelModal && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" >
                            <div className="bg-white p-6 rounded-lg shadow-lg w-[500px]" >
                                <h2 className="text-2xl font-bold mb-6" >Send Cancel Email</h2 >
                                <p className="mb-4 text-lg" >To: {emailData.to}</p >
                                <input
                                    type="text"
                                    placeholder="Subject"
                                    value={emailData.subject}
                                    onChange={(e) => setEmailData((prev) => ({...prev, subject: e.target.value}))}
                                    className="w-full p-3 border rounded-lg mb-4 text-lg"
                                />
                                <textarea
                                    placeholder="Message"
                                    value={emailData.body}
                                    onChange={(e) => setEmailData((prev) => ({...prev, body: e.target.value}))}
                                    className="w-full p-3 border rounded-lg mb-4 text-lg h-32"
                                />
                                <div className="flex justify-end gap-4" >
                                    <button
                                        onClick={() => setShowCancelModal(false)}
                                        className="px-6 py-2 bg-gray-400 text-white rounded-lg text-lg"
                                    >
                                        Cancel
                                    </button >
                                    <button
                                        onClick={() =>
                                            handleAttendeeCancel(
                                                eventData.eventId,
                                                eventData.rsvpId,
                                                emailData.to,
                                                eventData.attendeeUserId
                                            )
                                        }
                                        className="px-6 py-2 bg-blue-500 text-white rounded-lg text-lg"
                                    >
                                        Send
                                    </button >
                                </div >
                            </div >
                        </div >
                    )}
                </div >
            </div >
            <FooterComponent />
        </>
    );
};

export default HostEventPage;
