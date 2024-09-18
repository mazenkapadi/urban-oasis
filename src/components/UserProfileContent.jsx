import React, { useState } from 'react';

const UserProfileContent = () => {
    const [name, setName] = useState('Kitty Meow');
    const [phone, setPhone] = useState('+1-555-555-5555');
    const [email, setEmail] = useState('kittymeow@gmail.com');

    const events = ['Event 1 - Date', 'Event 2 - Date', 'Event 3 - Date'];
    const favorites = ['Favorite Event 1', 'Favorite Event 2', 'Favorite Event 3'];

    return (
        <div className="w-full">
            {/* Dashboard Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold">My Dashboard</h1>
                <p className="text-gray-600">Welcome back, Kitty</p>
            </div>

            {/* Main Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Card */}
                <div className="bg-white shadow-md rounded-lg p-6 col-span-1 flex flex-col items-center">
                    <img
                        src="https://via.placeholder.com/150"
                        alt="User Profile"
                        className="rounded-full w-24 h-24 object-cover mb-4"
                    />
                    <h2 className="text-xl font-semibold mb-2">{name}</h2>
                    <p className="text-gray-700">{phone}</p>
                    <p className="text-gray-700">{email}</p>
                    <button className="mt-4 w-full bg-blue-500 text-white font-bold py-2 rounded-md hover:bg-blue-600 transition">
                        Edit Profile
                    </button>
                </div>

                {/* My Events and My Favorites */}
                <div className="lg:col-span-2 space-y-6">
                    {/* My Events */}
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-lg font-semibold mb-4">My Events</h2>
                        <ul className="list-disc pl-5">
                            {events.map((event, index) => (
                                <li key={index} className="text-gray-700">{event}</li>
                            ))}
                        </ul>
                    </div>

                    {/* My Favorites */}
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-lg font-semibold mb-4">My Favorites</h2>
                        <ul className="list-disc pl-5">
                            {favorites.map((fav, index) => (
                                <li key={index} className="text-gray-700">{fav}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfileContent;
