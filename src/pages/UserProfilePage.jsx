import React from 'react';
import SideBar from '../components/SideBar';
import { Outlet } from 'react-router-dom';

const UserProfilePage = () => {
    return (
        <div className="flex bg-gray-100 min-h-screen">
            <div className="rounded-lg shadow-md bg-white p-4 m-4">
                <SideBar />
            </div>
            <div className="flex-grow p-8">
                <div className="bg-white shadow-md rounded-lg p-6">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default UserProfilePage;
