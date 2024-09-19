import React from 'react';


const states = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
    "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
    "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
    "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
    "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
    "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
    "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia",
    "Wisconsin", "Wyoming"
];

const ContactInfoPage = () => {
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
                <form className="grid grid-cols-2 gap-6">
                    <div className="col-span-1">
                        <label className="block text-gray-700 font-semibold mb-2">Prefix</label>
                        <select className="block w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 focus:outline-none">
                            <option value="">--</option>
                            <option value="Mr">Mr</option>
                            <option value="Ms">Ms</option>
                            <option value="Mrs">Mrs</option>
                        </select>
                    </div>
                    <div className="col-span-1">
                        <label className="block text-gray-700 font-semibold mb-2">First Name</label>
                        <input
                            type="text"
                            className="block w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
                            value="Deepa"
                        />
                    </div>
                    <div className="col-span-1">
                        <label className="block text-gray-700 font-semibold mb-2">Last Name</label>
                        <input
                            type="text"
                            className="block w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
                            value="Mondal"
                        />
                    </div>
                    <div className="col-span-1">
                        <label className="block text-gray-700 font-semibold mb-2">Suffix</label>
                        <input
                            type="text"
                            className="block w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>
                    <div className="col-span-1">
                        <label className="block text-gray-700 font-semibold mb-2">Home Phone</label>
                        <input
                            type="text"
                            className="block w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>
                    <div className="col-span-1">
                        <label className="block text-gray-700 font-semibold mb-2">Cell Phone</label>
                        <input
                            type="text"
                            className="block w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
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
                            type="text"
                            className="block w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-gray-700 font-semibold mb-2">Address 2</label>
                        <input
                            type="text"
                            className="block w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>
                    <div className="col-span-1">
                        <label className="block text-gray-700 font-semibold mb-2">City</label>
                        <input
                            type="text"
                            className="block w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>
                    <div className="col-span-1">
                        <label className="block text-gray-700 font-semibold mb-2">State</label>
                        <select className="block w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 focus:outline-none">
                            <option value="">Select a State</option>
                            {states.map((state) => (
                                <option key={state} value={state}>
                                    {state}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="col-span-1">
                        <label className="block text-gray-700 font-semibold mb-2">Country</label>
                        <input
                            type="text"
                            value="United States"
                            readOnly
                            className="block w-full p-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none"
                        />
                    </div>
                    <div className="col-span-1">
                        <label className="block text-gray-700 font-semibold mb-2">Zip/Postal Code</label>
                        <input
                            type="text"
                            className="block w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>
                </form>
            </div>


            <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
                Save Changes
            </button>
        </div>
    );
};

export default ContactInfoPage;
