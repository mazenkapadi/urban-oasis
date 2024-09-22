export const eventData = {
    eventId: null, // Placeholder for the actual event ID
    title: null,
    description: null,
    date: null, // Date of the event
    startTime: null, // Start time of the event
    endTime: null, // End time of the event
    location: {
        line1: null,
        line2: null,
        city: null,
        state: null,
        zip: null,
    },
    hostId: null, // ID of the user hosting the event
    attendees: [], // List of user IDs attending the event
    rsvpStatus: null, // Status of the user's RSVP (e.g., 'going', 'interested', 'not going')
    createdAt: new Date(),
    updatedAt: new Date(),
    isPublic: true, // Indicates if the event is public or private
    categories: [], // Array of categories or tags related to the event
    images: [], // Array of URLs for images related to the event
    capacity: null, // Maximum number of attendees
    currentAttendeesCount: 0, // Current number of attendees
};