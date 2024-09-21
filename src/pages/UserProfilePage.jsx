import React from 'react';
import SideBar from '../components/SideBar';
import { Outlet } from 'react-router-dom';

const UserProfilePage = () => {
    return (
        <div className="flex bg-gray-100 min-h-screen">
            <div className="w-1/4 rounded-lg p-4">
                <SideBar />
            </div>
            {/* Main content area */}
            <div className="flex-grow p-8">
                <div className="bg-white shadow-md rounded-lg p-6">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default UserProfilePage;
