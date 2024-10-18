import express from 'express';
import { Stripe } from 'stripe';
import { db} from "../firebaseConfig.js";


const stripe = new Stripe(import.meta.process.env.VITE_STRIPE_SECRET_KEY); // Access environment variables with process.env

const app = express();

app.use(express.json());

app.post('/api/create-checkout-session', async (req,res) => {

    const { eventId, quantity, totalPrice, eventTitle, userId } = req.body;

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data:{
                        currency: 'usd',
                        product_data: {
                            name: eventTitle,
                        },
                        unit_amount: totalPrice * 100,
                    },
                    quantity: quantity,
                }
            ],
            mode:'payment',

            // TODO: Figure out how to redirect to the correct page

            success_url: `${import.meta.process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${import.meta.process.env.FRONTEND_URL}/cancel`,

            metadata:{
                eventId: eventId,
                userId: userId,
            },
        });

        res.status(200).json({ sessionId: session.id });
    } catch (error) {
        console.error('Error creating Stripe Checkout session:', error);
        res.status(500).json({ error: error.message });
    }
});

const PORT = import.meta.process.env.PORT || 4242;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));