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
        <div className="relative flex flex-col min-h-screen bg-primary-dark text-Light-L1 font-roboto" >
            <div className="absolute top-0 left-0 w-full z-20" id="about-hero" >
                <HeaderComponent />
            </div >

            <div className="relative h-screen w-full" >
                <HeroCarousel />
                <div
                    className="absolute inset-0 flex items-center justify-center px-4 md:px-12 py-12"
                    style={{
                        backgroundColor: "rgba(10, 12, 15, 0.8)",
                    }}
                >
                    <div className="text-left text-Light-L1 max-w-3xl" >
                        <h1 className="text-h1 font-lalezar mb-6" >
                            About Us
                        </h1 >
                        <div className="text-body leading-relaxed space-y-6" >
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

            <div className="flex flex-col md:flex-row items-start justify-between bg-Dark-D2 py-8 px-12 md:px-16" >
                <div className="md:w-1/2 flex flex-col justify-start space-y-4 mb-6 md:mb-0 pr-10" >
                    <h2 className="text-h3 font-bold text-Light-L1" >Leave us a review!</h2 >
                    {error && <p className="text-accent-red" >{error}</p >}
                    {successMessage && <p className="text-accent-blue" >{successMessage}</p >}

                    <p className="text-Light-L1" >
                        <span >Need more space for your thoughts? Feel free to reach out on our </span >
                        <Link to="/support" className="text-accent-blue hover:text-accent-purple transition-colors" >
                            support page
                        </Link >
                        <span > for additional help or to leave a longer review.</span >
                    </p >
                </div >

                <div
                    className="md:w-1/2 flex flex-col items-end bg-Dark-D1 p-8 rounded-lg shadow-lg w-full max-w-lg space-y-4" >
                    <div className="w-full" >
                        <label className="block text-Light-L1 font-medium mb-2" >Your Name</label >
                        <input
                            type="text"
                            value={reviewerName}
                            onChange={(e) => setReviewerName(e.target.value)}
                            className="w-full px-4 py-2 border border-Light-L2 rounded-md bg-Dark-D2 text-Light-L1 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-hidden"
                            required
                        />
                    </div >
                    <div className="w-full" >
                        <label className="block text-Light-L1 font-medium mb-2" >Your Review</label >
                        <textarea
                            value={reviewContent}
                            onChange={(e) => setReviewContent(e.target.value)}
                            className="w-full px-4 py-2 border border-Light-L2 rounded-md bg-Dark-D2 text-Light-L1 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-hidden"
                            rows="4"
                            maxLength={maxReviewLength}
                            required
                        />
                        <p className="text-small text-Light-L3 mt-1 text-right" >
                            {reviewContent.length}/{maxReviewLength} characters
                        </p >
                    </div >
                    <button
                        onClick={handleReviewSubmit}
                        className="w-full bg-accent-blue text-Light-L1 py-2 rounded-md hover:bg-accent-purple transition"
                    >
                        Submit Review
                    </button >
                </div >
            </div >
            <FooterComponent />
        </div >
    );
}

export default AboutPage;
