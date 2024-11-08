import { useEffect } from 'react';
import { Link } from 'react-router-dom';

function PaymentCancel() {
    useEffect(() => {
        const element = document.getElementById('cancel-text');
        if (element) {
            element.classList.add('animate-pulse');
        }
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-6xl font-bold text-red-600 mb-4" id="cancel-text">Payment Cancelled</h1>
            <p className="text-2xl text-gray-600 mb-8">It looks like your payment was not completed. Please try again.</p>
            <Link to="/" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Go Back Home
            </Link>
        </div>
    );
}

export default PaymentCancel;
