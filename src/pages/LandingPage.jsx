import HeaderComponent from "../components/HeaderComponent.jsx";
import FooterComponent from "../components/FooterComponent.jsx";
import EventCarousel from "../components/EventCarousel.jsx";
import PhotoCarousel from "../components/PhotoCarousel.jsx";
import React from "react";

function LandingPage() {
    const defaultEventId = "landingPageEvent";  // Replace with actual eventId if needed
    const defaultEventTitle = "LandingPage";

    return (
        <>
            <div className="flex flex-col min-h-screen bg-primary-dark text-primary-light" >
                <HeaderComponent />
                <div className="flex-grow pt-24 bg-primary-light text-primary-dark" >
                    <div className="container mx-auto px-6 py-12" >
                        <div className="text-center mb-16" >
                            <h1 className="text-5xl font-bold mb-6 text-primary-dark" >Welcome to UrbanOasis</h1 >
                            <p className="text-xl text-text-gray" >
                                Discover events and manage your community seamlessly
                            </p >
                        </div >
                        <div className="space-y-16" >
                            <div className="photo-carousel" >
                                <PhotoCarousel eventId={defaultEventId} eventTitle={defaultEventTitle} />
                            </div >
                            <div className="event-carousel" >
                                <EventCarousel />
                            </div >
                        </div >
                    </div >
                </div >
                <FooterComponent />
            </div >
        </>
    );
}

export default LandingPage;
