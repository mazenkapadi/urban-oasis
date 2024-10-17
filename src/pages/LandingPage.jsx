// import React from "react";
// import HeaderComponent from "../components/HeaderComponent.jsx";
// import FooterComponent from "../components/FooterComponent.jsx";
// import EventCarousel from "../components/EventCarousel.jsx";
// import HeroCarousel from "../components/HeroCarousel.jsx"; // Import the new HeroCarousel
//
// function LandingPage() {
//     return (
//         <>
//             <div className="flex flex-col min-h-screen text-primary-light" >
//                 <HeaderComponent />
//
//                 {/* HeroCarousel Section */}
//                 <div className="relative overflow-hidden h-screen" >
//                     <HeroCarousel />
//                 </div >
//
//                 {/* Main Content Section */}
//                 <div className="flex-grow pt-12 bg-primary-light text-primary-dark" >
//                     <div className="container mx-auto px-6 py-12" >
//                         <div className="text-center mb-16" >
//                             <h1 className="text-5xl font-bold mb-6 text-primary-dark" >
//                                 Welcome to UrbanOasis
//                             </h1 >
//                             <p className="text-xl text-text-gray" >
//                                 Discover events and manage your community seamlessly
//                             </p >
//                         </div >
//                         <div className="space-y-16" >
//                             <div className="event-carousel" >
//                                 <EventCarousel />
//                             </div >
//                         </div >
//                     </div >
//                 </div >
//             </div >
//             <FooterComponent />
//         </>
//     );
// }
//
// export default LandingPage;


import React from "react";
import HeaderComponent from "../components/HeaderComponent.jsx";
import FooterComponent from "../components/FooterComponent.jsx";
import EventCarousel from "../components/EventCarousel.jsx";
import HeroCarousel from "../components/HeroCarousel.jsx";
import EventMonthCarousel from "../components/EventMonthCarousel.jsx";

function LandingPage() {
    return (
        <>
            <div className="relative flex flex-col min-h-screen text-primary-light" >
                <div className="relative h-screen w-full" >
                    <HeroCarousel />
                    <div className="absolute top-0 left-0 w-full z-20" >
                        <HeaderComponent />
                    </div >

                    <div className="absolute inset-0 flex flex-col justify-center items-center text-center z-10" >
                        <h1 className="text-5xl font-bold mb-2 text-white"
                            style={{textShadow: "4px 3px 4px rgba(0, 0, 0, 0.8)"}} >
                            Welcome to UrbanOasis
                        </h1 >
                        <p className="text-xl text-white" style={{textShadow: "4px 3px 4px rgba(0, 0, 0, 0.8)"}} >
                            Discover events and manage your community seamlessly
                        </p >
                    </div >
                </div >

                <div className="flex-grow pt-12 bg-primary-light text-primary-dark" >
                    <div className="container mx-auto px-6 py-12" >
                        <div className="space-y-16" >
                            <div >
                                <EventCarousel />
                            </div >
                            <div >
                                <EventMonthCarousel />
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
