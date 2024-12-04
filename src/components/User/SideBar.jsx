import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HomeIcon, UserCircleIcon, Cog6ToothIcon, UserIcon } from '@heroicons/react/20/solid';
import { ChatBubbleLeftRightIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { BiTask } from 'react-icons/bi';
import { signOutUser } from '../../services/auth/signOut';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import themeManager from "../../utils/themeManager.jsx";

const SideBar = () => {
    const navigate = useNavigate();
    const [ isHost, setIsHost ] = useState(false);
    const [ darkMode, setDarkMode ] = useState(themeManager.isDarkMode);

    useEffect(() => {
        const handleThemeChange = (isDark) => setDarkMode(isDark);
        themeManager.addListener(handleThemeChange);

        return () => {
            themeManager.removeListener(handleThemeChange);
        };
    }, []);

    useEffect(() => {
        const checkAuthState = () => {
            onAuthStateChanged(auth, async (user) => {
                if (user) {
                    const userDoc = await getDoc(doc(db, 'Users', user.uid));
                    if (userDoc.exists()) {
                        setIsHost(userDoc.data()?.isHost || false);
                    }
                }
            });
        };

        checkAuthState();
    }, []);

    const handleSignOut = () => {
        signOutUser();
        navigate('/signIn');
    };

    const handleHostButtonClick = () => {
        if (isHost) {
            navigate('/hostProfilePage');
        } else {
            navigate('/userProfilePage/host-signup');
        }
    };

    return (
        <div
            className={`flex flex-col ${darkMode ? "bg-Dark-D2 text-primary-light" : "bg-Light-L2 text-primary-dark"} shadow-lg rounded-lg p-6 h-[calc(100vh-2rem)] fixed top-4 left-4 overflow-y-auto`} >
            <Link to="/#" className={`flex items-center p-3 rounded-lg ${darkMode ? "hover:bg-Light-L3 hover:text-primary-dark" : "hover:bg-Dark-D1 hover:text-primary-light"}  transition duration-300`} >
                <HomeIcon className="sidebar-icon" />
                <span >HomePage</span >
            </Link >
            <Link to="/userProfilePage" className={`flex items-center p-3 rounded-lg ${darkMode ? "hover:bg-Light-L3 hover:text-primary-dark" : "hover:bg-Dark-D1 hover:text-primary-light"}  transition duration-300`} >
                <UserCircleIcon className="sidebar-icon" />
                <span >Profile</span >
            </Link >
            <Link to="/userProfilePage/contact-info" className={`flex items-center p-3 rounded-lg ${darkMode ? "hover:bg-Light-L3 hover:text-primary-dark" : "hover:bg-Dark-D1 hover:text-primary-light"}  transition duration-300`} >
                <BiTask className="sidebar-icon" />
                <span >Contact Info</span >
            </Link >
            <Link to="/userProfilePage/host-chatlist" className={`flex items-center p-3 rounded-lg ${darkMode ? "hover:bg-Light-L3 hover:text-primary-dark" : "hover:bg-Dark-D1 hover:text-primary-light"}  transition duration-300`} >
                <ChatBubbleLeftRightIcon className="sidebar-icon" />
                <span >Chats</span >
            </Link >
            <Link to="/userProfilePage/preferences" className={`flex items-center p-3 rounded-lg ${darkMode ? "hover:bg-Light-L3 hover:text-primary-dark" : "hover:bg-Dark-D1 hover:text-primary-light"}  transition duration-300`} >
                <AdjustmentsHorizontalIcon className="sidebar-icon" />
                <span >Event Preferences</span >
            </Link >
            <Link to="/userProfilePage/settings" className={`flex items-center p-3 rounded-lg ${darkMode ? "hover:bg-Light-L3 hover:text-primary-dark" : "hover:bg-Dark-D1 hover:text-primary-light"}  transition duration-300`} >
                <Cog6ToothIcon className="sidebar-icon" />
                <span >Settings</span >
            </Link >

            <div className="mt-auto" >
                <button
                    onClick={handleHostButtonClick}
                    className={`w-full text-left flex items-center p-3 rounded-lg ${darkMode ? "hover:bg-Light-L3 hover:text-primary-dark" : "hover:bg-Dark-D1 hover:text-primary-light"}  transition duration-300`}
                >
                    <UserIcon className="sidebar-icon" />
                    <span >Host Dashboard</span >
                </button >
                <button
                    onClick={handleSignOut}
                    className="btn btn-secondary w-full mt-4"
                >
                    Sign Out
                </button >
            </div >
        </div >
    );
};

export default SideBar;