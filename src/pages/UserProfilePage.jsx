import React from 'react';
import SideBar from '../components/SideBar';
import { Outlet } from 'react-router-dom';

const UserProfilePage = () => {
    return (
        <div className="bg-gray-100 min-h-screen flex justify-start p-0">
            {/* Sidebar (fixed width and dynamic height based on content) */}
            <div className="w-1/4 bg-gray-900 sticky top-0 h-screen">
                <SideBar />
            </div>

            {/* Content area (takes the remaining width) */}
            <div className="flex-grow p-8">
                {/* Content wrapper */}
                <div className="bg-gray-900 text-white shadow-md rounded-lg p-6 h-full min-h-screen">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default UserProfilePage;
