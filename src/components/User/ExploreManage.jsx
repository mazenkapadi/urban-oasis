import React from 'react';
import { useNavigate } from "react-router-dom";

const ExploreManage = () => {
    const navigate = useNavigate();

    return (
        <div className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-4">Explore & Manage</h2> {/* Renamed to Explore & Manage */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Explore & Manage - My Event History */}
                <div className="bg-gray-800 shadow-md rounded-lg p-6 text-center">
                    <h3 className="text-lg font-semibold text-white mb-2">My Event History</h3>
                    <p className="text-gray-400">View all the events you've attended.</p>
                    <button
                        className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-800 transition"
                        onClick={() => navigate('/event-history')}>
                        View History
                    </button>
                </div>

                {/* Explore & Manage - Explore Upcoming Events */}
                <div className="bg-gray-800 shadow-md rounded-lg p-6 text-center">
                    <h3 className="text-lg font-semibold text-white mb-2">Explore Upcoming Events</h3>
                    <p className="text-gray-400">Discover new events based on your interests.</p>
                    <button
                        className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-800 transition"
                        onClick={() => navigate('/upcoming-events')}>
                        Explore Events
                    </button>
                </div>

                {/* Explore & Manage - Manage RSVPs */}
                <div className="bg-gray-800 shadow-md rounded-lg p-6 text-center">
                    <h3 className="text-lg font-semibold text-white mb-2">Manage RSVPs</h3>
                    <p className="text-gray-400">Modify or cancel your upcoming RSVPs.</p>
                    <button
                        className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-800 transition"
                        onClick={() => navigate('/manage-rsvps')}>
                        Manage RSVPs
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExploreManage;
