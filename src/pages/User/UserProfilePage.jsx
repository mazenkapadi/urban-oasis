// import React from 'react';
// import { Outlet } from 'react-router-dom';
// import SideBar from '../../components/User/SideBar.jsx';
//
// const UserProfilePage = () => {
//     return (
//         <div className="bg-primary-light dark:bg-primary-dark min-h-screen flex">
//             <div className="w-1/6 bg-secondary-dark-1 dark:bg-secondary-light-1 fixed top-0 left-0 h-screen rounded-lg">
//                 <SideBar />
//             </div>
//             <div className="flex-grow p-8 ml-[16.6667%]">
//                 <div className="bg-secondary-light-2 dark:bg-secondary-dark-2 text-primary-dark dark:text-primary-light shadow-lg rounded-lg p-6 h-full min-h-screen">
//                     <Outlet />
//                 </div>
//             </div>
//         </div>
//     );
// };
//
// export default UserProfilePage;



import React from 'react';
import { Outlet } from 'react-router-dom';
import SideBar from '../../components/User/SideBar.jsx';

const UserProfilePage = () => {
    return (
        <div className="bg-primary-light dark:bg-primary-dark min-h-screen flex">
            <SideBar />
            <div className="flex-grow p-8 ml-[calc(16.6667%+2rem)]">
                <div className="bg-secondary-light-2 dark:bg-secondary-dark-2 text-primary-dark dark:text-primary-light shadow-lg rounded-lg p-6 h-full min-h-screen">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default UserProfilePage;

