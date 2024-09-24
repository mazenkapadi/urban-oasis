import React from 'react';
import SideBar from '../components/SideBar';
import { Outlet } from 'react-router-dom';

const UserProfilePage = () => {
    return (
        <div className="bg-gray-200 min-h-screen flex justify-start p-6">
            {/* Sidebar (fixed width) */}
            <SideBar />

            {/* Content area (takes the remaining width) */}
            <div className="flex-grow p-8">
                {/* Content wrapper */}
                <div className="bg-white shadow-md rounded-lg p-6 h-full">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default UserProfilePage;
