import React, {useState} from "react";
import EventCard from "../components/EventCard.jsx";

function EventCardPage() {

    return (
        <>
            <div className="flex items-center w-screen">
                <EventCard />
            </div>
        </>
    );
}

export default EventCardPage;