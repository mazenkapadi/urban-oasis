import React from 'react';

const MyFavoritesContainer = () => {
    const favorites = [
        'Favorite Event 1',
        'Favorite Event 2',
        'Favorite Event 3',
    ]; // Replace with Firestore fetch later

    return (
        <div className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-2">My Favorites</h2>
            <ul className="list-disc pl-5">
                {favorites.slice(0, 3).map((fav, index) => (
                    <li key={index} className="text-gray-700">{fav}</li>
                ))}
            </ul>
        </div>
    );
};

export default MyFavoritesContainer;
