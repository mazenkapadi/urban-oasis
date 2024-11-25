import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../../firebaseConfig.js";
import PhotoCarousel from "../../components/Carousels/PhotoCarousel.jsx";
import HeaderComponent from "../../components/HeaderComponent.jsx";
import FooterComponent from "../../components/FooterComponent.jsx";
import LoadingPage from "../service/LoadingPage.jsx";

const HostEventPage = () => {
    const {eventId} = useParams();
    const [ eventTitle, setEventTitle ] = useState('');
    const [ eventDescription, setEventDescription ] = useState('');
    const [ eventLocation, setEventLocation ] = useState('');
    const [ eventDateTime, setEventDateTime ] = useState('');
    const [ eventPrice, setEventPrice ] = useState('');
    const [ eventImages, setEventImages ] = useState([]);
    const [ isPaidEvent, setIsPaidEvent ] = useState(false);
    const [ userId, setUserId ] = useState(null);

    const [ hostDetails, setHostDetails ] = useState({
        bio: '',
        companyName: '',
        website: '',
        hostLocation: {city: '', state: ''},
    });

    const [ loading, setLoading ] = useState(true);
    const [ isHost, setIsHost ] = useState(false); // To check if user is host
    const [ editable, setEditable ] = useState(false); // Edit mode for host details
    const [ ticketQuantity, setTicketQuantity ] = useState([]);
    const [ attendeeId, setAttendeeId ] = useState([]);
    const [ attendeeDetails, setAttendeeDetails ] = useState([]);

    // Get Authenticated User ID
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
            }
        });
        return () => unsubscribe();
    }, []);

    // Fetch event and host data
    useEffect(() => {
        const fetchEventData = async () => {
            if (eventId) {
                const docRef = doc(db, 'Events', eventId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setEventTitle(data.basicInfo.title);
                    setEventDescription(data.basicInfo.description);
                    setEventDateTime(data.eventDetails.eventDateTime.toDate().toLocaleDateString());
                    setIsPaidEvent(data.eventDetails.paidEvent);
                    setEventPrice(data.eventDetails.eventPrice === 0 ? "Free" : data.eventDetails.eventPrice);
                    setEventLocation(data.basicInfo.location);

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

                const docRef2 = doc(db, 'EventRSVPs', eventId);
                const docSnap2 = await getDoc(docRef2);

                if (docSnap2.exists()) {
                    const data = docSnap2.data();
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

    const toggleEditMode = () => setEditable(!editable);

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

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setHostDetails((prevDetails) => ({...prevDetails, [name]: value}));
    };

    if (loading) {
        return <LoadingPage />;
    }

    const handleModifyButton = (e) => {

    };
    const handleContactButton = (e) => {

    };

    return (
        <>
            <HeaderComponent />
            <div className="event-page py-10 px-4 pt-32 bg-gray-200 min-h-screen" >
                <div className="box-border bg-white p-8 rounded-lg shadow-lg" >
                    <PhotoCarousel eventId={eventId} eventTitle={eventTitle} />

                    <div className="flex flex-col mt-6" >
                        <h1 className="text-3xl font-bold" >{eventTitle}</h1 >
                        <p className="text-gray-500" >{eventDateTime}</p >
                        <p className="mt-4" >{eventDescription}</p >

                        {isHost && (
                            <div className="host-details mt-8" >
                                <h2 className="text-2xl font-bold" >Host Information</h2 >

                                <div className="mt-4" >
                                    <label className="block text-gray-600" >Company Name</label >
                                    <input
                                        type="text"
                                        name="companyName"
                                        value={hostDetails.companyName}
                                        onChange={handleInputChange}
                                        disabled={!editable}
                                        className="input-field"
                                    />

                                    <label className="block text-gray-600 mt-4" >Bio</label >
                                    <textarea
                                        name="bio"
                                        value={hostDetails.bio}
                                        onChange={handleInputChange}
                                        disabled={!editable}
                                        className="input-field"
                                    />

                                    <label className="block text-gray-600 mt-4" >Website</label >
                                    <input
                                        type="text"
                                        name="website"
                                        value={hostDetails.website}
                                        onChange={handleInputChange}
                                        disabled={!editable}
                                        className="input-field"
                                    />

                                    <label className="block text-gray-600 mt-4" >Location</label >
                                    <input
                                        type="text"
                                        name="hostLocation.city"
                                        value={hostDetails.hostLocation.city}
                                        onChange={handleInputChange}
                                        disabled={!editable}
                                        className="input-field"
                                        placeholder="City"
                                    />
                                    <input
                                        type="text"
                                        name="hostLocation.state"
                                        value={hostDetails.hostLocation.state}
                                        onChange={handleInputChange}
                                        disabled={!editable}
                                        className="input-field"
                                        placeholder="State"
                                    />

                                    <div className="mt-4" >
                                        <button
                                            className={`button ${editable ? 'bg-green-500' : 'bg-blue-500'}`}
                                            onClick={toggleEditMode}
                                        >
                                            {editable ? 'Save' : 'Edit'}
                                        </button >
                                        {editable && (
                                            <button
                                                className="button bg-gray-500 ml-2"
                                                onClick={handleUpdateHostDetails}
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
                        // <div>
                        //     <label className="block text-gray-600 mt-4">Attendees</label>
                        //     <div className="">
                        //         <div
                        //             className="block text-gray-600 mt-4">{attendeeDetails.map((attendee, index) => (
                        //             <div className="flex items-center" key={index}>
                        //                 <p>{attendee.firstName} {attendee.lastName} -
                        //                     Tickets held: {attendee.quantity}</p>
                        //                 <button className="button bg-accent-purple m-2 ml-auto"
                        //                         onClick={handleModifyButton}>
                        //                     Modify Quantity
                        //                 </button>
                        //                 <button className="button bg-gray-500"
                        //                         onClick={handleContactButton}>
                        //                     Contact Attendee
                        //                 </button>
                        //             </div>
                        //         ))}</div>
                        //     </div>
                        // </div>

                        <div className="mt-6" >
                            <label className=" text-Dark-D2a font-lalezar text-body font-medium mb-2" >
                                Attendees
                            </label >
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
                                                onClick={handleModifyButton}
                                            >
                                                Cancel Ticket
                                            </button >
                                            <button
                                                className="bg-Dark-D1 text-Light-L1 font-roboto text-button font-bold px-4 py-2 rounded-lg transition-transform transform hover:scale-105"
                                                onClick={handleContactButton}
                                            >
                                                Contact Attendee
                                            </button >
                                        </div >
                                    </div >
                                ))}
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