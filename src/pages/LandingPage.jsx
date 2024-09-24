import HeaderComponent from "../components/HeaderComponent.jsx";
import FooterComponent from "../components/FooterComponent.jsx";
import EventCarousel from "../components/EventCarousel.jsx";
import PhotoCarousel from "../components/PhotoCarousel.jsx";
import React from "react";

function LandingPage() {

    const images = [
        'https://via.placeholder.com/600x400?text=Slide+1',
        'https://via.placeholder.com/600x400?text=Slide+2',
        'https://via.placeholder.com/600x400?text=Slide+3',
    ];

    return (
        <>
            <HeaderComponent />
            <div className="pt-24">
                <div className="container mx-auto px-6 py-12" >
                    <div className="text-center mb-16" >
                        <h1 className="text-5xl font-bold mb-6 text-gray-800" >Welcome to UrbanOasis</h1 >
                        <p className="text-xl text-gray-600" >Discover events and manage your community seamlessly</p >
                    </div >
                    <div className="space-y-16" >
                        <div className="photo-carousel" >
                            <PhotoCarousel images={images} />
                        </div >
                        <div className="event-carousel" >
                            <EventCarousel />
                        </div >
                    </div >
                </div >
            </div >
            <FooterComponent />
        </>
    );

}

export default LandingPage;