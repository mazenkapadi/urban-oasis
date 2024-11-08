import React, { useEffect, useState } from 'react';
import { Button, Modal } from "@mui/material";
import { auth, db } from "../../firebaseConfig.js";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const PreferencePage = () => {
    const [userId, setUserId] = useState(null);
    const [categories, setCategories] = useState([]);
    const [preferredTime, setPreferredTime] = useState('');
    const [preferredDay, setPreferredDay] = useState('');
    const [preferredLocation, setPreferredLocation] = useState('');
    const [modalOpen, setModalOpen] = useState(false);

    const categorizedOptions = {
        'Arts & Entertainment': [
            'Music', 'Art', 'Comedy', 'Theater & Performing Arts',
            'Film & Media', 'Photography & Art Exhibits', 'Opera',
        ],
        'Business & Networking': [
            'Business', 'Networking', 'Politics & Activism',
            'Charity & Fundraisers', 'Conferences',
        ],
        'Education & Innovation': [
            'Technology', 'Science & Innovation', 'Education',
            'Workshops & Classes', 'Talks & Seminars', 'Online Courses'
        ],
        'Lifestyle & Wellness': [
            'Health', 'Spirituality & Wellness', 'Family & Kids',
            'Fashion & Beauty', 'Mental Health',
        ],
        'Food & Leisure': [
            'Food & Drink', 'Cooking & Culinary', 'Shopping & Markets',
            'Travel & Outdoor', 'Wine Tasting', 'Dining Experiences'
        ],
        'Sports & Recreation': [
            'Sports', 'Gaming & E-sports', 'Fitness & Training',
            'Adventure Sports', 'Hiking & Nature',
        ],
    };
    const times = ['Day', 'Night'];
    const days = ['Weekday', 'Weekend'];

    useEffect(() => {
        console.log("useEffect triggered for onAuthStateChanged");
        return onAuthStateChanged(auth, async (user) => {
            if (user) {
                console.log("User is logged in:", user.uid);
                setUserId(user.uid);
                const docRef = doc(db, 'Users', user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data().preferences || {};
                    console.log("Fetched user preferences from Firestore:", data);
                    setCategories(data.categories || []);
                    setPreferredTime(data.preferredTime || '');
                    setPreferredDay(data.preferredDay || '');
                    setPreferredLocation(data.preferredLocation || '');
                } else {
                    console.log("No existing preferences found for user.");
                }
            } else {
                console.log("No user is logged in.");
            }
        });
    }, []);

    const handleCategoryChange = (category) => {
        setCategories((prev) =>
            prev.includes(category) ? prev.filter((item) => item !== category) : [...prev, category]
        );
    };

    const clearPreferences = () => {
        setCategories([]);
        setPreferredTime('');
        setPreferredDay('');
        setPreferredLocation('');
    };

    const savePreferences = async () => {
        if (userId) {
            const userData = {
                preferences: {
                    categories,
                    preferredTime,
                    preferredDay,
                    preferredLocation,
                },
                updatedAt: new Date().toISOString(),
            };
            try {
                await setDoc(doc(db, 'Users', userId), userData, {merge: true});
                setModalOpen(true);
            } catch (error) {
                console.error('Error saving preferences:', error);
                alert('Error saving preferences!');
            }
        }
    };

    const handleModalClose = () => setModalOpen(false);

    return (
        <div className="min-h-screen flex flex-col justify-start p-8 bg-gray-100">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Set Your Event Preferences</h1>

            <div className="bg-white p-6 rounded-md border border-gray-200 mb-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Favorite Event Categories</h2>
                <div className="flex flex-col gap-4">
                    {Object.entries(categorizedOptions).map(([subcategory, options]) => (
                        <div key={subcategory} className="mb-4">
                            <h3 className="text-md font-semibold text-gray-700 mb-2">{subcategory}</h3>
                            <div className="flex flex-wrap gap-4">
                                {options.map((category) => (
                                    <label key={category} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            value={category}
                                            checked={categories.includes(category)}
                                            onChange={() => handleCategoryChange(category)}
                                            className="mr-2"
                                        />
                                        <span className="text-gray-700">{category}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white p-6 rounded-md border border-gray-200 mb-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Preferred Event Time</h2>
                <div className="flex space-x-4">
                    {times.map((time) => (
                        <label key={time} className="flex items-center">
                            <input
                                type="radio"
                                name="preferredTime"
                                value={time}
                                checked={preferredTime === time}
                                onChange={() => setPreferredTime(time)}
                                className="mr-2"
                            />
                            <span className="text-gray-700">{time}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="bg-white p-6 rounded-md border border-gray-200 mb-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Preferred Day of the Week</h2>
                <div className="flex space-x-4">
                    {days.map((day) => (
                        <label key={day} className="flex items-center">
                            <input
                                type="radio"
                                name="preferredDay"
                                value={day}
                                checked={preferredDay === day}
                                onChange={() => setPreferredDay(day)}
                                className="mr-2"
                            />
                            <span className="text-gray-700">{day}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="bg-white p-6 rounded-md border border-gray-200 mb-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Preferred Location</h2>
                <input
                    type="text"
                    placeholder="Enter preferred city or location"
                    value={preferredLocation}
                    onChange={(e) => setPreferredLocation(e.target.value)}
                    className="w-full mt-2 p-3 rounded-md border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>

            <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Selected Preferences</h2>
                <p className="text-gray-700 mb-2">
                    <strong>Categories:</strong> {categories.join(', ') || 'None selected'}
                </p>
                <p className="text-gray-700 mb-2"><strong>Time:</strong> {preferredTime || 'Not specified'}</p>
                <p className="text-gray-700 mb-2"><strong>Day:</strong> {preferredDay || 'Not specified'}</p>
                <p className="text-gray-700"><strong>Location:</strong> {preferredLocation || 'Not specified'}</p>
            </div>

            <div className="flex space-x-4">
                <button
                    onClick={savePreferences}
                    className="bg-indigo-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-600 transition duration-300"
                >
                    Save Preferences
                </button>
                <button
                    onClick={clearPreferences}
                    className="bg-gray-400 text-white font-semibold py-2 px-4 rounded-md hover:bg-gray-500 transition duration-300"
                >
                    Clear All
                </button>

                <Modal open={modalOpen} onClose={handleModalClose}>
                    <div
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 bg-white rounded-lg shadow-lg p-8"
                    >
                        <h2 className="text-xl font-semibold text-gray-800 text-center mb-4">Preferences Saved!</h2>
                        <p className="text-gray-600 text-center mb-6">Your preferences have been successfully saved.</p>
                        <Button onClick={handleModalClose} variant="contained" color="primary" className="w-full">
                            Close
                        </Button>
                    </div>
                </Modal>
            </div>
        </div>
    );
};

export default PreferencePage;
