import React, { useState } from "react";
import HeroCarousel from "../components/Carousels/HeroCarousel.jsx";
import HeaderComponent from "../components/HeaderComponent.jsx";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Link } from 'react-router-dom';
import FooterComponent from "../components/FooterComponent.jsx";

function AboutPage() {
    const [ reviewerName, setReviewerName ] = useState('');
    const [ reviewContent, setReviewContent ] = useState('');
    const [ error, setError ] = useState('');
    const [ successMessage, setSuccessMessage ] = useState('');

    const maxReviewLength = 140;

    // Submit review to Firestore
    const handleReviewSubmit = async () => {
        if (!reviewerName || !reviewContent) {
            setError("Please fill in all fields.");
            return;
        }

        try {
            await addDoc(collection(db, "Testimonials"), {
                name: reviewerName,
                content: reviewContent,
                createdAt: Timestamp.now(),
            });
            setReviewerName('');
            setReviewContent('');
            setError('');
            setSuccessMessage("Thank you for your review!");
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            setError("Failed to submit review. Please try again.");
            console.error("Error writing review to Firestore:", error);
        }
    };

    return (
        <div className="relative flex flex-col min-h-screen bg-primary-light text-primary-dark" >
            <div className="absolute top-0 left-0 w-full z-20" >
                <HeaderComponent />
            </div >
            <div className="relative h-screen w-full" >
                <HeroCarousel />
                <div
                    className="absolute inset-0 flex items-center justify-center px-4 md:px-12 py-12"
                    style={{
                        backgroundColor: "rgba(0, 0, 0, 0.4)",
                    }}
                >
                    <div className="text-left text-white max-w-3xl" >
                        <h1
                            className="text-5xl font-bold mb-6"
                            style={{
                                textShadow: "3px 3px 4px rgba(0, 0, 0, 0.7)",
                            }}
                        >
                            About Us
                        </h1 >
                        <div
                            className="text-lg leading-relaxed space-y-6"
                            style={{
                                textShadow: "3px 3px 4px rgba(0, 0, 0, 0.7)",
                            }}
                        >
                            <p >
                                Welcome to UrbanOasis! Our mission is to make it easy for you to find and attend events,
                                engage with your community, and discover new ways to connect with others. We believe in
                                fostering a community-centric environment that brings people together and strengthens
                                relationships.
                            </p >
                            <p >
                                Our platform offers a seamless experience for event organizers and attendees alike,
                                allowing you to effortlessly discover, create, and manage events that matter. Whether
                                you’re looking for concerts, workshops, or local gatherings, UrbanOasis is here to help.
                            </p >
                            <p >
                                Thank you for choosing UrbanOasis to enhance your community experience. We are
                                constantly working on new features and improvements to better serve you, so stay tuned!
                            </p >
                        </div >
                    </div >
                </div >
            </div >



            {/*<div className="flex flex-col md:flex-row items-start justify-between bg-gray-100 py-8 px-12 md:px-12" >*/}
            {/*    <div className="md:w-1/2 flex flex-col justify-start space-y-4 mb-6 md:mb-0 md:pr-8" >*/}
            {/*        <h2 className="text-3xl font-bold text-primary-dark" >Leave us a review!</h2 >*/}
            {/*        {error && <p className="text-red-500" >{error}</p >}*/}
            {/*        {successMessage && <p className="text-green-500" >{successMessage}</p >}*/}

            {/*        <p className="text-gray-700" >*/}
            {/*            <span >Need more space for your thoughts? Feel free to reach out on our </span >*/}
            {/*            <Link to="/support" className="text-blue-500 underline hover:text-blue-700 transition-colors" >*/}
            {/*                support page*/}
            {/*            </Link >*/}
            {/*            <span > for additional help or to leave a longer review.</span >*/}
            {/*        </p >*/}
            {/*    </div >*/}

            {/*    <div*/}
            {/*        className="md:w-1/2 flex flex-col items-end bg-white p-6 rounded-lg shadow-lg w-full max-w-lg space-y-4" >*/}
            {/*        <div className="w-full" >*/}
            {/*            <label className="block text-gray-700 font-semibold mb-2" >Your Name</label >*/}
            {/*            <input*/}
            {/*                type="text"*/}
            {/*                value={reviewerName}*/}
            {/*                onChange={(e) => setReviewerName(e.target.value)}*/}
            {/*                className="w-full px-4 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"*/}
            {/*                required*/}
            {/*            />*/}
            {/*        </div >*/}
            {/*        <div className="w-full" >*/}
            {/*            <label className="block text-gray-700 font-semibold mb-2" >Your Review</label >*/}
            {/*            <textarea*/}
            {/*                value={reviewContent}*/}
            {/*                onChange={(e) => setReviewContent(e.target.value)}*/}
            {/*                className="w-full px-4 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"*/}
            {/*                rows="4"*/}
            {/*                maxLength={maxReviewLength}*/}
            {/*                required*/}
            {/*            />*/}
            {/*            <p className="text-sm text-gray-500 mt-1 text-right" >*/}
            {/*                {reviewContent.length}/{maxReviewLength} characters*/}
            {/*            </p >*/}
            {/*        </div >*/}
            {/*        <button*/}
            {/*            onClick={handleReviewSubmit}*/}
            {/*            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"*/}
            {/*        >*/}
            {/*            Submit Review*/}
            {/*        </button >*/}
            {/*    </div >*/}
            {/*</div >*/}


            <div className="flex flex-col md:flex-row items-start justify-between bg-gray-100 py-8 px-12 md:px-16">
                {/* Left Column - Text Section */}
                <div className="md:w-1/2 flex flex-col justify-start space-y-4 mb-6 md:mb-0 pr-10">
                    <h2 className="text-3xl font-bold text-primary-dark">Leave us a review!</h2>
                    {error && <p className="text-red-500">{error}</p>}
                    {successMessage && <p className="text-green-500">{successMessage}</p>}

                    <p className="text-gray-700">
                        <span>Need more space for your thoughts? Feel free to reach out on our </span>
                        <Link to="/support" className="text-blue-500 underline hover:text-blue-700 transition-colors">
                            support page
                        </Link>
                        <span> for additional help or to leave a longer review.</span>
                    </p>
                </div>

                {/* Right Column - Form Section */}
                <div className="md:w-1/2 flex flex-col items-end bg-white p-8 rounded-lg shadow-lg w-full max-w-lg space-y-4">
                    <div className="w-full">
                        <label className="block text-gray-700 font-semibold mb-2">Your Name</label>
                        <input
                            type="text"
                            value={reviewerName}
                            onChange={(e) => setReviewerName(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div className="w-full">
                        <label className="block text-gray-700 font-semibold mb-2">Your Review</label>
                        <textarea
                            value={reviewContent}
                            onChange={(e) => setReviewContent(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows="4"
                            maxLength={maxReviewLength}
                            required
                        />
                        <p className="text-sm text-gray-500 mt-1 text-right">
                            {reviewContent.length}/{maxReviewLength} characters
                        </p>
                    </div>
                    <button
                        onClick={handleReviewSubmit}
                        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
                    >
                        Submit Review
                    </button>
                </div>
            </div>
            <FooterComponent/>
        </div >
    );
}

export default AboutPage;
