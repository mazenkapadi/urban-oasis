import Stripe from 'stripe';

const stripe = new Stripe(process.env.VITE_STRIPE_SECRET_KEY);

export async function POST(req) {
    const reqBody = await req.json();

    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: `${reqBody.eventTitle} - ${reqBody.eventDateTime}`,
                    },
                    unit_amount: reqBody.price * 100,
                },
                quantity: reqBody.quantity,
                adjustable_quantity: {
                    enabled: true,
                    minimum: 1,
                    maximum: 10,
                }
            }
        ],
        metadata: {
            eventId: reqBody.eventId,
            userId: reqBody.userId,
            email: reqBody.email,
            quantity: reqBody.quantity,
        },
        mode: 'payment',
        success_url: `https://urban-oasis490.vercel.app/paymentSuccess`,
        cancel_url: `https://urban-oasis490.vercel.app/paymentCancel`,

    });
    console.log(session.url);
    return new Response(session.url);
}