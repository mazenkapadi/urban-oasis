import React, { useState } from 'react';

const SupportForm = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [issue, setIssue] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission (e.g., send to server or email)
        alert(`Support request submitted by ${name}`);
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Submit a Support Request</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Phone Number</label>
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Describe Your Issue</label>
                    <textarea
                        value={issue}
                        onChange={(e) => setIssue(e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2"
                        rows="4"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                >
                    Submit
                </button>
            </form>
        </div>
    );
};

export default SupportForm;
