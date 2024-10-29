import Stripe from 'stripe';

// const stripe = new Stripe(import.meta.env.VITE_STRIPE_SECRET_KEY);
const stripe = new Stripe('sk_test_51Q0aMK1ML9Ca0ARWsUClNw2zkqtFnlofxbqI1Am5HSNsLX9Mkz2fCNF8ZrM7YSkvdX46qYtVe8K07ae5X6onBdhG00Yd7taybj');

export async function POST(req) {
    const reqBody = await req.json();

    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: `${reqBody.eventTitle} - ${reqBody.eventDateTime}` ,
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
        mode: 'payment',
        success_url: `http://localhost:3000/paymentSuccess`,
        cancel_url: `http://localhost:3000/paymentCancel`,
        metadata: {
            eventId: reqBody.eventId,
            userId: reqBody.userId,
        },
    });
    console.log(session.url);

    return new Response(session.url);

}