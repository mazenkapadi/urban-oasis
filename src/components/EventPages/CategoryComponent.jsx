import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig.js';

const mainCategoryMapping = {
    'Music': 'Arts & Entertainment',
    'Art': 'Arts & Entertainment',
    'Comedy': 'Arts & Entertainment',
    'Theater & Performing Arts': 'Arts & Entertainment',
    'Film & Media': 'Arts & Entertainment',
    'Photography & Art Exhibits': 'Arts & Entertainment',
    'Opera': 'Arts & Entertainment',

    'Business': 'Business & Networking',
    'Networking': 'Business & Networking',
    'Politics & Activism': 'Business & Networking',
    'Charity & Fundraisers': 'Business & Networking',
    'Conferences': 'Business & Networking',

    'Technology': 'Education & Innovation',
    'Science & Innovation': 'Education & Innovation',
    'Education': 'Education & Innovation',
    'Workshops & Classes': 'Education & Innovation',
    'Talks & Seminars': 'Education & Innovation',
    'Online Courses': 'Education & Innovation',

    'Health': 'Lifestyle & Wellness',
    'Spirituality & Wellness': 'Lifestyle & Wellness',
    'Family & Kids': 'Lifestyle & Wellness',
    'Fashion & Beauty': 'Lifestyle & Wellness',
    'Mental Health': 'Lifestyle & Wellness',

    'Food & Drink': 'Food & Leisure',
    'Cooking & Culinary': 'Food & Leisure',
    'Shopping & Markets': 'Food & Leisure',
    'Travel & Outdoor': 'Food & Leisure',
    'Wine Tasting': 'Food & Leisure',
    'Dining Experiences': 'Food & Leisure',

    'Sports': 'Sports & Recreation',
    'Gaming & E-sports': 'Sports & Recreation',
    'Fitness & Training': 'Sports & Recreation',
    'Adventure Sports': 'Sports & Recreation',
    'Hiking & Nature': 'Sports & Recreation',
};

const categoryColors = {
    'Arts & Entertainment': 'bg-red-500 text-white',
    'Business & Networking': 'bg-blue-500 text-white',
    'Education & Innovation': 'bg-green-500 text-white',
    'Lifestyle & Wellness': 'bg-yellow-500 text-black',
    'Food & Leisure': 'bg-purple-500 text-white',
    'Sports & Recreation': 'bg-teal-500 text-white',
};

const CategoryComponent = () => {
    const { eventId } = useParams();
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            if (eventId) {
                try {
                    const eventDocRef = doc(db, 'Events', eventId);
                    const eventDocSnap = await getDoc(eventDocRef);

                    if (eventDocSnap.exists()) {
                        const eventData = eventDocSnap.data();
                        setCategories(eventData.basicInfo.categories || []);
                    } else {
                        console.error('Event not found.');
                    }
                } catch (error) {
                    console.error('Error fetching event categories:', error);
                }
            }
        };

        fetchCategories();
    }, [eventId]);

    const filteredCategories = categories.filter(
        (subcategory) => mainCategoryMapping[subcategory] && categoryColors[mainCategoryMapping[subcategory]]
    );

    if (filteredCategories.length === 0) {
        return null; // Do not render anything if there are no valid categories
    }

    return (
        <div className="category_container p-4">
            <div className="category_header mb-4">
                <h1 className="text-2xl font-bold text-primary-dark">Categories</h1>
            </div>
            <div className="category_body grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filteredCategories.map((subcategory) => {
                    const mainCategory = mainCategoryMapping[subcategory];
                    const colorClass = categoryColors[mainCategory];

                    return (
                        <div key={subcategory} className={`p-4 rounded-md shadow-md ${colorClass}`}>
                            <span className="font-medium">{subcategory}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CategoryComponent;
