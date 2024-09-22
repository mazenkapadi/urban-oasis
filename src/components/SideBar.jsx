import React from 'react';
import { Link } from 'react-router-dom';
import { BiTask, BiBookAlt } from 'react-icons/bi';
import { CreditCardIcon, HomeIcon, QuestionMarkCircleIcon, Cog6ToothIcon } from "@heroicons/react/20/solid";

const Sidebar = () => {
    return (
        <div className="flex flex-col bg-white shadow-lg rounded-lg p-7 w-64 h-full">
            {/* Logo Section */}
            <div className="logo flex items-center mb-6 flex-shrink-0">
                {/* <BiBookAlt className="logo-icon h-6 w-6 text-2xl mr-2" />
                  <h2 className="text-xl font-bold text-gray-700">UrbanOasis</h2>*/}
            </div>

            {/* Menu List */}
            <div className="menu--list space-y-2 flex-grow">
                <Link to="/userProfilePage" className="item flex items-center p-3 rounded hover:bg-gray-300 transition">
                    <HomeIcon className="h-6 w-6 mr-2" />
                    <span>Profile</span>
                </Link>
                <Link to="/userProfilePage/contact-info" className="item flex items-center p-3 rounded hover:bg-gray-300 transition">
                    <BiTask className="h-6 w-6 mr-2" />
                    <span>Contact Info</span>
                </Link>
                <Link to="/userProfilePage/payments" className="item flex items-center p-3 rounded hover:bg-gray-300 transition">
                    <CreditCardIcon className="h-6 w-6 mr-2" />
                    <span>Payments</span>
                </Link>
                <Link to="/userProfilePage/settings" className="item flex items-center p-3 rounded hover:bg-gray-300 transition">
                    <Cog6ToothIcon className="h-6 w-6 mr-2" />
                    <span>Settings</span>
                </Link>
                <Link to="/userProfilePage/support" className="item flex items-center p-3 rounded hover:bg-gray-300 transition">
                    <QuestionMarkCircleIcon className="h-6 w-6 mr-2" />
                    <span>Support</span>
                </Link>
            </div>
        </div>
    );
};

export default Sidebar;
