import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig.js";
import HeaderComponent from "../components/HeaderComponent.jsx";
import FooterComponent from "../components/FooterComponent.jsx";
import FiltersComponent from "../components/FiltersComponent.jsx";
import NotFound from "./404NotFound.jsx";
import WideEventCard from "../components/WideEventCard.jsx";

const ViewAllEventsPage = () => {
    const [ events, setEvents ] = useState([]);
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState(null);

    // Fetch events from Firestore on component mount
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setLoading(true);
                const querySnapshot = await getDocs(collection(db, "Events"));
                const eventData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setEvents(eventData);
                setLoading(false);
                setError(null);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    if (error) return <NotFound />;

    return (
        <>
            <HeaderComponent />
            <div className="pt-52 md:pt-24 lg:pt-24 xl:pt-24 bg-primary-light text-primary-dark" >
                <div className="max-w-7xl mx-auto px-4 py-8 flex" >
                    <FiltersComponent />
                    <div className="w-3/4 space-y-6" >
                        {events.length > 0 ? (
                            events.map((event) => (
                                <WideEventCard key={event.id} event={event} />
                            ))
                        ) : (
                            <p >No events found.</p >
                        )}
                    </div >
                </div >
            </div >
            <FooterComponent />
        </>
    );
};

export default ViewAllEventsPage;
