import { useEffect } from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
    useEffect(() => {
        const element = document.getElementById('animated-text');
        if (element) {
            element.classList.add('animate-pulse'); // Apply animation on component mount
        }
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-6xl font-bold text-gray-800 mb-4" id="animated-text">404</h1>
            <p className="text-2xl text-gray-600 mb-8">Oops! The page you're looking for doesn't exist.</p>
            <Link to="/" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
                Go Back Home
            </Link>
        </div>
    );
}

export default NotFound;