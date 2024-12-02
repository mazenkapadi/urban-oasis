// import { useSearchParams } from "react-router-dom";
//
// const RSVPValidationPage = () => {
//     const [ searchParams ] = useSearchParams();
//     const userId = searchParams.get("userId");
//     const eventId = searchParams.get("eventId");
//     const quantity = searchParams.get("quantity");
//     const eventTitle = searchParams.get("eventTitle");
//     const eventDateTime = searchParams.get("eventDateTime");
//
//     return (
//         <div >
//             <h1 >RSVP Details</h1 >
//             <p ><strong >Event:</strong > {eventTitle}</p >
//             <p ><strong >Date & Time:</strong > {eventDateTime}</p >
//             <p ><strong >Quantity:</strong > {quantity}</p >
//             <br />
//             <br />
//             <br />
//             <p ><strong >Event Id</strong > {eventId} </p >
//             <p ><strong >User Id</strong > {userId} </p >
//         </div >
//     );
// };
//
// export default RSVPValidationPage;


import { useSearchParams } from "react-router-dom";

const formatTimestamp = (timestamp) => {
    if (!timestamp) return "Invalid Date";

    const date = new Date(timestamp.toDate()); // Convert Firestore timestamp to JavaScript Date
    return new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    }).format(date);
};

const RSVPValidationPage = () => {
    const [ searchParams ] = useSearchParams();
    const userId = searchParams.get("userId");
    const eventId = searchParams.get("eventId");
    const quantity = searchParams.get("quantity");
    const eventTitle = searchParams.get("eventTitle");
    const eventDateTime = searchParams.get("eventDateTime");

    const formattedDateTime = eventDateTime ? formatTimestamp(eventDateTime) : "N/A";


    return (
        <div className="bg-primary-light min-h-screen flex items-center justify-center px-4 py-8" >
            <div className="bg-Light-L2 shadow-lg rounded-lg p-6 max-w-lg w-full" >
                <h1 className="text-accent-blue font-lalezar text-h1 mb-6 text-center" >
                    RSVP Details
                </h1 >
                <div className="text-body text-Dark-D1 space-y-4" >
                    <p >
                        <strong className="text-accent-orange" >Event:</strong > {eventTitle}
                    </p >
                    <p >
                        <strong className="text-accent-orange" >Date & Time:</strong > {formattedDateTime}
                    </p >
                    <p >
                        <strong className="text-accent-orange" >Quantity:</strong > {quantity}
                    </p >
                </div >
                <div className="mt-8 text-body text-Dark-D1 space-y-2" >
                    <p >
                        <strong className="text-accent-purple" >Event ID:</strong > {eventId}
                    </p >
                    <p >
                        <strong className="text-accent-purple" >User ID:</strong > {userId}
                    </p >
                </div >
            </div >
        </div >
    );
};

export default RSVPValidationPage;
