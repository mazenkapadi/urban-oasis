import React from 'react';
import SideBar from '../components/SideBar';
import { Outlet } from 'react-router-dom';
import HeaderComponent from '../components/HeaderComponent.jsx';

const UserProfilePage = () => {
    return (
        <div className="bg-gray-100 min-h-screen">
            <HeaderComponent />
            <div className="flex">
                {/* Sidebar */}
                <div className="w-1/4 p-4">
                    <SideBar />
                </div>
                <div className="flex-grow p-8">
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfilePage;
