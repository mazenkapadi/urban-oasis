// import React, { useState } from "react";
//
// function HostSignUpPage() {
//     const [isHost, setIsHost] = useState(false);
//     const [hostType, setHostType] = useState("");
//     const [hostDetails, setHostDetails] = useState({
//         bio: '',
//         profilePicture: '',
//         companyName: '',
//         companyBio: '',
//         website: '',
//         logo: '',
//         hostLocation: {
//             line1: '',
//             line2: '',
//             city: '',
//             state: '',
//             zip: ''
//         },
//         ratings: {
//             overall: 0,
//             reviews: []
//         }
//     });
//
//     const handleAgreeClick = () => {
//         setIsHost(true);
//         console.log(`User isHost status updated to: true, Host Type: ${hostType}`);
//         console.log("Host Details:", hostDetails);
//     };
//
//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         if (name.startsWith('hostLocation')) {
//             const locationField = name.split('.')[1];
//             setHostDetails(prevState => ({
//                 ...prevState,
//                 hostLocation: {
//                     ...prevState.hostLocation,
//                     [locationField]: value
//                 }
//             }));
//         } else {
//             setHostDetails(prevState => ({ ...prevState, [name]: value }));
//         }
//     };
//
//     return (
//         <>
//             <div className="flex flex-col justify-center items-center p-4">
//                 <h2 className="text-xl font-bold mb-4">Disclaimer</h2>
//                 <p className="mb-4">
//                     By agreeing to become a host, you acknowledge that you understand
//                     the responsibilities and obligations that come with it.
//                 </p>
//
//                 <select
//                     value={hostType}
//                     onChange={(e) => setHostType(e.target.value)}
//                     className="mb-4 p-2 border rounded text-blacks"
//                 >
//                     <option value="">Select Host Type</option>
//                     <option value="individual">Individual</option>
//                     <option value="company">Company</option>
//                 </select>
//
//                 {hostType === 'individual' && (
//                     <div className="mb-4 w-full max-w-md p-4 border rounded shadow-lg animate-fade-in">
//                         <h3 className="text-lg font-bold mb-2">Personal Host Details</h3>
//                         <label className="block mb-2">Bio</label>
//                         <textarea
//                             name="bio"
//                             value={hostDetails.bio}
//                             onChange={handleInputChange}
//                             className="w-full p-2 border rounded mb-4"
//                         />
//                         <label className="block mb-2">Profile Picture URL</label>
//                         <input
//                             type="text"
//                             name="profilePicture"
//                             value={hostDetails.profilePicture}
//                             onChange={handleInputChange}
//                             className="w-full p-2 border rounded mb-4"
//                         />
//                     </div>
//                 )}
//
//                 {hostType === 'company' && (
//                     <div className="mb-4 w-full max-w-md p-4 border rounded shadow-lg animate-fade-in">
//                         <h3 className="text-lg font-bold mb-2">Company Host Details</h3>
//                         <label className="block mb-2">Company Name</label>
//                         <input
//                             type="text"
//                             name="companyName"
//                             value={hostDetails.companyName}
//                             onChange={handleInputChange}
//                             className="w-full p-2 border rounded mb-4"
//                         />
//                         <label className="block mb-2">Company Bio</label>
//                         <textarea
//                             name="companyBio"
//                             value={hostDetails.companyBio}
//                             onChange={handleInputChange}
//                             className="w-full p-2 border rounded mb-4"
//                         />
//                         <label className="block mb-2">Website URL</label>
//                         <input
//                             type="text"
//                             name="website"
//                             value={hostDetails.website}
//                             onChange={handleInputChange}
//                             className="w-full p-2 border rounded mb-4"
//                         />
//                         <label className="block mb-2">Logo URL</label>
//                         <input
//                             type="text"
//                             name="logo"
//                             value={hostDetails.logo}
//                             onChange={handleInputChange}
//                             className="w-full p-2 border rounded mb-4"
//                         />
//                     </div>
//                 )}
//
//                 {(hostType === 'individual' || hostType === 'company') && (
//                     <div className="mb-4 w-full max-w-md p-4 border rounded shadow-lg animate-fade-in">
//                         <h3 className="text-lg font-bold mb-2">Host Location</h3>
//                         <label className="block mb-2">Address Line 1</label>
//                         <input
//                             type="text"
//                             name="hostLocation.line1"
//                             value={hostDetails.hostLocation.line1}
//                             onChange={handleInputChange}
//                             className="w-full p-2 border rounded mb-4"
//                         />
//                         <label className="block mb-2">Address Line 2</label>
//                         <input
//                             type="text"
//                             name="hostLocation.line2"
//                             value={hostDetails.hostLocation.line2}
//                             onChange={handleInputChange}
//                             className="w-full p-2 border rounded mb-4"
//                         />
//                         <label className="block mb-2">City</label>
//                         <input
//                             type="text"
//                             name="hostLocation.city"
//                             value={hostDetails.hostLocation.city}
//                             onChange={handleInputChange}
//                             className="w-full p-2 border rounded mb-4"
//                         />
//                         <label className="block mb-2">State</label>
//                         <input
//                             type="text"
//                             name="hostLocation.state"
//                             value={hostDetails.hostLocation.state}
//                             onChange={handleInputChange}
//                             className="w-full p-2 border rounded mb-4"
//                         />
//                         <label className="block mb-2">Zip Code</label>
//                         <input
//                             type="text"
//                             name="hostLocation.zip"
//                             value={hostDetails.hostLocation.zip}
//                             onChange={handleInputChange}
//                             className="w-full p-2 border rounded mb-4"
//                         />
//                     </div>
//                 )}
//
//                 {(hostType === 'individual' || hostType === 'company') && (
//                     <div className="mb-4 w-full max-w-md p-4 border rounded shadow-lg animate-fade-in">
//                         <h3 className="text-lg font-bold mb-2">Host Ratings</h3>
//                         <p>Ratings will be automatically calculated based on user reviews.</p>
//                         <label className="block mb-2">Overall Rating: {hostDetails.ratings.overall}</label>
//                         <label className="block mb-2">Number of Reviews: {hostDetails.ratings.reviews.length}</label>
//                     </div>
//                 )}
//
//                 <button
//                     onClick={handleAgreeClick}
//                     className={`bg-blue-500 text-white py-2 px-4 rounded ${isHost ? 'opacity-50' : 'hover:bg-blue-700 transition duration-300'}`}
//                     disabled={isHost}
//                 >
//                     Agree and Continue
//                 </button>
//             </div>
//         </>
//     );
// }
//
// export default HostSignUpPage;

