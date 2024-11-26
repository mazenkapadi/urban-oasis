// // components/HeaderComponent.jsx
// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { getAuth, onAuthStateChanged } from "firebase/auth";
// import { doc, getDoc } from "firebase/firestore";
// import { db } from "../firebaseConfig";
// import AutocompleteSearch from "./AutoCompleteSearch.jsx";
// import LogoComponent from "./LogoComponent.jsx";
//
// const HeaderComponent = () => {
//     const [ menuOpen, setMenuOpen ] = useState(false);
//     const [ isLoggedIn, setIsLoggedIn ] = useState(false);
//     const [ profilePic, setProfilePic ] = useState('');
//     const [ name, setName ] = useState('');
//     const navigate = useNavigate();
//
//     useEffect(() => {
//         const authInstance = getAuth();
//         const unsubscribe = onAuthStateChanged(authInstance, async (user) => {
//             setIsLoggedIn(!!user);
//             if (user) {
//                 try {
//                     const userDocRef = doc(db, "Users", user.uid);
//                     const userDocSnap = await getDoc(userDocRef);
//                     if (userDocSnap.exists()) {
//                         const userData = userDocSnap.data();
//                         setProfilePic(userData.profilePic || '');
//                         setName(`${userData.name?.firstName || ''} ${userData.name?.lastName || ''}`);
//                     } else {
//                         console.log("No such document in Firestore!");
//                     }
//                 } catch (error) {
//                     console.error("Error fetching profile data from Firestore:", error);
//                 }
//             }
//         });
//         return () => unsubscribe();
//     }, []);
//
//     const toggleMenu = () => {
//         setMenuOpen((prev) => !prev);
//     };
//
//     const handleSignIn = () => {
//         navigate("/signIn");
//     };
//
//     const getInitials = (name) => {
//         const nameParts = name.split(' ');
//         return nameParts.map(part => part[0]).join('').toUpperCase();
//     };
//
//     return (
//         <div className="p-2 bg-transparent w-full" >
//             <div className="flex justify-between items-center" >
//                 <div className="flex items-center pl-8" >
//                     <button onClick={() => window.location.href = "/"} >
//                         <LogoComponent />
//                     </button >
//                 </div >
//
//                 {/* Autocomplete Search */}
//                 <div className="mx-8" >
//                     <AutocompleteSearch />
//                 </div >
//
//                 <div className="flex items-center space-x-4 pr-4" >
//                     {isLoggedIn ? (
//                         <button
//                             onClick={() => navigate("/userProfilePage")}
//                             className="w-10 h-10 rounded-lg overflow-hidden bg-gray-500 flex items-center justify-center"
//                         >
//                             {profilePic ? (
//                                 <img
//                                     src={profilePic}
//                                     alt="User Profile"
//                                     className="w-full h-full object-cover rounded-lg"
//                                 />
//                             ) : (
//                                 <span className="text-white font-bold" >
//                                     {getInitials(name || 'U N')}
//                                 </span >
//                             )}
//                         </button >
//                     ) : (
//                         <button
//                             className="rounded-lg bg-gray-900 text-gray-200 px-6 py-2"
//                             onClick={handleSignIn}
//                         >
//                             Sign In
//                         </button >
//                     )}
//
//                     <button onClick={toggleMenu} className="focus:outline-none relative" >
//                         <svg
//                             className="w-10 h-10 text-white"
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24"
//                             xmlns="http://www.w3.org/2000/svg"
//                         >
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//                                   d="M4 6h16M4 12h16m-7 6h7" />
//                         </svg >
//                     </button >
//                 </div >
//             </div >
//         </div >
//     );
// };
//
// export default HeaderComponent;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import AutocompleteSearch from "./AutoCompleteSearch.jsx";

