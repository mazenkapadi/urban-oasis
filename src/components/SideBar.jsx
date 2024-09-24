import React from 'react';
import { Link } from 'react-router-dom';
import { BiTask } from 'react-icons/bi';
import { CreditCardIcon, HomeIcon, QuestionMarkCircleIcon, Cog6ToothIcon, UserIcon } from "@heroicons/react/20/solid";
import { signOutUser } from "../services/auth/signOut.js";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {

    const navigate = useNavigate();
    const handleSignOut = () => {
        signOutUser();
        navigate("/signIn");
    };

    return (
        <div className="flex flex-col bg-gray-900 shadow-lg rounded-lg p-7 w-64 h-screen">
            <Link to="/userProfilePage"
                  className="item flex items-center p-3 rounded hover:bg-gray-700 transition text-white">
                <HomeIcon className="h-6 w-6 mr-2 text-white" />
                <span>Profile</span>
            </Link>
            <Link to="/userProfilePage/contact-info"
                  className="item flex items-center p-3 rounded hover:bg-gray-700 transition text-white">
                <BiTask className="h-6 w-6 mr-2 text-white" />
                <span>Contact Info</span>
            </Link>
            <Link to="/userProfilePage/payments"
                  className="item flex items-center p-3 rounded hover:bg-gray-700 transition text-white">
                <CreditCardIcon className="h-6 w-6 mr-2 text-white" />
                <span>Payments</span>
            </Link>
            <Link to="/userProfilePage/settings"
                  className="item flex items-center p-3 rounded hover:bg-gray-700 transition text-white">
                <Cog6ToothIcon className="h-6 w-6 mr-2 text-white" />
                <span>Settings</span>
            </Link>
            <Link to="/userProfilePage/support"
                  className="item flex items-center p-3 rounded hover:bg-gray-700 transition text-white">
                <QuestionMarkCircleIcon className="h-6 w-6 mr-2 text-white" />
                <span>Support</span>
            </Link>
            <div className="mt-auto"> {/* Keeps Host Dashboard at the bottom */}
                <Link to="/host-dashboard"
                      className="item flex items-center p-3 rounded hover:bg-gray-700 transition text-white">
                    <UserIcon className="h-6 w-6 mr-2 text-white" />
                    <span>Host Dashboard</span>
                </Link>
                <button
                    type="submit"
                    onClick={handleSignOut}
                    className="w-full bg-red-600 hover:bg-red-800 text-white font-bold py-3 rounded-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 mt-4"
                >
                    Sign Out
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
