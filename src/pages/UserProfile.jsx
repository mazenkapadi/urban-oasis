// src/pages/userProfile.jsx

const UserProfile = () => {
    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <aside className="w-1/5 bg-gray-800 text-white flex flex-col space-y-4 p-6">
                <h2 className="text-xl font-bold">My Dashboard</h2>
                <nav className="space-y-2">
                    <a href="#" className="hover:text-primary">Profile</a>
                    <a href="#" className="hover:text-primary">Contact Info</a>
                    <a href="#" className="hover:text-primary">Payments</a>
                    <a href="#" className="hover:text-primary">Settings</a>
                    <a href="#" className="hover:text-primary">Support</a>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-6">
                {/* Profile Container */}
                <section className="lg:w-1/2 bg-gray-100 p-6 rounded-lg shadow">
                    <div className="flex flex-col items-center">
                        <div className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center">
                            <p className="text-gray-700">150 x 150</p>
                        </div>
                        <div className="w-full mt-6">
                            <div className="flex items-center mb-4">
                                <label className="w-1/4 font-bold">Name:</label>
                                <input
                                    type="text"
                                    className="w-3/4 p-2 border rounded"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div className="flex items-center mb-4">
                                <label className="w-1/4 font-bold">Phone:</label>
                                <input
                                    type="text"
                                    className="w-3/4 p-2 border rounded"
                                    placeholder="555-555-5555"
                                />
                            </div>
                            <div className="flex items-center">
                                <label className="w-1/4 font-bold">Email:</label>
                                <input
                                    type="text"
                                    className="w-3/4 p-2 border rounded"
                                    placeholder="john.doe@example.com"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Right Containers (Events and Favorites) */}
                <div className="lg:w-1/2 flex flex-col space-y-6">
                    {/* My Events */}
                    <section className="bg-gray-100 p-6 rounded-lg shadow">
                        <h3 className="text-lg font-bold mb-4">My Events</h3>
                        <ul className="space-y-2">
                            <li>Event 1 - Date</li>
                            <li>Event 2 - Date</li>
                            <li>Event 3 - Date</li>
                        </ul>
                    </section>

                    {/* My Favorites */}
                    <section className="bg-gray-100 p-6 rounded-lg shadow">
                        <h3 className="text-lg font-bold mb-4">My Favorites</h3>
                        <ul className="space-y-2">
                            <li>Favorite Event 1</li>
                            <li>Favorite Event 2</li>
                            <li>Favorite Event 3</li>
                        </ul>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default UserProfile;