const HeaderComponent = () => {
    const [ menuOpen, setMenuOpen ] = useState(false);
    const [ isLoggedIn, setIsLoggedIn ] = useState(false);
    const [ name, setName ] = useState('');
    const [ profilePic, setProfilePic ] = useState('');
    const [ isHost, setIsHost ] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const authInstance = getAuth();
        const unsubscribe = onAuthStateChanged(authInstance, async (user) => {
            setIsLoggedIn(!!user);
            if (user) {
                try {
                    const userDocRef = doc(db, "Users", user.uid);
                    const userDocSnap = await getDoc(userDocRef);
                    if (userDocSnap.exists()) {
                        const userData = userDocSnap.data();
                        setName(userData.name?.firstName || 'User');
                        setProfilePic(userData.profilePic || '');
                        setIsHost(userData.isHost || false); // Check if user is a host
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

    const toggleMenu = () => {
        setMenuOpen((prev) => !prev);
    };

    const handleSignOut = () => {
        const authInstance = getAuth();
        signOut(authInstance)
            .then(() => {
                setIsLoggedIn(false);
                navigate("/");
            })
            .catch((error) => console.error("Error signing out:", error));
    };

    return (
        <header className="bg-transparent w-full p-2" >
            <div className="flex justify-between items-center" >
                {/* Logo */}
                <div className="flex items-center pl-8" >
                    <button onClick={() => navigate("/")} >
                        <span
                            className="ml-1 text-white text-4xl font-archivo"
                            style={{textShadow: "4px 3px 4px rgba(0, 0, 0, 0.8)"}}
                        >
                            Urban Oasis
                        </span >
                    </button >
                </div >

                {/* Autocomplete Search */}
                <div className="mx-8 flex-1" >
                    <AutocompleteSearch />
                </div >

                {/* Hamburger Menu Dropdown */}
                <div className="relative pr-8" >
                    <button
                        onClick={toggleMenu}
                        className="focus:outline-none"
                    >
                        <svg
                            className="w-10 h-10 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M4 6h16M4 12h16m-7 6h7" />
                        </svg >
                    </button >
                    {menuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg text-white" >
                            <ul className="" >
                                {isLoggedIn ? (
                                    <>
                                        {/*<li className="flex items-center px-4 py-2">*/}
                                        {/*    {profilePic ? (*/}
                                        {/*        <img*/}
                                        {/*            src={profilePic}*/}
                                        {/*            alt="User Profile"*/}
                                        {/*            className="w-8 h-8 rounded-full mr-2"*/}
                                        {/*        />*/}
                                        {/*    ) : (*/}
                                        {/*        <span className="w-8 h-8 flex items-center justify-center bg-gray-600 text-white rounded-full mr-2">*/}
                                        {/*            {name.charAt(0).toUpperCase()}*/}
                                        {/*        </span>*/}
                                        {/*    )}*/}
                                        {/*    <span>{name}</span>*/}
                                        {/*</li>*/}
                                        {/*<li>*/}
                                        {/*    <button*/}
                                        {/*        onClick={() => navigate("/userProfilePage")}*/}
                                        {/*        className="block px-4 py-2 hover:bg-gray-700 w-full text-left"*/}
                                        {/*    >*/}
                                        {/*        Profile*/}
                                        {/*    </button>*/}
                                        {/*</li>*/}
                                        <li >
                                            <button
                                                onClick={() => navigate("/userProfilePage")}
                                                className="flex items-center px-4 py-2 hover:bg-gray-700 hover:rounded-lg w-full text-left"
                                            >
                                                {profilePic ? (
                                                    <img
                                                        src={profilePic}
                                                        alt="User Profile"
                                                        className="w-8 h-8 rounded-full mr-2"
                                                    />
                                                ) : (
                                                    <span
                                                        className="w-8 h-8 flex items-center justify-center bg-gray-600 text-white rounded-full mr-2" >
                                                        {name.charAt(0).toUpperCase()}
                                                    </span >
                                                )}
                                                <span >{name}</span >
                                            </button >
                                        </li >
                                        <li >
                                            <button
                                                onClick={() => navigate("/userProfilePage/host-chatlist")}
                                                className="block px-4 py-2 hover:bg-gray-700 hover:rounded-lg w-full text-left"
                                            >
                                                Chat
                                            </button >
                                        </li >
                                        {isHost && (
                                            <li >
                                                <button
                                                    onClick={() => navigate("/hostProfilePage")}
                                                    className="block px-4 py-2 hover:bg-gray-700 hover:rounded-lg w-full text-left"
                                                >
                                                    Host Dashboard
                                                </button >
                                            </li >
                                        )}
                                        <li >
                                            <button
                                                onClick={handleSignOut}
                                                className="block px-4 py-2 hover:bg-gray-700 hover:rounded-lg w-full text-left"
                                            >
                                                Log Out
                                            </button >
                                        </li >
                                    </>
                                ) : (
                                    <li >
                                        <button
                                            onClick={() => navigate("/signIn")}
                                            className="block px-4 py-2 hover:bg-gray-700 hover:rounded-lg w-full text-left"
                                        >
                                            Sign In
                                        </button >
                                    </li >
                                )}
                            </ul >
                        </div >
                    )}
                </div >
            </div >
        </header >
    );
};

export default HeaderComponent;
