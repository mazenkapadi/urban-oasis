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
        <div className="flex flex-col items-center justify-center min-h-screen bg-primary-dark text-primary-light">
            <h1 className="text-h1 font-black font-lalezar text-accent-orange mb-6" id="animated-text">
                404
            </h1>
            <p className="text-h3 font-medium text-Light-L1 mb-8">
                Oops! The page you're looking for doesn't exist.
            </p>
            <Link
                to="/"
                className="bg-accent-blue hover:bg-accent-purple text-primary-light font-bold py-3 px-6 rounded-md text-button transition"
            >
                Go Back Home
            </Link>
        </div>
    );
}

export default NotFound;