import React, { useState } from "react";

function HostSignUpPage() {
    const [isHost, setIsHost] = useState(false);
    const [hostType, setHostType] = useState("");
    const [hostDetails, setHostDetails] = useState({
        bio: '',
        profilePicture: '',
        companyName: '',
        companyBio: '',
        website: '',
        logo: '',
        hostLocation: {
            line1: '',
            line2: '',
            city: '',
            state: '',
            zip: ''
        },
        ratings: {
            overall: 0,
            reviews: []
        }
    });

    const handleAgreeClick = () => {
        if (!hostType) {
            alert("Please select a host type");
            return;
        }
        setIsHost(true);
        console.log(`User isHost status updated to: true, Host Type: ${hostType}`);
        console.log("Host Details:", hostDetails);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('hostLocation')) {
            const locationField = name.split('.')[1];
            setHostDetails(prevState => ({
                ...prevState,
                hostLocation: {
                    ...prevState.hostLocation,
                    [locationField]: value
                }
            }));
        } else {
            setHostDetails(prevState => ({ ...prevState, [name]: value }));
        }
    };

    const renderInputField = (label, name, value, placeholder = '', type = 'text') => (
        <div className="mb-4">
            <label className="block mb-2 text-gray-800 font-medium">{label}</label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={handleInputChange}
                placeholder={placeholder}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 bg-white text-gray-800"
            />
        </div>
    );

    const renderTextareaField = (label, name, value) => (
        <div className="mb-4">
            <label className="block mb-2 text-gray-800 font-medium">{label}</label>
            <textarea
                name={name}
                value={value}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 bg-white text-gray-800"
            />
        </div>
    );

    return (
        <div className="flex flex-col justify-center items-center p-6 min-h-screen">
            <h2 className="text-2xl font-bold mb-6 text-white">Host Sign Up</h2>

            <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-md mb-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Disclaimer</h3>
                <p className="text-gray-700 mb-4">
                    By agreeing to become a host, you acknowledge that you understand
                    the responsibilities and obligations that come with it.
                </p>
                <select
                    value={hostType}
                    onChange={(e) => setHostType(e.target.value)}
                    className="mb-4 w-full p-3 border rounded-md bg-white text-gray-700"
                >
                    <option value="">Select Host Type</option>
                    <option value="individual">Individual</option>
                    <option value="company">Company</option>
                </select>
            </div>

            {/* Conditional Forms */}
            {hostType && (
                <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-md mb-6 animate-fade-in">
                    {hostType === 'individual' ? (
                        <>
                            <h3 className="text-lg font-semibold mb-4 text-gray-900">Personal Host Details</h3>
                            {renderTextareaField("Bio", "bio", hostDetails.bio)}
                        </>
                    ) : (
                        <>
                            <h3 className="text-lg font-semibold mb-4 text-gray-900">Company Host Details</h3>
                            {renderInputField("Company Name", "companyName", hostDetails.companyName)}
                            {renderTextareaField("Company Bio", "companyBio", hostDetails.companyBio)}
                            {renderInputField("Website URL", "website", hostDetails.website)}
                        </>
                    )}
                </div>
            )}

            {/* Host Location Form */}
            {(hostType === 'individual' || hostType === 'company') && (
                <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-md mb-6 animate-fade-in">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900">Host Location</h3>
                    {renderInputField("Address Line 1", "hostLocation.line1", hostDetails.hostLocation.line1)}
                    {renderInputField("Address Line 2", "hostLocation.line2", hostDetails.hostLocation.line2)}
                    {renderInputField("City", "hostLocation.city", hostDetails.hostLocation.city)}
                    {renderInputField("State", "hostLocation.state", hostDetails.hostLocation.state)}
                    {renderInputField("Zip Code", "hostLocation.zip", hostDetails.hostLocation.zip, "e.g., 12345")}
                </div>
            )}

            {/* Host Ratings */}
            {(hostType === 'individual' || hostType === 'company') && (
                <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-md mb-6 animate-fade-in">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900">Host Ratings</h3>
                    <p className="text-gray-700">Ratings will be automatically calculated based on user reviews.</p>
                    <label className="block mb-2 text-gray-700">Overall Rating: {hostDetails.ratings.overall}</label>
                    <label className="block mb-2 text-gray-700">Number of Reviews: {hostDetails.ratings.reviews.length}</label>
                </div>
            )}

            {/* Agree Button */}
            <button
                onClick={handleAgreeClick}
                className={`w-full max-w-lg bg-blue-500 text-white py-3 px-6 rounded-lg font-medium ${
                    isHost ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600 transition duration-300'
                }`}
                disabled={isHost}
            >
                {isHost ? 'You are now a Host' : 'Agree and Continue'}
            </button>
        </div>
    );
}

export default HostSignUpPage;
