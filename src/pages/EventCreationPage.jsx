import {useState} from 'react';
import eventCreation from "../services/eventCreation.js";


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
    const [setError] = useState(null);



    const handleSubmit = async () => {
        if (!eventTitle || !eventDescription || !eventLocation || !eventDate || !eventTime || !eventCapacity) {
            setError('Event Title, Event Description, Event Location, Event Date, Event Time, and Event Capacity are required');
            return;
        }

        const eventData = {
            title: eventTitle,
            description: eventDescription,
            location: eventLocation,
            date: eventDate,
            time: eventTime,
            capacity: eventCapacity,
            image: eventImage,
            paidEvent: isPaidEvent,
            eventPrice: isPaidEvent ? eventPrice : null,
        };

        try {
            await eventCreation.writeEventData(eventData);
            setError(null);
        } catch (error) {
            setError(error.message);
        }

    };

    return (
        <>
            <div className="event-creation-page p-4">
                <div className="box-border rounded-lg bg-slate-300 p-6">
                    <h1 className="text-4xl text-slate-900 font-bold pb-3">Create Your Event</h1>
                    <form onSubmit={handleSubmit} className="flex flex-col space-y-4 pt-4">
                        <div className="flex flex-col">
                            <label htmlFor="eventTitle" className="text-italic font-bold text-slate-900">
                                Title
                            </label>
                            <input
                                type="text"
                                id="eventTitle"
                                value={eventTitle}
                                onChange={(e) => setEventTitle(e.target.value)}
                                placeholder="Enter event title"
                                className="pb-3 rounded-lg border border-slate-300 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="eventDescription" className="text-italic font-bold text-slate-900">
                                Description
                            </label>
                            <input
                                id="eventDescription"
                                value={eventDescription}
                                onChange={(e) => setEventDescription(e.target.value)}
                                placeholder="Enter event description"

                                className="pb-3 rounded-lg border border-slate-300 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="eventLocation" className="text-italic font-bold text-slate-900">
                                Location
                            </label>
                            <input
                                type="text"
                                id="eventLocation"
                                value={eventLocation}
                                onChange={(e) => setEventLocation(e.target.value)}
                                placeholder="Enter event location"
                                className="rounded-lg border border-slate-300 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                            />
                        </div>

                        <div
                            className="flex flex-row items-center pt-3">
                            <label htmlFor="eventDate" className="text-italic font-bold text-slate-900 mr-4">
                                Date
                            </label>
                            <input
                                type="date"
                                id="eventDate"
                                value={eventDate}
                                onChange={(e) => setEventDate(e.target.value)}
                                className="pb-3 rounded-lg w-full border border-slate-300 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                            />
                            <label htmlFor="eventTime" className="pe-3 text-italic font-bold text-slate-900 ml-4">
                                Time
                            </label>
                            <input
                                type="time"
                                id="eventTime"
                                value={eventTime}
                                onChange={(e) => setEventTime(e.target.value)}
                                className="pb-3 rounded-lg w-full border border-slate-300 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="eventCapacity" className="text-italic font-bold text-slate-900">
                                Capacity
                            </label>
                            <input
                                type="number"
                                id="eventCapacity"
                                value={eventCapacity}
                                onChange={(e) => setEventCapacity(e.target.value)}
                                placeholder="Enter event capacity"
                                className="pb-3 rounded-lg border border-slate-300 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="eventImage" className="text-italic font-bold text-slate-900">
                                Image
                            </label>
                            <input
                                type="file"
                                id="eventImage"
                                accept="image/*"
                                onChange={(e) => setEventImage(e.target.files[0])}
                                className="pb-3 rounded-lg border border-slate-300 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"

                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="isPaidEvent" className="text-italic font-bold text-slate-900">
                                Is this a paid event?
                            </label>

                            <div className="flex flex-row space-x-3">
                                <label htmlFor="isPaidEventNo">Yes </label>
                                <input
                                    type="radio"
                                    id="isPaidEventYes"
                                    name="isPaidEvent"
                                    value="true"
                                    checked={isPaidEvent}
                                    onChange={() => setIsPaidEvent(true)}
                                />
                            </div>

                            <div className="flex flex-row space-x-4">
                                <label htmlFor="isPaidEventNo">No </label>
                                <input
                                    type="radio"
                                    id="isPaidEventNo"
                                    name="isPaidEvent"
                                    value="false"
                                    checked={!isPaidEvent}
                                    onChange={() => setIsPaidEvent(false)}
                                />
                            </div>

                            {isPaidEvent && (
                                <div className="flex flex-col">
                                    <label htmlFor="eventPrice" className="pt-3 text-italic font-bold text-slate-900">
                                        Ticket Price
                                    </label>
                                    <input
                                        type="text"
                                        id="eventPrice"
                                        value={eventPrice}
                                        onChange={(e) => {
                                            const price = e.target.value.replace(/[^0-9.]/g, '');
                                            setEventPrice(`$${price}`);
                                        }}
                                        placeholder="Enter ticket price"
                                        className="rounded-lg border border-slate-300 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                                    />
                                </div>
                            )}
                        </div>

                        <button type="submit"
                                className="bg-slate-900 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg"
                                onClick={handleSubmit}>Create Event
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default EventCreationPage;