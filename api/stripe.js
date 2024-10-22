import Stripe from 'stripe';
import { db } from '../src/firebaseConfig.js';

const stripe = new Stripe(import.meta.env.VITE_STRIPE_SECRET_KEY);

export async function POST(req) {
    const {eventId, quantity, totalPrice, eventTitle, userId} = await req.json();

    const session = await stripe.checkout.sessions.create({
        payment_method_types: [ 'card' ],
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: eventTitle,
                    },
                    unit_amount: totalPrice * 100, // Stripe expects amount in cents
                },
                quantity: quantity,
            }
        ],
        mode: 'payment',
        success_url: `https://example.com?success=true`,
        cancel_url: `https://example.com?canceled=true`,
        metadata: {
            eventId: eventId,
            userId: userId,
        }
    });
    return new Response(session.url);
    // return new Response(null, {
    //     status: 303,
    //     headers: {
    //         Location: session.url,
    //     },
    // });

}