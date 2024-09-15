import React, {useState} from "react";

function EventCard() {

    return (
        <>
            <div className="event-card p-3">
                <div className="box-border rounded-lg bg-gray-900 p-4 flex">
                    <div className="flex flex-col p-6">
                        <label className="block text-gray-200 opacity-50 pb-1">Date</label>
                        <label className="block text-gray-300 pb-1 text-2xl">Event Title</label>
                        <label className="block text-gray-200 opacity-50 pb-1">Event Location</label>

                        <div className="flex flex-row pt-20">
                            <label className="block text-gray-300 pb-1">Capacity</label>
                            <label className="block text-gray-300 pb-1 pl-24">Ticket Price</label>
                        </div>

                        <div className="flex flex-row">
                            <label className="block text-gray-300 opacity-50 pb-1">23/50</label>
                            <label className="block text-gray-300 opacity-50 pb-1 pl-32">$10.99</label>
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}

export default EventCard;