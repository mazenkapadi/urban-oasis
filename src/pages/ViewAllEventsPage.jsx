import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig.js"; // Make sure the correct path to your firebase.js file
import HeaderComponent from "../components/HeaderComponent.jsx";
import FooterComponent from "../components/FooterComponent.jsx";

const ViewAllEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // Fetch events from Firestore on component mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, "Events"));
        console.log(querySnapshot);
        const eventData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log(eventData);

        setEvents(eventData);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(error);
        console.error("Error fetching events: ", error);
      }
    };

    fetchEvents();
  }, []);
  if (error) {
    return <p>{error}</p>;
  } else {
    return (
      <>
        <HeaderComponent />
        <div className="pt-52 md:pt-24 lg:pt-24 xl:pt-24 bg-primary-light text-primary-dark">
          <div className="max-w-7xl mx-auto px-4 py-8 flex">
            {/* Filters Section */}
            <div className="w-1/4 pr-6">
              <h2 className="text-xl font-bold text-[#2B2D42] mb-4">Filters</h2>
              <div className="mb-6">
                <h3 className="font-semibold mb-1 text-[#2B2D42]">Category</h3>
                <ul className="space-y-2">
                  <li className="text-[#2B2D42]">Business</li>
                  <li className="text-[#2B2D42]">Food & Drink</li>
                  <li className="text-[#2B2D42]">Health</li>
                  <li className="text-[#2B2D42]">Music</li>
                  <li className="text-[#2B2D42]">View more</li>
                </ul>
              </div>
              <div className="mb-6">
                <h3 className="font-semibold mb-1 text-[#2B2D42]">Date</h3>
                <ul className="space-y-2">
                  <li className="text-[#2B2D42]">Today</li>
                  <li className="text-[#2B2D42]">Tomorrow</li>
                  <li className="text-[#2B2D42]">This weekend</li>
                  <li className="text-[#2B2D42]">Pick a date...</li>
                </ul>
              </div>
            </div>

            {!loading ? (
              <div className="w-3/4 space-y-6">
                {events.length > 0 ? (
                  events.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-start p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
                      style={{ borderColor: "#8D99AE" }}
                    >
                      <img
                        src={event.eventDetails.images[0]}
                        alt={event.basicInfo.title}
                        className="w-32 h-32 object-cover rounded-md"
                      />
                      <div className="ml-4">
                        <h2 className="text-2xl font-semibold text-[#2B2D42]">
                          {event.basicInfo.title}
                        </h2>
                        <p className="text-[#8D99AE]">
                          {event.basicInfo.location}
                        </p>
                        <p className="text-[#2B2D42]">
                          {`${event.eventDetails.eventDateTime
                            .toDate()
                            .toLocaleString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "numeric",
                              minute: "numeric",
                              hour12: true, // 12-hour format with AM/PM
                            })
                            .replace(",", " at")}`}
                        </p>
                        {event.eventDetails.paidEvent && (
                          <p className="text-[#D90429]">
                            ${event.eventDetails.eventPrice.toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No events found.</p>
                )}
              </div>
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>
        <FooterComponent />
      </>
    );
  }
};

export default ViewAllEventsPage;
