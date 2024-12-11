import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const LoadingPage = () => {
    useEffect(() => {
        const element = document.getElementById('animated-text');
        if (element) {
            element.classList.add('animate-pulse');
        }
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-primary-dark text-primary-light">
            <h1 className="text-h1 font-black font-lalezar text-accent-blue mb-6" id="animated-text">
                Loading...
            </h1>
            <p className="text-h3 font-medium text-Light-L1 mb-8">
                Please wait while we fetch your content.
            </p>
            <Link
                to="/"
                className="bg-accent-orange hover:bg-accent-red text-primary-light font-bold py-3 px-6 rounded-md text-button transition"
            >
                Go Back Home
            </Link>
        </div>
    );
};

export default LoadingPage;
