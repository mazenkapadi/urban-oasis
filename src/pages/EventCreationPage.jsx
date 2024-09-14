import {useState} from 'react';
import '../styles.css';
import {initializeApp} from "firebase/app";
import FIREBASE_KEY from "../APIKEY_SECRETS/FIREBASE_KEY.js";
import {getFirestore} from "firebase/firestore";

const app = initializeApp(FIREBASE_KEY);
const db = getFirestore(app);

const writeEventData = async (eventData) => {
    try {
        const eventsRef = db.collection('events');
        const newEventRef = eventsRef.doc();
        await newEventRef.set(eventData);
        console.log('Event created successfully!');
    } catch (error) {
        console.error('Error creating event:', error);
    }
};

function EventCreationPage() {
    const [eventTitle, setEventTitle] = useState('');
    const [eventDescription, setEventDescription] = useState('');
    const [eventLocation, setEventLocation] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [eventTime, setEventTime] = useState('');
    const [eventCapacity, setEventCapacity] = useState('');
    const [eventImage, setEventImage] = useState(null);
    const [eventPrice, setEventPrice] = useState('');
    const [isPaidEvent, setIsPaidEvent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log({
            eventTitle,
            eventDescription,
            eventLocation,
            eventDate,
            eventTime,
            eventCapacity,
            eventImage,
            eventPrice,
            isPaidEvent,
        });

        const eventData = {
            title: eventTitle,
            description: eventDescription,
            location: eventLocation,
            date: eventDate,
            time: eventTime,
            capacity: eventCapacity,
            image: eventImage,
            isPaidEvent,
            eventPrice: isPaidEvent ? eventPrice : null,
        };

        await writeEventData(eventData);
    };

    return (
        <div className="event-creation-page">
            <h1>Create Your Event</h1>
            <form onSubmit={handleSubmit}>
                <div className="input-container">
                    <label htmlFor="eventTitle">Event Title <br/><br/> </label>
                    <input
                        type="text"
                        id="eventTitle"
                        value={eventTitle}
                        onChange={(e) => setEventTitle(e.target.value)}
                        placeholder="Enter event title"
                        className="rounded"
                    />
                </div>

                <br/>
                <br/>

                <div className="input-container">
                    <label htmlFor="eventDescription">Event Description <br/><br/></label>
                    <input
                        id="eventDescription"
                        value={eventDescription}
                        onChange={(e) => setEventDescription(e.target.value)}
                        placeholder="Enter event description"
                        className="rounded"
                    />
                </div>
                <br/>
                <br/>

                <div className="input-container">
                    <label htmlFor="eventLocation">Event Location <br/> <br/></label>
                    <input
                        type="text"
                        id="eventLocation"
                        value={eventLocation}
                        onChange={(e) => setEventLocation(e.target.value)}
                        placeholder="Enter event location"
                        className="rounded"
                    />
                </div>
                <br/>
                <br/>

                <div className="input-container">
                    <label htmlFor="eventDate">Event Date <br/><br/> </label>
                    <input
                        type="date"
                        id="eventDate"
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        className="rounded"
                    />
                </div>
                <br/>
                <br/>

                <div className="input-container">
                    <label htmlFor="eventTime">Event Time <br/><br/> </label>
                    <input
                        type="time"
                        id="eventTime"
                        value={eventTime}
                        onChange={(e) => setEventTime(e.target.value)}
                        className="rounded"
                    />
                </div>
                <br/>
                <br/>

                <div className="input-container">
                    <label htmlFor="eventCapacity">Event Capacity <br/> <br/></label>
                    <input
                        type="number"
                        id="eventCapacity"
                        value={eventCapacity}
                        onChange={(e) => setEventCapacity(e.target.value)}
                        placeholder="Enter event capacity"
                        className="rounded"
                    />
                </div>
                <br/>
                <br/>

                <div className="input-container">
                    <label htmlFor="eventImage">Event Image <br/><br/> </label>
                    <input
                        type="file"
                        id="eventImage"
                        accept="image/*"
                        onChange={(e) => setEventImage(e.target.files[0])}
                    />
                </div>

                <br/>
                <br/>

                <div className="input-container">
                    <label htmlFor="isPaidEvent">Is this a paid event?<br/><br/></label>

                    <label htmlFor="isPaidEventNo">Yes</label>

                    <input
                        type="radio"
                        id="isPaidEventYes"
                        name="isPaidEvent"
                        value="true"
                        checked={isPaidEvent}
                        onChange={() => setIsPaidEvent(true)}
                    />
                    <br/>
                    <label htmlFor="isPaidEventNo">No </label>

                    <input
                        type="radio"
                        id="isPaidEventNo"
                        name="isPaidEvent"
                        value="false"
                        checked={!isPaidEvent}
                        onChange={() => setIsPaidEvent(false)}
                    />
                    <br/>
                    <br/>
                    <br/>

                    {isPaidEvent && (
                        <div>
                            <label htmlFor="eventPrice">Ticket Price <br/><br/></label>
                            <input
                                type="text"
                                id="eventPrice"
                                value={eventPrice}
                                onChange={(e) => {
                                    const price = e.target.value.replace(/[^0-9.]/g, '');
                                    setEventPrice(`$${price}`);
                                }}
                                placeholder="Enter ticket price"
                                className="rounded"
                            />
                        </div>
                    )}
                </div>
                <br/>

                <button type="submit">Create Event</button>
            </form>
        </div>
    );
}

export default EventCreationPage;