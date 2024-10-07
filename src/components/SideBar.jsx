import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BiTask } from 'react-icons/bi';
import { CreditCardIcon, HomeIcon, QuestionMarkCircleIcon, Cog6ToothIcon, UserIcon, UserCircleIcon } from "@heroicons/react/20/solid";
import { signOutUser } from "../services/auth/signOut.js";
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebaseConfig.js';
import { doc, getDoc } from 'firebase/firestore';

const SideBar = () => {
    const navigate = useNavigate();
    const [isHost, setIsHost] = useState(false);
    const [userId, setUserId] = useState(null);

    // Check the auth state and fetch user data
    useEffect(() => {
        const checkAuthState = () => {
            onAuthStateChanged(auth, async (user) => {
                if (user) {
                    setUserId(user.uid); // Get the user's UID
                    console.log('User is signed in');

                    const userDocRef = doc(db, 'Users', user.uid); // Adjust collection name if different
                    const userDoc = await getDoc(userDocRef);

                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        setIsHost(userData.isHost || false); // Set isHost state
                    }
                } else {
                    console.log("User is not signed in.");
                    setUserId(null);
                    setIsHost(false);
                }
            });
        };

        checkAuthState();
    }, []);

    const handleSignOut = () => {
        signOutUser();
        navigate("/signIn");
    };

    const handleHostDashboardClick = () => {
        if (isHost) {
            navigate("/hostProfilePage");
        } else {
            navigate("/userProfilePage/host-signup");
        }
    };

    return (
        <div className="flex flex-col bg-gray-900 shadow-lg rounded-lg p-7 h-screen overflow-y-auto">
            <Link to="/#"
                  className="item flex items-center p-3 rounded hover:bg-gray-700 transition text-white">
                <HomeIcon className="h-6 w-6 mr-2 text-white" />
                <span>HomePage</span>
            </Link>
            <Link to="/userProfilePage"
                  className="item flex items-center p-3 rounded hover:bg-gray-700 transition text-white">
                <UserCircleIcon className="h-6 w-6 mr-2 text-white" />
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
                <button
                    onClick={handleHostDashboardClick}
                    className="item flex items-center p-3 rounded hover:bg-gray-700 transition text-white w-full text-left"
                >
                    <UserIcon className="h-6 w-6 mr-2 text-white" />
                    <span>Host Dashboard</span>
                </button>
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

export default SideBar;
