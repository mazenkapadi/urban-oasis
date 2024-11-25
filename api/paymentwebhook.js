import { doc, setDoc, updateDoc, increment, getFirestore } from 'firebase/firestore';
import { initializeApp } from "firebase/app";

const FIREBASE_KEY = {
    apiKey: process.env.VITE_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.VITE_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.VITE_PUBLIC_FIREBASE_MEASUREMENT_ID,
    weatherApiKey: process.env.VITE_WEATHER_API_KEY,
    geoApiKey: process.env.VITE_WEATHER_API_KEY,
    gmKey: process.env.VITE_WEATHER_GM_KEY,
    locationKey: process.env.VITE_LOCATION_KEY,
}
const app = initializeApp(FIREBASE_KEY);

const db = getFirestore(app);

export async function POST(req) {
    try {
        const event = await req.json();

        if (event.type !== 'checkout.session.completed') {
            return new Response('Event type not handled', {status: 400});
        }

        const session = event.data.object;

        const {metadata, amount_total, customer_details} = session;
        const {userId, eventId, quantity} = metadata;
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
            {merge: true}
        );

        await setDoc(
            userRsvpsDocRef,
            {
                rsvps: {
                    [session.id]: rsvpData,
                },
            },
            {merge: true}
        );

        await updateDoc(eventDocRef, {
            attendeesCount: increment(parseInt(quantity)),
        });

        console.log('Checkout session processed successfully:', session.id);

        return new Response('Event processed successfully', {status: 200});
    } catch (error) {
        console.error('Error processing webhook:', error);
        return new Response('Error processing webhook', {status: 500});
    }
}
