import React from 'react';
import Sidebar from '../components/Sidebar';
import ProfileContent from '../components/ProfileContent';

const UserProfilePage = () => {
    return (
        <div className="flex">
            <Sidebar />
            <ProfileContent />
        </div>
    );
};

export default UserProfilePage;
