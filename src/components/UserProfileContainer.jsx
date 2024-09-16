import React, { useState } from 'react';

const UserProfileContainer = () => {
    const [name, setName] = useState('John Doe'); // Example name, replace with Firestore fetch later
    const [phone, setPhone] = useState('555-555-5555');
    const [email, setEmail] = useState('john.doe@example.com');

    return (
        <div className="bg-white shadow-md rounded-lg p-4">
            {/* User Image */}
            <div className="flex flex-col items-center">
                <img
                    src="https://via.placeholder.com/150"
                    alt="User ProfileContent"
                    className="rounded-full w-32 h-32 object-cover mb-4"
                />
                {/* User Info */}
                <div className="w-full">
                    <label className="block text-gray-600">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded-md mb-4"
                    />
                    <label className="block text-gray-600">Phone</label>
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded-md mb-4"
                    />
                    <label className="block text-gray-600">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded-md"
                    />
                </div>
            </div>
        </div>
    );
};

export default UserProfileContainer;
