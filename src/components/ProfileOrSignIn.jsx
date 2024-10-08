import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig.js";

// eslint-disable-next-line react/prop-types
const ProfileOrSignIn = ({ isLoggedIn }) => {
    const navigate = useNavigate();
    const [profilePic, setProfilePic] = useState('');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const userDocRef = doc(db, "Users", user.uid);
                    const userDocSnap = await getDoc(userDocRef);

                    if (userDocSnap.exists()) {
                        const userData = userDocSnap.data();

                        // Set the profile picture from Firestore
                        const profilePicURL = userData.profilePic || "";
                        setProfilePic(profilePicURL);
                    } else {
                        console.log("No such document in Firestore!");
                    }
                } catch (error) {
                    console.error("Error fetching profile data from Firestore:", error);
                }
            }
        });

        return () => unsubscribe();
    }, []);

    const handleSignIn = () => {
        navigate("/signIn");
    };

    return (
        <div className="flex items-center space-x-4">
            {isLoggedIn ? (
                profilePic ? (
                    <button
                        onClick={() => navigate("/userProfilePage")}
                        className="w-10 h-10 rounded-lg overflow-hidden"
                    >
                        <img
                            src={profilePic}
                            alt="User Profile"
                            className="w-full h-full object-cover"
                        />
                    </button>
                ) : (
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-500 flex items-center justify-center">
                    </div>
                )
            ) : (
                <button
                    className="rounded-lg bg-gray-900 text-gray-200 px-6 py-2"
                    onClick={handleSignIn}
                >
                    Sign In
                </button>
            )}
        </div>
    );
};

export default ProfileOrSignIn;
