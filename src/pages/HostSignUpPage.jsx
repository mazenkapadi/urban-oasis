import React, { useState } from "react";
import SideBar from "../components/SideBar.jsx";

function HostSignUpPage() {
    const [ isHost, setIsHost ] = useState(false);
    const [ hostType, setHostType ] = useState("");

    const handleAgreeClick = () => {
        // Update the user's isHost status and hostType
        setIsHost(true);
        // You would replace this with a call to your API or Firebase function
        console.log(`User isHost status updated to: ${true}, Host Type: ${hostType}`);
    };

    return (
        <>
            <div className="flex flex-col justify-center items-center p-4" >
                <h2 className="text-xl font-bold mb-4" >Disclaimer</h2 >
                <p className="mb-4" >
                    By agreeing to become a host, you acknowledge that you understand
                    the responsibilities and obligations that come with it.
                </p >
                <select
                    value={hostType}
                    onChange={(e) => setHostType(e.target.value)}
                    className="mb-4 p-2 border rounded"
                >
                    <option value="" >Select Host Type</option >
                    <option value="individual" >Individual</option >
                    <option value="organization" >Organization</option >
                    <option value="business" >Business</option >
                </select >
                <button
                    onClick={handleAgreeClick}
                    className="bg-blue-500 text-white py-2 px-4 rounded"
                    disabled={isHost}
                >
                    Agree and Continue
                </button >
            </div >
        </>
    );
}

export default HostSignUpPage;
