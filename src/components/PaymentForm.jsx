import React from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const PaymentForm = () => {
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        const cardElement = elements.getElement(CardElement);
        const {error, paymentMethod} = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
        });

        if (error) {
            console.error(error);
        } else {
            console.log('Payment successful', paymentMethod);
            // Handle payment success logic
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 bg-primary-dark text-neutral-white rounded-lg">
            <label className="block mb-2 text-neutral-white">Card details</label>
            <div className="border border-detail-gray p-4 rounded-lg">
                <CardElement
                    options={{
                        style: {
                            base: {
                                color: '#FFFFFF',
                                fontFamily: 'Inter, sans-serif',
                                fontSize: '16px',
                                '::placeholder': {
                                    color: '#9CA3AF',
                                },
                            },
                            invalid: {
                                color: '#F59E0B',
                            },
                        },
                    }}
                />
            </div>
            <button
                type="submit"
                disabled={!stripe}
                className="mt-4 bg-accent-blue text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-600"
            >
                Pay
            </button>
        </form>
    );
};

export default PaymentForm;
