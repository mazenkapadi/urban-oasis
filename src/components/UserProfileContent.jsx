import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from "../firebaseConfig.js";
import { useNavigate } from "react-router-dom";

const UserProfileContent = () => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');

    const [events, setEvents] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const navigate = useNavigate();

    const userId = auth.currentUser?.uid;

    const handleEditProfile = () => {
        navigate('/userProfilePage/contact-info');
    };

    useEffect(() => {
        const fetchUserData = async () => {
            if (userId) {
                const docRef = doc(db, 'Users', userId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    // Set the state with user data
                    setName(`${data.firstName || ''} ${data.lastName || ''}`);
                    setPhone(data.cellPhone || '');
                    setEmail(data.email || '');

                } else {
                    console.log('No such document!');
                }
            }
        };

        fetchUserData();
    }, [userId]);

    return (
        <div className="w-full">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-white">My Dashboard</h1>
                <p className="text-gray-300">Welcome back, {name.split(' ')[0]}</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-gray-800 shadow-md rounded-lg p-6 col-span-1 flex flex-col items-center">
                    <img
                        src="https://via.placeholder.com/150"
                        alt="User Profile"
                        className="rounded-full w-24 h-24 object-cover mb-4"
                    />
                    <h2 className="text-xl font-semibold mb-2 text-white">{name}</h2>
                    <p className="text-gray-400">{phone}</p>
                    <p className="text-gray-400">{email}</p>
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
