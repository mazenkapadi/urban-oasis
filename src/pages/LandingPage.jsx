import HeaderComponent from "../components/HeaderComponent.jsx";
import FooterComponent from "../components/FooterComponent.jsx";
import EventCarousel from "../components/Carousels/EventCarousel.jsx";
import HeroCarousel from "../components/Carousels/HeroCarousel.jsx";
import Testimonials from "../components/Testimonials.jsx";
import { useNavigate } from "react-router-dom";
import { ChevronDoubleDownIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig.js";
import themeManager from "../utils/themeManager.jsx";
import resolveConfig from "tailwindcss/resolveConfig.js";
import tailwindConfig from "../../tailwind.config.js";

function LandingPage() {
    const fullConfig = resolveConfig(tailwindConfig);
    const colors = fullConfig.theme.colors;
    const navigate = useNavigate();

    const [ userPreferences, setUserPreferences ] = useState(null);
    const [ darkMode, setDarkMode ] = useState(themeManager.isDarkMode);

    useEffect(() => {
        const handleThemeChange = (isDark) => setDarkMode(isDark);
        themeManager.addListener(handleThemeChange);

        return () => {
            themeManager.removeListener(handleThemeChange);
        };
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const docRef = doc(db, 'Users', user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data().preferences || {};
                    setUserPreferences(data);
                }
            }
        });
        return () => unsubscribe();
    }, []);

    const scrollToWeekEvents = () => {
        const element = document.getElementById("weekEvents");
        if (element) {
            element.scrollIntoView({behavior: "smooth"});
        }
    };

    const handleViewAll = () => {
        navigate("/events");
    };

    return (
        <div className={`relative flex flex-col min-h-screen ${darkMode ? "text-primary-light" : "text-primary-dark"}`} >
            <div className="relative h-screen w-full"
                 style={{
                     backgroundColor: darkMode ? colors["primary-dark"] : colors["primary-light"],
                 }} >
                <HeroCarousel />
                <div className="absolute top-0 left-0 w-full z-20"

                >
                    <HeaderComponent />
                </div >

                <div className="absolute inset-0 flex flex-col justify-center items-center text-center z-10" >
                    <h1
                        className="text-5xl font-bold mb-2 text-white"
                        style={{textShadow: "4px 3px 4px rgba(0, 0, 0, 0.8)"}}
                    >
                        Welcome to UrbanOasis
                    </h1 >
                    <p
                        className="text-xl text-white"
                        style={{textShadow: "4px 3px 4px rgba(0, 0, 0, 0.8)"}}
                    >
                        Discover events and manage your community seamlessly
                    </p >
                </div >

                <div className="absolute bottom-5 left-0 right-0 flex justify-center items-center z-20" >
                    <button
                        onClick={scrollToWeekEvents}
                        className="mx-2 p-3 text-white bg-Dark-D2 font-bold rounded-full transition duration-300 opacity-60 hover:opacity-100"
                    >
                        <ChevronDoubleDownIcon className="w-6 h-6" />
                    </button >
                </div >
            </div >

            <div className={`flex-grow pt-2 ${darkMode ? "bg-Dark-D1 text-primary-light" : "bg-Light-L1 text-primary-dark"}`} >
                <div className="container mx-auto px-6 space-y-8" >
                    <div id="weekEvents" >
                        <h1 className="text-3xl font-bold mb-1" >Events this Week</h1 >
                        <EventCarousel rangeType="week" />
                    </div >
                    <div >
                        <h1 className="text-3xl font-bold mb-1" >Events Later this Month</h1 >
                        <EventCarousel rangeType="month" />
                    </div >
                    {userPreferences && userPreferences.categories && userPreferences.categories.length > 0 && (
                        <div >
                            <h1 className="text-3xl font-bold mb-1" >Suggested Events For You</h1 >
                            <EventCarousel
                                rangeType="week"
                                categories={userPreferences.categories}
                            />
                        </div >
                    )}
                </div >
                <div className="flex justify-center mt-8 pb-6" >
                    <button
                        onClick={handleViewAll}
                        className={`w-1/2 px-6 py-3 bg-accent-blue text-white text-lg font-bold rounded-full hover:bg-accent-purple transition duration-300`}
                    >
                        View All Events
                    </button >
                </div >

                <Testimonials />
            </div >

            <FooterComponent />
        </div >
    );
}

export default LandingPage;
