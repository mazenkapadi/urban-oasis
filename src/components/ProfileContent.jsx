import React from 'react';
import ContentHeader from './ContentHeader';
import UserProfileContainer from './UserProfileContainer';
import MyEventsContainer from './MyEventsContainer';
import MyFavoritesContainer from './MyFavoritesContainer';

const ProfileContent = () => {
    return (
        <div className="w-3/4 bg-gray-50 p-6">
            <ContentHeader />
            <div className="grid grid-cols-2 gap-6">
                <UserProfileContainer />
                <div className="space-y-6">
                    <MyEventsContainer />
                    <MyFavoritesContainer />
                </div>
            </div>
        </div>
    );
};

export default ProfileContent;
