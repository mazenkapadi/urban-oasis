import React, { useState, useEffect } from "react";
import { auth, db } from "../../firebaseConfig.js";
import { doc, setDoc } from "firebase/firestore";
import themeManager from "../../utils/themeManager.jsx";

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
    const [ darkMode, setDarkMode ] = useState(themeManager.isDarkMode);

    useEffect(() => {
        const handleThemeChange = (isDark) => setDarkMode(isDark);
        themeManager.addListener(handleThemeChange);

        return () => {
            themeManager.removeListener(handleThemeChange);
        };
    }, []);

    const user = auth.currentUser;

    useEffect(() => {
        if (user) {
            setHostDetails(prevDetails => ({
                ...prevDetails,
                profilePicture: user.photoURL || 'https://via.placeholder.com/150',
            }));
        }
    }, [user]);

    const handleAgreeClick = async () => {
        if (!hostType) {
            alert("Please select a host type");
            return;
        }
        setIsHost(true);
        console.log(`User isHost status updated to: true, Host Type: ${hostType}`);
        console.log("Host Details:", hostDetails);

        if (user) {
            const userRef = doc(db, 'Users', user.uid);
            await setDoc(userRef, {
                isHost: true,
                hostType: hostType,
                ...hostDetails
            }, { merge: true });
        }
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
            <label className={`block mb-2 ${darkMode ? "text-primary-light" : "text-primary-dark"} font-medium`}>{label}</label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={handleInputChange}
                placeholder={placeholder}
                className={`w-full p-2 border ${darkMode ? "border-Dark-D2 bg-Dark-D1 text-primary-light" : "border-Light-L2 bg-Light-L1 text-primary-dark"} rounded-md focus:ring focus:ring-accent-blue`}
            />
        </div>
    );

    const renderTextareaField = (label, name, value) => (
        <div className="mb-4">
            <label className={`block mb-2 ${darkMode ? "text-primary-light" : "text-primary-dark"} font-medium`}>{label}</label>
            <textarea
                name={name}
                value={value}
                onChange={handleInputChange}
                className={`w-full p-2 border ${darkMode ? "border-Dark-D2 bg-Dark-D1 text-primary-light" : "border-Light-L2 bg-Light-L1 text-primary-dark"} rounded-md focus:ring focus:ring-accent-blue`}
            />
        </div>
    );

    return (
        <div className="flex flex-col justify-center items-center p-6 min-h-screen">
            <h2 className={`text-2xl font-bold mb-6 ${darkMode ? "text-primary-light" : "text-primary-dark"}`}>Host Sign Up</h2>

            <div className={`w-full max-w-lg p-6 rounded-lg shadow-md mb-6 ${darkMode ? "bg-primary-dark" : "bg-primary-light"}`}>
                <h3 className={`text-xl font-semibold mb-4 ${darkMode ? "text-primary-light" : "text-primary-light"}`}>Disclaimer</h3>
                <p className={`mb-4 ${darkMode ? "text-Light-L1" : "text-Dark-D1"}`}>
                    By agreeing to become a host, you acknowledge that you understand
                    the responsibilities and obligations that come with it.
                </p>
                <select
                    value={hostType}
                    onChange={(e) => setHostType(e.target.value)}
                    className={`mb-4 w-full p-3 border rounded-md ${darkMode ? "bg-primary-dark text-primary-light " : "bg-primary-light text-primary-dark"}`}
                >
                    <option value="">Select Host Type</option>
                    <option value="individual">Individual</option>
                    <option value="company">Company</option>
                </select>
            </div>

            {hostType && (
                <div className={`w-full max-w-lg p-6 ${darkMode ? "bg-primary-dark" : "bg-primary-light"} rounded-lg shadow-md mb-6 animate-fade-in`}>
                    {hostType === 'individual' ? (
                        <>
                            <h3 className={`text-lg font-semibold mb-4 ${darkMode ? "text-primary-light" : "text-primary-dark"}`}>Personal Host Details</h3>
                            {renderTextareaField("Bio", "bio", hostDetails.bio)}
                        </>
                    ) : (
                        <>
                            <h3 className={`text-lg font-semibold mb-4 ${darkMode ? "text-primary-light" : "text-primary-dark"}`}>Company Host Details</h3>
                            {renderInputField("Company Name", "companyName", hostDetails.companyName)}
                            {renderTextareaField("Company Bio", "companyBio", hostDetails.companyBio)}
                            {renderInputField("Website URL", "website", hostDetails.website)}
                        </>
                    )}
                </div>
            )}

            {(hostType === 'individual' || hostType === 'company') && (
                <div className={`w-full max-w-lg p-6 ${darkMode ? "bg-primary-dark" : "bg-primary-light"} rounded-lg shadow-md mb-6 animate-fade-in`}>
                    <h3 className={`text-lg font-semibold mb-4 ${darkMode ? "text-primary-light" : "text-primary-dark"}`}>Host Location</h3>
                    {renderInputField("Address Line 1", "hostLocation.line1", hostDetails.hostLocation.line1)}
                    {renderInputField("Address Line 2", "hostLocation.line2", hostDetails.hostLocation.line2)}
                    {renderInputField("City", "hostLocation.city", hostDetails.hostLocation.city)}
                    {renderInputField("State", "hostLocation.state", hostDetails.hostLocation.state)}
                    {renderInputField("Zip Code", "hostLocation.zip", hostDetails.hostLocation.zip, "e.g., 12345")}
                </div>
            )}

            {(hostType === 'individual' || hostType === 'company') && (
                <div className={`w-full max-w-lg p-6 ${darkMode ? "bg-primary-dark" : "bg-primary-light"} rounded-lg shadow-md mb-6 animate-fade-in`}>
                    <h3 className={`text-lg font-semibold mb-4 ${darkMode ? "text-primary-light" : "text-primary-dark"}`}>Host Ratings</h3>
                    <p className={`${darkMode ? "text-Light-L1" : "text-Dark-D1"}`}>Ratings will be automatically calculated based on user reviews.</p>
                    <label className={`block mb-2 ${darkMode ? "text-Light-L1" : "text-Dark-D1"}`}>Overall Rating: {hostDetails.ratings.overall}</label>
                    <label className={`block mb-2 ${darkMode ? "text-Light-L1" : "text-Dark-D1"}`}>Number of Reviews: {hostDetails.ratings.reviews.length}</label>
                </div>
            )}

            <button
                onClick={handleAgreeClick}
                className={`w-full max-w-lg bg-accent-blue text-white py-3 px-6 rounded-lg font-medium ${
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
