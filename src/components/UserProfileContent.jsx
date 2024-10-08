import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from "../firebaseConfig.js";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";


const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return 'Phone number not available';
    const cleaned = ('' + phoneNumber).replace(/\D/g, ''); // Remove non-numeric characters
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phoneNumber;
};

const UserProfileContent = () => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [userId, setUserId] = useState(null);
    const [profilePic, setProfilePic] = useState('');
    const [events, setEvents] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const navigate = useNavigate();

    const handleEditProfile = () => {
        navigate('/userProfilePage/contact-info');
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
                setEmail(user.email);
            } else {
                console.log('No user logged in');
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
            if (userId) {
                try {
                    const docRef = doc(db, 'Users', userId);
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        console.log('User data:', data);

                        setName(`${data.name?.firstName || ''} ${data.name?.lastName || ''}`);

                        // Apply the phone number formatting
                        const formattedPhone = formatPhoneNumber(data.contact?.cellPhone);
                        setPhone(formattedPhone);

                        setEmail(data.contact?.email || email || 'Email not found');
                        setProfilePic(data.profilePic || 'https://via.placeholder.com/150'); // Fallback to placeholder if no profile picture is found
                    } else {
                        console.log('No such document!');
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            }
        };

        if (userId) {
            fetchUserData();
        }
    }, [userId, email]);

    return (
        <div className="w-full">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-white">My Dashboard</h1>
                <p className="text-gray-300">Welcome back, {name.split(' ')[0] || 'User'}</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-gray-800 shadow-md rounded-lg p-6 col-span-1 flex flex-col items-center">
                    <img
                        src={profilePic}
                        alt="User Profile"
                        className="rounded-full w-24 h-24 object-cover mb-4"
                    />
                    <h2 className="text-xl font-semibold mb-2 text-white">{name || 'Your Name'}</h2>
                    <p className="text-gray-400">{phone}</p> {/* Displays formatted phone number */}
                    <p className="text-gray-400">{email || 'Email not available'}</p>
                    <button
                        onClick={handleEditProfile}
                        className="mt-4 w-full bg-blue-800 text-white font-bold py-2 rounded-md hover:bg-blue-600 transition">
                        Edit Profile
                    </button>
                </div>
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-gray-800 shadow-md rounded-lg p-6">
                        <h2 className="text-lg font-semibold mb-4 text-white">My Events</h2>
                        <ul className="list-disc pl-5">
                            {events.length > 0 ? (
                                events.map((event, index) => (
                                    <li key={index} className="text-gray-300">{event}</li>
                                ))
                            ) : (
                                <li className="text-gray-500">No events to display.</li>
                            )}
                        </ul>
                    </div>
                    <div className="bg-gray-800 shadow-md rounded-lg p-6">
                        <h2 className="text-lg font-semibold mb-4 text-white">My Favorites</h2>
                        <ul className="list-disc pl-5">
                            {favorites.length > 0 ? (
                                favorites.map((fav, index) => (
                                    <li key={index} className="text-gray-300">{fav}</li>
                                ))
                            ) : (
                                <li className="text-gray-500">No favorites to display.</li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfileContent;
