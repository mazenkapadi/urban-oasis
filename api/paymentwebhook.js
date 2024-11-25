import { db } from '../src/firebaseConfig.js';
import { doc, setDoc, updateDoc, increment } from 'firebase/firestore';

export async function POST(req) {
    try {
        const event = await req.json();

        if (event.type !== 'checkout.session.completed') {
            return new Response('Event type not handled', { status: 400 });
        }

        const session = event.data.object;

        const { metadata, amount_total, customer_details } = session;
        const { userId, eventId, quantity } = metadata;
        const email = customer_details?.email;

        const rsvpData = {
            userId,
            eventId,
            quantity: parseInt(quantity),
            amountPaid: amount_total / 100,
            email,
            createdAt: new Date().toISOString(),
        };

        const eventRsvpsDocRef = doc(db, 'EventRSVPs', eventId);
        const userRsvpsDocRef = doc(db, 'UserRSVPs', userId);
        const eventDocRef = doc(db, 'Events', eventId);

        await setDoc(
            eventRsvpsDocRef,
            {
                rsvps: {
                    [session.id]: rsvpData,
                },
            },
            { merge: true }
        );

        await setDoc(
            userRsvpsDocRef,
            {
                rsvps: {
                    [session.id]: rsvpData,
                },
            },
            { merge: true }
        );

        await updateDoc(eventDocRef, {
            attendeesCount: increment(parseInt(quantity)),
        });

        console.log('Checkout session processed successfully:', session.id);

        return new Response('Event processed successfully', { status: 200 });
    } catch (error) {
        console.error('Error processing webhook:', error);
        return new Response('Error processing webhook', { status: 500 });
    }
}
