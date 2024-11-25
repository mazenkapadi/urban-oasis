import { db } from '../src/firebaseConfig.js'; // Import your Firebase configuration
import { doc, setDoc, updateDoc, increment } from 'firebase/firestore';

export async function POST(req) {
    try {
        // Parse the incoming JSON
        const event = await req.json();

        // Verify the event type
        if (event.type !== 'checkout.session.completed') {
            return new Response('Event type not handled', { status: 400 });
        }

        // Extract the checkout session details
        const session = event.data.object;

        // Extract metadata from the session
        const { metadata, amount_total, customer_details } = session;
        const { userId, eventId, quantity } = metadata;
        const email = customer_details?.email;

        // Prepare RSVP data
        const rsvpData = {
            userId,
            eventId,
            quantity: parseInt(quantity),
            amountPaid: amount_total / 100, // Convert amount from cents to dollars
            email,
            createdAt: new Date().toISOString(),
        };

        // Update Firebase
        const eventRsvpsDocRef = doc(db, 'EventRSVPs', eventId);
        const userRsvpsDocRef = doc(db, 'UserRSVPs', userId);
        const eventDocRef = doc(db, 'Events', eventId);

        // Save RSVP to EventRSVPs collection
        await setDoc(
            eventRsvpsDocRef,
            {
                rsvps: {
                    [session.id]: rsvpData, // Use the session ID as the unique RSVP ID
                },
            },
            { merge: true }
        );

        // Save RSVP to UserRSVPs collection
        await setDoc(
            userRsvpsDocRef,
            {
                rsvps: {
                    [session.id]: rsvpData,
                },
            },
            { merge: true }
        );

        // Update the event attendee count
        await updateDoc(eventDocRef, {
            attendeesCount: increment(parseInt(quantity)), // Increment attendees by quantity
        });

        console.log('Checkout session processed successfully:', session.id);

        return new Response('Event processed successfully', { status: 200 });
    } catch (error) {
        console.error('Error processing webhook:', error);
        return new Response('Error processing webhook', { status: 500 });
    }
}
