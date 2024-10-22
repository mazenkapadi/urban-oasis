import { useEffect } from 'react';
import { Link } from 'react-router-dom';

function PaymentSuccess() {
    useEffect(() => {
        const element = document.getElementById('success-text');
        if (element) {
            element.classList.add('animate-pulse');
        }
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100" >
            <h1 className="text-6xl font-bold text-gray-900 mb-4" id="success-text" >Payment Successful!</h1 >
            <p className="text-2xl text-gray-600 mb-4" >Thank you for your purchase. Your transaction has been
                completed.</p >
            <p className="text-gray-400 mb-8" >A confirmation email and your tickets should appear in your email
                shortly</p >
            <Link to="/" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" >
                Go Back Home
            </Link >
        </div >
    );
}

export default PaymentSuccess;
