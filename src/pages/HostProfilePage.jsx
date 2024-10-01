import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from "../firebaseConfig.js";
import { useNavigate } from "react-router-dom";
import SideBar from "../components/SideBar";
import { PlusIcon } from "@heroicons/react/20/solid";

const HostProfilePage = () => {
    const [ name, setName ] = useState('');
    const [ email, setEmail ] = useState('');
    const [ hostType, setHostType ] = useState('');
    const [ companyName, setCompanyName ] = useState('');
    const [ bio, setBio ] = useState('');
    const [ profilePicture, setProfilePicture ] = useState('');
    const [ hostedEvents, setHostedEvents ] = useState([]);
    const navigate = useNavigate();

    const userId = auth.currentUser?.uid;

    const handleEditProfile = () => {
        navigate('/userProfilePage');
    };

    useEffect(() => {
        const fetchHostData = async () => {
            if (userId) {
                const docRef = doc(db, 'Users', userId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setName(`${data.firstName || ''} ${data.lastName || ''}`);
                    setEmail(data.email || '');
                    setHostType(data.hostType || '');
                    setCompanyName(data.companyName || '');
                    setBio(data.bio || '');
                    setProfilePicture(data.profilePicture || 'https://via.placeholder.com/150');
                    setIsHost(data.isHost || false);

                    if (!data.isHost) {
                        navigate('/hostSignUp');
                    }
                } else {
                    console.log('No such document!');
                }
            }
        };

        fetchHostData();
    }, [ userId, navigate ]);

    return (
        <div className="bg-gray-100 min-h-screen flex justify-start p-0" >
            <div className="w-1/6 bg-gray-900 sticky top-0 h-screen rounded-lg" >
                <SideBar />
            </div >
            <div className="flex-grow p-8" >
                <div className="bg-gray-900 text-white shadow-md rounded-lg p-6 h-full min-h-screen" >
                    <div className="w-full" >
                        <div className="flex justify-between items-center mb-6" >
                            <div >
                                <h1 className="text-3xl font-bold text-white" >Host Dashboard</h1 >
                                <p className="text-gray-300" >Welcome back, {name.split(' ')[0]}</p >
                            </div >
                            <div >
                                <button
                                    className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300"
                                    onClick={() => navigate('/EventCreation')}
                                >
                                    <p className="mr-2" >Create an Event</p >
                                    <PlusIcon className="h-6 w-6" />
                                </button >
                            </div >
                        </div >

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" >
                            <div className="bg-white shadow-md rounded-lg p-6 col-span-1 flex flex-col items-center" >
                                <img
                                    src={profilePicture}
                                    alt="Host Profile"
                                    className="rounded-full w-24 h-24 object-cover mb-4"
                                />
                                <h2 className="text-xl font-semibold mb-2 text-gray-900" >{name}</h2 >
                                <p className="text-gray-700" >{email}</p >
                                <p className="text-gray-700" >{hostType === 'company' ? companyName : 'Individual Host'}</p >
                                <p className="text-gray-700 text-center" >{bio}</p >
                                <button
                                    onClick={handleEditProfile}
                                    className="mt-4 w-full bg-blue-800 text-white font-bold py-2 rounded-md hover:bg-blue-600 transition" >
                                    Edit Profile
                                </button >
                            </div >
                            <div className="lg:col-span-2 space-y-6" >
                                <div className="bg-white shadow-md rounded-lg p-6" >
                                    <h2 className="text-lg font-semibold mb-4 text-gray-900" >Hosted Events</h2 >
                                    <ul className="list-disc pl-5" >
                                        {hostedEvents.length > 0 ? (
                                            hostedEvents.map((event, index) => (
                                                <li key={index} className="text-gray-700" >{event}</li >
                                            ))
                                        ) : (
                                            <li className="text-gray-500" >No hosted events to display.</li >
                                        )}
                                    </ul >
                                </div >
                                <div className="bg-white shadow-md rounded-lg p-6" >
                                    <h2 className="text-lg font-semibold mb-4 text-gray-900" >Event Analytics</h2 >
                                    <p className="text-gray-700" >Display analytics related to hosted events here.</p >
                                </div >
                            </div >
                        </div >
                    </div >
                </div >
            </div >
        </div >
    );
};

export default HostProfilePage;
