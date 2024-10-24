import React from 'react';
import { Outlet } from 'react-router-dom';
import SideBar from "../../components/User/SideBar.jsx";

const UserProfilePage = () => {
    return (
        <div className="bg-gray-100 min-h-screen flex p-0">
            <div className="w-1/6 bg-gray-900 fixed top-0 left-0 h-screen rounded-lg">
                <SideBar />
            </div>
            <div className="flex-grow p-8 ml-[16.6667%]">
                <div className="bg-gray-900 text-white shadow-md rounded-lg p-6 h-full min-h-screen">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default UserProfilePage;
