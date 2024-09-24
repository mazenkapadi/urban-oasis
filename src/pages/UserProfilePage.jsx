import React from 'react';
import SideBar from '../components/SideBar';
import { Outlet } from 'react-router-dom';

const UserProfilePage = () => {
    return (
        <div className="bg-gray-100 min-h-screen flex justify-start p-0">
            <div className="w-1/6 bg-gray-900 sticky top-0 h-screen rounded-lg">
                <SideBar />
            </div>
            <div className="flex-grow p-8">
                <div className="bg-gray-900 text-white shadow-md rounded-lg p-6 h-full min-h-screen">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default UserProfilePage;
