import React from "react";

function EventPage() {

    return (
        <>
            <div className="flex h-screen w-screen">
                <div className="w-screen h-screen bg-blue-800 p-4 flex items-center justify-center">
                    <div
                        className="box-border rounded-lg bg-gray-900 p-6 flex flex-col w-screen h-screen gap-4">
                        <div className="flex content w-full flex-row justify-items-start gap-2">
                            <div className="box-border rounded-lg bg-gray-500 p-6 flex h-70 w-80">
                            </div>
                            <div className="flex content w-full flex-col gap-3 p-8">
                                <label className="font-bold text-white opacity-50">Date and Time</label>
                                <label className="block text-gray-300 text-5xl">Event Title</label>
                                <label className="font-bold text-white opacity-50">Host</label>
                            </div>
                        </div>
                        <div className="box-border rounded-lg bg-gray-500 bg-opacity-30 border-4 border-gray-500 p-2 flex w-full h-1/6">
                            <label className="font-bold text-white">About This Event</label>
                        </div>
                        <div className="box-border rounded-lg bg-gray-500 bg-opacity-30 border-4 border-gray-500 p-2 flex w-full h-1/6">
                            <label className="font-bold text-white">Location</label>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}

export default EventPage;