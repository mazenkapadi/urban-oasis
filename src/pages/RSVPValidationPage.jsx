import { useSearchParams } from "react-router-dom";

const RSVPValidationPage = () => {
    const [ searchParams ] = useSearchParams();
    const userId = searchParams.get("userId");
    const eventId = searchParams.get("eventId");
    const quantity = searchParams.get("quantity");
    const eventTitle = searchParams.get("eventTitle");
    const eventDateTime = searchParams.get("eventDateTime");

    return (
        <div className="bg-primary-light min-h-screen flex items-center justify-center p-4" >

            <h1 className="text-accent-blue font-lalezar text-h1 mb-6 text-center" >
                RSVP Details
            </h1 >
            <div className="text-body text-Dark-D1 space-y-4" >
                <p >
                    <strong className="text-accent-orange" >Event:</strong > {eventTitle}
                </p >
                <p >
                    <strong className="text-accent-orange" >Date & Time:</strong > {eventDateTime}
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
    );
};

export default RSVPValidationPage;
