// import React, { useEffect, useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { HomeIcon, UserCircleIcon, Cog6ToothIcon, UserIcon } from '@heroicons/react/20/solid';
// import { ChatBubbleLeftRightIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
// import { BiTask } from 'react-icons/bi';
// import { signOutUser } from '../../services/auth/signOut';
// import { onAuthStateChanged } from 'firebase/auth';
// import { auth, db } from '../../firebaseConfig';
// import { doc, getDoc } from 'firebase/firestore';
//
// const SideBar = () => {
//     const navigate = useNavigate();
//     const [isHost, setIsHost] = useState(false);
//
//     useEffect(() => {
//         const checkAuthState = () => {
//             onAuthStateChanged(auth, async (user) => {
//                 if (user) {
//                     const userDoc = await getDoc(doc(db, 'Users', user.uid));
//                     if (userDoc.exists()) {
//                         setIsHost(userDoc.data()?.isHost || false);
//                     }
//                 }
//             });
//         };
//
//         checkAuthState();
//     }, []);
//
//     const handleSignOut = () => {
//         signOutUser();
//         navigate('/signIn');
//     };
//
//     return (
//         <div className="flex flex-col bg-secondary-dark-2 shadow-lg rounded-lg p-7 h-screen overflow-y-auto text-primary-light">
//             <Link to="/#" className="sidebar-link">
//                 <HomeIcon className="sidebar-icon" />
//                 <span>HomePage</span>
//             </Link>
//             <Link to="/userProfilePage" className="sidebar-link">
//                 <UserCircleIcon className="sidebar-icon" />
//                 <span>Profile</span>
//             </Link>
//             <Link to="/userProfilePage/contact-info" className="sidebar-link">
//                 <BiTask className="sidebar-icon" />
//                 <span>Contact Info</span>
//             </Link>
//             <Link to="/userProfilePage/host-chatlist" className="sidebar-link">
//                 <ChatBubbleLeftRightIcon className="sidebar-icon" />
//                 <span>Chats</span>
//             </Link>
//             <Link to="/userProfilePage/preferences" className="sidebar-link">
//                 <AdjustmentsHorizontalIcon className="sidebar-icon" />
//                 <span>Event Preferences</span>
//             </Link>
//             <Link to="/userProfilePage/settings" className="sidebar-link">
//                 <Cog6ToothIcon className="sidebar-icon" />
//                 <span>Settings</span>
//             </Link>
//
//             <div className="mt-auto">
//                 <button
//                     onClick={() => navigate('/hostProfilePage')}
//                     className="sidebar-link w-full text-left"
//                 >
//                     <UserIcon className="sidebar-icon" />
//                     <span>Host Dashboard</span>
//                 </button>
//                 <button
//                     onClick={handleSignOut}
//                     className="btn btn-secondary w-full mt-4"
//                 >
//                     Sign Out
//                 </button>
//             </div>
//         </div>
//     );
// };
//
// export default SideBar;


import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HomeIcon, UserCircleIcon, Cog6ToothIcon, UserIcon } from '@heroicons/react/20/solid';
import { ChatBubbleLeftRightIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { BiTask } from 'react-icons/bi';
import { signOutUser } from '../../services/auth/signOut';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

const SideBar = () => {
    const navigate = useNavigate();
    const [isHost, setIsHost] = useState(false);

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

    return (
        <div className="flex flex-col bg-secondary-dark-2 shadow-lg rounded-lg p-6 h-[calc(100vh-2rem)] fixed top-4 left-4 overflow-y-auto text-primary-light">
            <Link to="/#" className="sidebar-link">
                <HomeIcon className="sidebar-icon" />
                <span>HomePage</span>
            </Link>
            <Link to="/userProfilePage" className="sidebar-link">
                <UserCircleIcon className="sidebar-icon" />
                <span>Profile</span>
            </Link>
            <Link to="/userProfilePage/contact-info" className="sidebar-link">
                <BiTask className="sidebar-icon" />
                <span>Contact Info</span>
            </Link>
            <Link to="/userProfilePage/host-chatlist" className="sidebar-link">
                <ChatBubbleLeftRightIcon className="sidebar-icon" />
                <span>Chats</span>
            </Link>
            <Link to="/userProfilePage/preferences" className="sidebar-link">
                <AdjustmentsHorizontalIcon className="sidebar-icon" />
                <span>Event Preferences</span>
            </Link>
            <Link to="/userProfilePage/settings" className="sidebar-link">
                <Cog6ToothIcon className="sidebar-icon" />
                <span>Settings</span>
            </Link>

            <div className="mt-auto">
                <button
                    onClick={() => navigate('/hostProfilePage')}
                    className="sidebar-link w-full text-left"
                >
                    <UserIcon className="sidebar-icon" />
                    <span>Host Dashboard</span>
                </button>
                <button
                    onClick={handleSignOut}
                    className="btn btn-secondary w-full mt-4"
                >
                    Sign Out
                </button>
            </div>
        </div>
    );
};

export default SideBar;
