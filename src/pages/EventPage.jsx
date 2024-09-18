import React, {useState} from "react";

function EventPage() {
    const [quantity, setQuantity] = useState(1);

    const handleIncrement = () => {
        setQuantity(quantity + 1);
    }
    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    }

    const handleCheckout = () => {

    }

    return (
        <>
            <div className="event-page">
                <div className="flex h-full w-full">
                    <div className="bg-blue-800 p-6 flex flex-col w-full h-full gap-3">
                        <div
                            className="box-border rounded-lg bg-gray-900 p-8 flex flex-col w-full h-full gap-4">
                            <div className="flex content w-full flex-row justify-items-start gap-2">
                                <div className="box-border rounded-lg bg-gray-500 p-6 flex h-70 w-80">
                                </div>
                                <div className="flex content w-full flex-col gap-3 p-8">
                                    <div className="flex flex-row">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                             strokeWidth={1.5} stroke="white" className="size-6" strokeOpacity={.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"/>
                                        </svg>
                                        <label className="font-bold text-white opacity-50 pl-3">Date and Time</label>
                                    </div>

                                    <label className="block text-gray-300 text-5xl">Event Title</label>
                                    <div className="flex flex-row">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                             strokeWidth={1.5} stroke="white" className="size-6" strokeOpacity={.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"/>
                                        </svg>

                                        <label className="font-bold text-white opacity-50 pl-3">Host</label>
                                    </div>
                                </div>
                            </div>

                            <div
                                className="box-border rounded-lg bg-gray-500 bg-opacity-30 border-4 border-gray-500 p-2 flex w-full h-32">
                                <label className="font-bold text-white">About This Event</label>
                            </div>

                            <div
                                className="box-border rounded-lg bg-gray-500 bg-opacity-30 border-4 border-gray-500 p-2 flex w-full h-32">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     strokeWidth={1.5}
                                     stroke="white" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"/>
                                </svg>

                                <label className="font-bold text-white pl-3">Location</label>
                            </div>

                            <div
                                className="box-border rounded-lg bg-gray-500 bg-opacity-30 border-4 border-gray-500 p-2 flex w-full h-28">
                                <label className="font-bold text-white">Host Contact Information</label>
                            </div>

                            <div
                                className="box-border rounded-lg bg-gray-500 bg-opacity-30 border-4 border-gray-500 p-2 flex w-full h-28">
                                <label className="font-bold text-white">Refund Policy</label>
                            </div>

                            <div
                                className="box-border rounded-lg bg-gray-500 bg-opacity-30 border-4 border-gray-500 p-2 flex w-full h-28">
                                <label className="font-bold text-white">Pets Allowed/Not Allowed</label>
                            </div>


                        </div>

                        <div
                            className="box-border rounded-lg bg-gray-900 p-6 flex flex-row w-full h-24 gap-2">
                            <div
                                className="box-border rounded-lg bg-gray-500 bg-opacity-30 border-4 border-gray-500 justify-center items-center flex w-52 h-12">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     strokeWidth={1.5}
                                     stroke="white" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z"/>
                                </svg>

                                <label className="font-bold text-white pl-3">Ticket Price</label>
                            </div>
                            <div
                                className="box-border rounded-lg bg-gray-500 bg-opacity-30 border-4 border-gray-500 justify-center items-center flex w-16 h-12 gap-1">
                                <button onClick={handleDecrement} disabled={quantity === 1} style={{color: "white"}}>-
                                </button>
                                <span style={{color: "white", fontWeight: "bold"}}>{quantity}</span>
                                <button onClick={handleIncrement} style={{color: "white"}}>+</button>
                            </div>
                            <div
                                className="box-border rounded-lg bg-gray-500 bg-opacity-30 border-4 border-gray-500 justify-center items-center flex w-full h-12">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     strokeWidth={1.5}
                                     stroke="white" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"/>
                                </svg>

                                <button onClick={handleCheckout}
                                        style={{color: "white", paddingLeft: "10px", fontWeight: "bold"}}>RSVP
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default EventPage;