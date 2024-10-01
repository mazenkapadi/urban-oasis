import React from 'react';
import { Outlet } from 'react-router-dom';
import SideBar from "../components/SideBar";

const UserProfilePage = () => {
    return (
        <div className="flex">
            <div className="w-64 bg-gray-900 fixed top-4 left-4 rounded-lg shadow-lg">
                <SideBar />
            </div>

            <div className="flex-grow bg-gray-100 p-8 ml-72 min-h-screen">
                <div className="bg-gray-900 text-white shadow-md rounded-lg p-6 min-h-screen">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default UserProfilePage;
