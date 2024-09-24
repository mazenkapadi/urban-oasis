import HeaderComponent from "../components/HeaderComponent.jsx";
import FooterComponent from "../components/FooterComponent.jsx";
import { v4 as uuidv4 } from "uuid";

const ViewAllEventsPage = () => {
  // Static event data using the provided structure
  const eventData = {
    id: uuidv4(),
    basicInfo: {
      title: "Static Event Title",
      description: "An event to showcase the latest in tech.",
      location: "Static Event Location",
    },
    eventDetails: {
      date: "Sept 25, 2024",
      time: "10:00 AM",
      capacity: 100,
      images: "src/assets/backgroundTestImage.jpg",
      paidEvent: true,
      eventPrice: 10.99,
    },
    policies: {
      petAllowance: true,
      refundAllowance: true,
      refundPolicy: "Refunds available up to 1 week before the event.",
      ageRestriction: "18+",
    },
    availability: {
      fbAvail: true,
      merchAvailability: true,
      alcAvail: false,
      alcInfo: null,
    },
    timestamps: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  };
  const events = [eventData, eventData, eventData];

  return (
    <>
      <HeaderComponent />
      <div className="pt-24 bg-primary-light text-primary-dark">
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

          {/* Events List Section */}
          <div className="w-3/4 space-y-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="flex items-start p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
                style={{ borderColor: "#8D99AE" }}
              >
                <img
                  src={event.eventDetails.images}
                  alt={event.basicInfo.title}
                  className="w-32 h-32 object-cover rounded-md"
                />
                <div className="ml-4">
                  <h2 className="text-2xl font-semibold text-[#2B2D42]">
                    {event.basicInfo.title}
                  </h2>
                  <p className="text-[#8D99AE]">{event.basicInfo.location}</p>
                  <p className="text-[#2B2D42]">
                    {event.eventDetails.date} • {event.eventDetails.time}
                  </p>
                  {event.eventDetails.paidEvent && (
                    <p className="text-[#D90429]">
                      ${event.eventDetails.eventPrice.toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <FooterComponent />
    </>
  );
};

export default ViewAllEventsPage;
