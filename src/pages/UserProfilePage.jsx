import React from 'react';
import SideBar from '../components/SideBar';
import ProfileContent from '../components/ProfileContent';

const UserProfilePage = () => {
    return (
        <div className="flex">
            <SideBar />
            <ProfileContent />
        </div>
    );
};

export default UserProfilePage;
