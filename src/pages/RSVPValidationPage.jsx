import { useSearchParams } from "react-router-dom";

const RSVPValidationPage = () => {
    const [ searchParams ] = useSearchParams();
    const userId = searchParams.get("userId");
    const eventId = searchParams.get("eventId");
    const quantity = searchParams.get("quantity");
    const eventTitle = searchParams.get("eventTitle");
    const eventDateTime = searchParams.get("eventDateTime");

    return (
        <div >
            <h1 >RSVP Details</h1 >
            <p ><strong >Event:</strong > {eventTitle}</p >
            <p ><strong >Date & Time:</strong > {eventDateTime}</p >
            <p ><strong >Quantity:</strong > {quantity}</p >
            <br />
            <br />
            <br />
            <p ><strong >Event Id</strong > {eventId} </p >
            <p ><strong >User Id</strong > {userId} </p >
        </div >
    );
};

export default RSVPValidationPage;
