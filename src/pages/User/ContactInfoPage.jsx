// import { useState, useEffect } from 'react';
// import { doc, getDoc, setDoc } from 'firebase/firestore';
// import { db, auth, storage } from "../../firebaseConfig.js";
// import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// import { onAuthStateChanged } from "firebase/auth";
// import SelectUSState from 'react-select-us-states';
//
// const ContactInfoPage = () => {
//     const [userId, setUserId] = useState(null);
//     const [email, setEmail] = useState('');
//     const [profilePic, setProfilePic] = useState('');
//     const [profilePicFile, setProfilePicFile] = useState(null);
//     const [uploading, setUploading] = useState(false);
//     const [prefix, setPrefix] = useState('');
//     const [firstName, setFirstName] = useState('');
//     const [lastName, setLastName] = useState('');
//     const [suffix, setSuffix] = useState('');
//     const [cellPhone, setCellPhone] = useState('');
//     const [address, setAddress] = useState('');
//     const [address2, setAddress2] = useState('');
//     const [city, setCity] = useState('');
//     const [state, setState] = useState('');
//     const [zip, setZip] = useState('');
//     const [birthday, setBirthday] = useState('');
//     const [isHost, setIsHost] = useState(false);
//     const [hostType, setHostType] = useState('individual');
//
//     // Fetch user profile when they sign in
//     useEffect(() => {
//         const unsubscribe = onAuthStateChanged(auth, async (user) => {
//             if (user) {
//                 setUserId(user.uid);
//                 setEmail(user.email);
//
//                 // Fetch user data from Firestore
//                 const docRef = doc(db, 'Users', user.uid);
//                 const docSnap = await getDoc(docRef);
//
//                 if (docSnap.exists()) {
//                     const data = docSnap.data();
//                     setProfilePic(data.profilePic || user.photoURL);
//                     setPrefix(data.name?.prefix || '');
//                     setFirstName(data.name?.firstName || '');
//                     setLastName(data.name?.lastName || '');
//                     setSuffix(data.name?.suffix || '');
//                     setCellPhone(data.contact?.cellPhone || '');
//                     setAddress(data.address?.line1 || '');
//                     setAddress2(data.address?.line2 || '');
//                     setCity(data.address?.city || '');
//                     setState(data.address?.state || '');
//                     setZip(data.address?.zip || '');
//                     setBirthday(data.birthday || '');
//                     setIsHost(data.isHost || false);
//                     setHostType(data.hostType || 'individual');
//                 } else {
//                     // If no document exists, use Google profile picture by default
//                     setProfilePic(user.photoURL || '');
//                     console.log('No such document, using Google profile picture.');
//                 }
//             } else {
//                 console.log("User is not signed in.");
//             }
//         });
//         return () => unsubscribe();
//     }, []);
//
//     // Handle file upload
//     const handleProfilePicChange = async (e) => {
//         if (e.target.files[0]) {
//             const selectedFile = e.target.files[0];
//             setProfilePicFile(selectedFile);
//
//             // Immediately upload the file when it's selected
//             if (selectedFile && userId) {
//                 setUploading(true);
//                 const fileRef = ref(storage, `userprofileimage/${userId}/${selectedFile.name}`);
//                 try {
//                     // Upload the image to Firebase Storage
//                     await uploadBytes(fileRef, selectedFile);
//                     const downloadURL = await getDownloadURL(fileRef);
//
//                     // Update the profile picture in the state to reflect immediately
//                     setProfilePic(downloadURL);
//
//                     // Save the new profile picture URL in Firestore
//                     await setDoc(doc(db, 'Users', userId), { profilePic: downloadURL }, { merge: true });
//                     alert('Profile picture updated!');
//
//                 } catch (error) {
//                     console.error('Error uploading image:', error);
//                     alert('Error uploading image!');
//                 }
//                 setUploading(false);
//             }
//         }
//     };
//
//     const handleSave = async (e) => {
//         e.preventDefault();
//
//         const userData = {
//             name: {
//                 prefix,
//                 firstName,
//                 lastName,
//                 suffix,
//             },
//             contact: {
//                 cellPhone,
//                 email,
//             },
//             address: {
//                 line1: address,
//                 line2: address2,
//                 city,
//                 state, // Save the selected state
//                 zip,
//             },
//             birthday,
//             isHost,
//             hostType,
//             updatedAt: new Date().toISOString(),
//         };
//
//         try {
//             if (userId) {
//                 await setDoc(doc(db, 'Users', userId), userData, { merge: true });
//                 alert('Changes saved!');
//             }
//         } catch (error) {
//             console.error('Error saving data: ', error);
//             alert('Error saving changes!');
//         }
//     };
//
//     return (
//         <>
//             <h1 className="text-3xl font-bold mb-8 text-white">Account Information</h1>
//
//             {/* Profile Photo Upload Section */}
//             <div className="mb-10">
//                 <label className="block text-lg font-semibold mb-4 text-white">Profile Photo</label>
//                 <div className="flex items-center space-x-4">
//                     {/* Make this section clickable */}
//                     <div
//                         className="w-32 h-32 bg-gray-800 border border-gray-300 rounded-md flex items-center justify-center cursor-pointer"
//                         onClick={() => document.getElementById('fileInput').click()} // Open file dialog when clicked
//                     >
//                         {profilePic ? (
//                             <img
//                                 src={profilePic}
//                                 alt="Profile"
//                                 className="rounded-lg w-32 h-32 object-cover"
//                             />
//                         ) : (
//                             <span className="text-white text-sm text-center">No Profile Image</span>
//                         )}
//                     </div>
//
//                     {/* Hidden file input */}
//                     <input
//                         id="fileInput"
//                         type="file"
//                         accept="image/*"
//                         style={{ display: 'none' }}
//                         onChange={handleProfilePicChange}
//                     />
//
//                     {uploading && <p className="text-gray-500">Uploading...</p>}
//                 </div>
//             </div>
//
//             {/* Contact Information Section */}
//             <div className="mb-10">
//                 <h2 className="text-xl font-semibold mb-4 text-white">Contact Information</h2>
//                 <form className="grid grid-cols-2 gap-6" onSubmit={handleSave}>
//                     {/* Prefix */}
//                     <div className="col-span-1">
//                         <label className="block text-white font-semibold mb-2">Prefix</label>
//                         <select
//                             className="block w-full p-2 border border-gray-600 rounded-md focus:border-blue-500 focus:ring-blue-500 focus:outline-none bg-gray-800 text-white"
//                             value={prefix}
//                             onChange={(e) => setPrefix(e.target.value)}
//                         >
//                             <option value="">--</option>
//                             <option value="Mr">Mr</option>
//                             <option value="Ms">Ms</option>
//                             <option value="Mrs">Mrs</option>
//                             <option value="Dr.">Dr.</option>
//                         </select>
//                     </div>
//
//                     {/* First Name */}
//                     <div className="col-span-1">
//                         <label className="block text-white font-semibold mb-2">First Name</label>
//                         <input
//                             id="firstName"
//                             type="text"
//                             className="block w-full p-2 border border-gray-600 rounded-md focus:border-blue-500 focus:ring-blue-500 focus:outline-none bg-gray-800 text-white"
//                             value={firstName}
//                             onChange={(e) => setFirstName(e.target.value)}
//                         />
//                     </div>
//
//                     {/* Last Name */}
//                     <div className="col-span-1">
//                         <label className="block text-white font-semibold mb-2">Last Name</label>
//                         <input
//                             id="lastName"
//                             type="text"
//                             className="block w-full p-2 border border-gray-600 rounded-md focus:border-blue-500 focus:ring-blue-500 focus:outline-none bg-gray-800 text-white"
//                             value={lastName}
//                             onChange={(e) => setLastName(e.target.value)}
//                         />
//                     </div>
//
//                     {/* Suffix */}
//                     <div className="col-span-1">
//                         <label className="block text-white font-semibold mb-2">Suffix</label>
//                         <input
//                             id="suffix"
//                             type="text"
//                             className="block w-full p-2 border border-gray-600 rounded-md focus:border-blue-500 focus:ring-blue-500 focus:outline-none bg-gray-800 text-white"
//                             value={suffix}
//                             onChange={(e) => setSuffix(e.target.value)}
//                         />
//                     </div>
//
//                     {/* Cell Phone */}
//                     <div className="col-span-1">
//                         <label className="block text-white font-semibold mb-2">Cell Phone</label>
//                         <input
//                             id="cellPhone"
//                             type="text"
//                             className="block w-full p-2 border border-gray-600 rounded-md focus:border-blue-500 focus:ring-blue-500 focus:outline-none bg-gray-800 text-white"
//                             value={cellPhone}
//                             onChange={(e) => setCellPhone(e.target.value)}
//                         />
//                     </div>
//
//                     {/* Birthday */}
//                     <div className="col-span-1">
//                         <label className="block text-white font-semibold mb-2">Birthday</label>
//                         <input
//                             id="birthday"
//                             type="date"
//                             className="block w-full p-2 border border-gray-600 rounded-md focus:border-blue-500 focus:ring-blue-500 focus:outline-none bg-gray-800 text-white"
//                             value={birthday}
//                             onChange={(e) => setBirthday(e.target.value)}
//                         />
//                     </div>
//
//                     {/* Address */}
//                     <div className="col-span-2">
//                         <label className="block text-white font-semibold mb-2">Address</label>
//                         <input
//                             id="address"
//                             type="text"
//                             className="block w-full p-2 border border-gray-600 rounded-md focus:border-blue-500 focus:ring-blue-500 focus:outline-none bg-gray-800 text-white"
//                             value={address}
//                             onChange={(e) => setAddress(e.target.value)}
//                         />
//                     </div>
//
//                     {/* Address 2 */}
//                     <div className="col-span-2">
//                         <label className="block text-white font-semibold mb-2">Address 2</label>
//                         <input
//                             id="address2"
//                             type="text"
//                             className="block w-full p-2 border border-gray-600 rounded-md focus:border-blue-500 focus:ring-blue-500 focus:outline-none bg-gray-800 text-white"
//                             value={address2}
//                             onChange={(e) => setAddress2(e.target.value)}
//                         />
//                     </div>
//
//                     {/* City */}
//                     <div className="col-span-1">
//                         <label className="block text-white font-semibold mb-2">City</label>
//                         <input
//                             id="city"
//                             type="text"
//                             className="block w-full p-2 border border-gray-600 rounded-md focus:border-blue-500 focus:ring-blue-500 focus:outline-none bg-gray-800 text-white"
//                             value={city}
//                             onChange={(e) => setCity(e.target.value)}
//                         />
//                     </div>
//
//                     {/* State */}
//                     <div className="col-span-1">
//                         <label className="block text-white font-semibold mb-2">State</label>
//                         <SelectUSState
//                             id="state"
//                             className="block w-full border border-gray-600 rounded-md focus:border-blue-500 focus:ring-blue-500 focus:outline-none bg-gray-800 text-white"
//                             onChange={(val) => setState(val)} // Set selected state
//                             value={state} // Display selected state
//                         />
//                     </div>
//
//                     {/* Zip */}
//                     <div className="col-span-1">
//                         <label className="block text-white font-semibold mb-2">Zip</label>
//                         <input
//                             id="zip"
//                             type="text"
//                             className="block w-full p-2 border border-gray-600 rounded-md focus:border-blue-500 focus:ring-blue-500 focus:outline-none bg-gray-800 text-white"
//                             value={zip}
//                             onChange={(e) => setZip(e.target.value)}
//                         />
//                     </div>
//                 </form>
//             </div>
//
//             <button
//                 type="submit"
//                 onClick={handleSave}
//                 className="w-full bg-blue-800 hover:bg-blue-600 text-white font-bold py-3 rounded-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
//             >
//                 Save Changes
//             </button>
//         </>
//     );
// };
//
// export default ContactInfoPage;
//
