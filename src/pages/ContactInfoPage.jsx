import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from "../firebaseConfig.js";
import SelectUSState from 'react-select-us-states';
import { onAuthStateChanged } from "firebase/auth";

const ContactInfoPage = () => {
    const [userId, setUserId] = useState(null); // Store the authenticated user's UID
    const [email, setEmail] = useState('');

    // Form fields
    const [prefix, setPrefix] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [suffix, setSuffix] = useState('');
    const [cellPhone, setCellPhone] = useState('');
    const [address, setAddress] = useState('');
    const [address2, setAddress2] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zip, setZip] = useState('');
    const [birthday, setBirthday] = useState('');
    const [isHost, setIsHost] = useState(false);
    const [hostType, setHostType] = useState('individual'); // Default type

    // Check authentication state and populate user ID
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid); // Store the user's UID
                setEmail(user.email); // Store the user's email
            } else {
                console.log("User is not signed in.");
            }
        });
        return () => unsubscribe(); // Clean up the listener on unmount
    }, []);

    // Fetch user data from Firestore when userId is available
    useEffect(() => {
        const fetchData = async () => {
            if (userId) {
                try {
                    const docRef = doc(db, 'Users', userId); // Reference to Firestore document
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        // Populate form fields with Firestore data
                        setPrefix(data.name?.prefix || '');
                        setFirstName(data.name?.firstName || '');
                        setLastName(data.name?.lastName || '');
                        setSuffix(data.name?.suffix || '');
                        setCellPhone(data.contact?.cellPhone || '');
                        setAddress(data.address?.primary?.line1 || '');
                        setAddress2(data.address?.primary?.line2 || '');
                        setCity(data.address?.primary?.city || '');
                        setState(data.address?.primary?.state || '');
                        setZip(data.address?.primary?.zip || '');
                        setBirthday(data.birthday || '');
                        setIsHost(data.isHost || false);
                        setHostType(data.hostType || 'individual');
                    } else {
                        console.log('No such document!');
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            }
        };

        if (userId) {
            fetchData(); // Fetch data when userId is set
        }
    }, [userId]);

    // Handle save button click to update Firestore with form data
    const handleSave = async (e) => {
        e.preventDefault();

        const userData = {
            userId,
            name: {
                prefix,
                firstName,
                lastName,
                suffix,
            },
            contact: {
                cellPhone,
                email,
            },
            address: {
                primary: {
                    line1: address,
                    line2: address2,
                    city,
                    state,
                    zip,
                },
            },
            birthday,
            isHost,
            hostType,
            updatedAt: new Date().toISOString(),
        };

        try {
            if (userId) {
                await setDoc(doc(db, 'Users', userId), userData, { merge: true });
                alert('Changes saved!');
            }
        } catch (error) {
            console.error('Error saving data: ', error);
            alert('Error saving changes!');
        }
    };

    return (
        <div className="p-8 bg-white shadow-md rounded-lg max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Account Information</h1>

            {/* Profile Photo Upload Section */}
            <div className="mb-10">
                <label className="block text-lg font-semibold mb-4">Profile Photo</label>
                <div className="flex items-center space-x-4">
                    <div className="w-32 h-32 bg-gray-100 border border-dashed border-gray-300 rounded-md flex items-center justify-center">
                        <span className="text-gray-500 text-sm text-center">ADD A PROFILE IMAGE</span>
                    </div>
                    <div className="text-gray-600 text-sm">
                        Drag and drop or choose a file to upload
                    </div>
                </div>
            </div>

            {/* Contact Information Section */}
            <div className="mb-10">
                <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                <form className="grid grid-cols-2 gap-6" onSubmit={handleSave}>
                    <div className="col-span-1">
                        <label className="block text-gray-700 font-semibold mb-2">Prefix</label>
                        <select
                            className="block w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
                            value={prefix}
                            onChange={(e) => setPrefix(e.target.value)}
                        >
                            <option value="">--</option>
                            <option value="Mr">Mr</option>
                            <option value="Ms">Ms</option>
                            <option value="Mrs">Mrs</option>
                        </select>
                    </div>
                    <div className="col-span-1">
                        <label className="block text-gray-700 font-semibold mb-2">First Name</label>
                        <input
                            id="firstName"
                            type="text"
                            className="block w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </div>
                    <div className="col-span-1">
                        <label className="block text-gray-700 font-semibold mb-2">Last Name</label>
                        <input
                            id="lastName"
                            type="text"
                            className="block w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>
                    <div className="col-span-1">
                        <label className="block text-gray-700 font-semibold mb-2">Suffix</label>
                        <input
                            id="suffix"
                            type="text"
                            className="block w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
                            value={suffix}
                            onChange={(e) => setSuffix(e.target.value)}
                        />
                    </div>
                    <div className="col-span-1">
                        <label className="block text-gray-700 font-semibold mb-2">Cell Phone</label>
                        <input
                            id="cellPhone"
                            type="text"
                            className="block w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
                            value={cellPhone}
                            onChange={(e) => setCellPhone(e.target.value)}
                        />
                    </div>
                    <div className="col-span-1">
                        <label className="block text-gray-700 font-semibold mb-2">Birthday</label>
                        <input
                            id="birthday"
                            type="date"
                            className="block w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
                            value={birthday}
                            onChange={(e) => setBirthday(e.target.value)}
                        />
                    </div>
                </form>
            </div>

            {/* Home Address Section */}
            <div className="mb-10">
                <h2 className="text-xl font-semibold mb-4">Home Address</h2>
                <form className="grid grid-cols-2 gap-6">
                    <div className="col-span-2">
                        <label className="block text-gray-700 font-semibold mb-2">Address</label>
                        <input
                            id="address"
                            type="text"
                            className="block w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-gray-700 font-semibold mb-2">Address 2</label>
                        <input
                            id="address2"
                            type="text"
                            className="block w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
                            value={address2}
                            onChange={(e) => setAddress2(e.target.value)}
                        />
                    </div>
                    <div className="col-span-1">
                        <label className="block text-gray-700 font-semibold mb-2">City</label>
                        <input
                            id="city"
                            type="text"
                            className="block w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                        />
                    </div>
                    <div className="col-span-1">
                        <label className="block text-gray-700 font-semibold mb-2">State</label>
                        <SelectUSState
                            id="state"
                            className="block w-full border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
                            onChange={(val) => setState(val)}
                        />
                    </div>
                    <div className="col-span-1">
                        <label className="block text-gray-700 font-semibold mb-2">Country</label>
                        <input
                            id="country"
                            type="text"
                            value="United States"
                            readOnly
                            className="block w-full p-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none"
                        />
                    </div>
                    <div className="col-span-1">
                        <label className="block text-gray-700 font-semibold mb-2">Zip/Postal Code</label>
                        <input
                            id="zip"
                            type="text"
                            className="block w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
                            value={zip}
                            onChange={(e) => setZip(e.target.value)}
                        />
                    </div>
                </form>
            </div>

            <button
                type="submit"
                onClick={handleSave}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
                Save Changes
            </button>
        </div>
    );
};

export default ContactInfoPage;
