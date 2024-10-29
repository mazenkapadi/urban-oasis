//
// import React, { useEffect, useState } from 'react';
// import { useNavigate } from "react-router-dom";
// import { collection, getDocs, query, where } from "firebase/firestore";
// import { db, auth } from "../../firebaseConfig.js";
// import BookmarkEventCard from "../EventCards/BookmarkEventCard.jsx";
//
// const ExploreManage = () => {
//     const navigate = useNavigate();
//     const [ bookmarkedEvents, setBookmarkedEvents ] = useState([]);
//
//     useEffect(() => {
//         const fetchBookmarkedEvents = async () => {
//             const user = auth.currentUser;
//             if (user) {
//                 const userId = user.uid;
//                 try {
//                     const bookmarksRef = collection(db, "Bookmarks");
//                     const q = query(bookmarksRef, where("userId", "==", userId));
//                     const querySnapshot = await getDocs(q);
//                     const bookmarkedEventsData = querySnapshot.docs.map((doc) => ({
//                         id: doc.id,
//                         ...doc.data(),
//                     }));
//                     setBookmarkedEvents(bookmarkedEventsData);
//                 } catch (error) {
//                     console.error("Error fetching bookmarked events: ", error);
//                 }
//             }
//         };
//
//         auth.onAuthStateChanged((user) => {
//             if (user) {
//                 fetchBookmarkedEvents();
//             }
//         });
//     }, []);
//
//     return (
//         <div className="mt-12" >
//             <h2 className="text-2xl font-bold text-white mb-4" >Explore & Manage</h2 >
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[500px]" >
//
//                 {/* First Column - Stacked items */}
//                 <div className="grid grid-rows-2 gap-6 lg:col-span-1 h-full" >
//                     <div
//                         className="bg-gray-800 shadow-md rounded-lg p-6 text-center flex flex-col justify-center h-full" >
//                         <h3 className="text-lg font-semibold text-white mb-2" >My Event History</h3 >
//                         <p className="text-gray-400" >View all the events you've attended.</p >
//                         <button
//                             className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-800 transition"
//                             onClick={() => navigate('/userProfilePage/my-event-history')}
//                         >
//                             View History
//                         </button >
//                     </div >
//
//                     <div
//                         className="bg-gray-800 shadow-md rounded-lg p-6 text-center flex flex-col justify-center h-full" >
//                         <h3 className="text-lg font-semibold text-white mb-2" >Manage RSVPs</h3 >
//                         <p className="text-gray-400" >Modify or cancel your upcoming RSVPs.</p >
//                         <button
//                             className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-800 transition"
//                             onClick={() => navigate('/userProfilePage/manage-rsvps')}
//                         >
//                             Manage RSVPs
//                         </button >
//                     </div >
//                 </div >
//
//                 {/*<div*/}
//                 {/*    className="bg-gray-800 shadow-md rounded-lg p-6 text-center lg:col-span-2 lg:row-span-2 flex flex-col items-start" >*/}
//                 {/*    <h3 className="text-lg font-semibold text-white mb-2" >Bookmarked Events</h3 >*/}
//                 {/*    <p className="text-gray-400 mb-4" >These are events you have bookmarked.</p >*/}
//                 {/*    <div className="flex flex-col gap-4 w-full" >*/}
//                 {/*        {bookmarkedEvents.length > 0 ? (*/}
//                 {/*            bookmarkedEvents.map((event) => (*/}
//                 {/*                <BookmarkEventCard key={event.id} event={event} />*/}
//                 {/*            ))*/}
//                 {/*        ) : (*/}
//                 {/*            <p className="text-gray-400 text-center" >No bookmarked events</p >*/}
//                 {/*        )}*/}
//                 {/*    </div >*/}
//                 {/*</div >*/}
//
//                 <div
//                     className="bg-gray-800 shadow-md rounded-lg p-6 text-center lg:col-span-2 lg:row-span-2 flex flex-col items-start" >
//                     <h3 className="text-lg font-semibold text-white mb-2" >Bookmarked Events</h3 >
//                     <p className="text-gray-400 mb-4" >These are events you have bookmarked.</p >
//                     <div
//                         className="flex flex-col gap-4 w-full h-[400px] overflow-y-auto" > {/* Fixed height and scrollable */}
//                         {bookmarkedEvents.length > 0 ? (
//                             bookmarkedEvents.map((event) => (
//                                 <BookmarkEventCard key={event.id} event={event} />
//                             ))
//                         ) : (
//                             <p className="text-gray-400 text-center" >No bookmarked events</p >
//                         )}
//                     </div >
//                 </div >
//
//             </div >
//         </div >
//     );
// };
//
// export default ExploreManage;

import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where, doc, deleteDoc } from "firebase/firestore";
import { db, auth } from "../../firebaseConfig.js";
import BookmarkEventCard from "../EventCards/BookmarkEventCard.jsx";

const ExploreManage = () => {
    const navigate = useNavigate();
    const [bookmarkedEvents, setBookmarkedEvents] = useState([]);

    useEffect(() => {
        const fetchBookmarkedEvents = async () => {
            const user = auth.currentUser;
            if (user) {
                try {
                    const userId = user.uid;
                    const bookmarksRef = collection(db, "Bookmarks");
                    const q = query(bookmarksRef, where("userId", "==", userId));
                    const querySnapshot = await getDocs(q);
                    const bookmarkedEventsData = querySnapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }));
                    setBookmarkedEvents(bookmarkedEventsData);
                } catch (error) {
                    console.error("Error fetching bookmarked events:", error);
                }
            }
        };

        auth.onAuthStateChanged((user) => {
            if (user) {
                fetchBookmarkedEvents();
            }
        });
    }, []);

    const handleBookmarkRemoved = async (eventId) => {
        const user = auth.currentUser;
        if (user) {
            const bookmarkRef = doc(db, "Bookmarks", `${user.uid}_${eventId}`);
            await deleteDoc(bookmarkRef);
            setBookmarkedEvents((prevEvents) =>
                prevEvents.filter((event) => event.id !== eventId)
            );
        }
    };

    return (
        <div className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-4">Explore & Manage</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[500px] overflow-y-auto">
                {/* First Column - Stacked items */}
                <div className="grid grid-rows-2 gap-6 lg:col-span-1 h-full">
                    <div className="bg-gray-800 shadow-md rounded-lg p-6 text-center flex flex-col justify-center h-full">
                        <h3 className="text-lg font-semibold text-white mb-2">My Event History</h3>
                        <p className="text-gray-400">View all the events you've attended.</p>
                        <button
                            className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-800 transition"
                            onClick={() => navigate('/userProfilePage/my-event-history')}
                        >
                            View History
                        </button>
                    </div>

                    <div className="bg-gray-800 shadow-md rounded-lg p-6 text-center flex flex-col justify-center h-full">
                        <h3 className="text-lg font-semibold text-white mb-2">Manage RSVPs</h3>
                        <p className="text-gray-400">Modify or cancel your upcoming RSVPs.</p>
                        <button
                            className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-800 transition"
                            onClick={() => navigate('/userProfilePage/manage-rsvps')}
                        >
                            Manage RSVPs
                        </button>
                    </div>
                </div>

                {/* Second Column - Bookmarked Events */}
                <div className="bg-gray-800 shadow-md rounded-lg p-6 text-center lg:col-span-2 lg:row-span-2 flex flex-col items-start">
                    <h3 className="text-lg font-semibold text-white mb-2">Bookmarked Events</h3>
                    <p className="text-gray-400 mb-4">These are events you have bookmarked.</p>
                    <div className="flex flex-col gap-4 w-full h-[400px] overflow-y-auto">
                        {bookmarkedEvents.length > 0 ? (
                            bookmarkedEvents.map((event) => (
                                <BookmarkEventCard
                                    key={event.id}
                                    event={event}
                                    onBookmarkRemoved={handleBookmarkRemoved}
                                />
                            ))
                        ) : (
                            <p className="text-gray-400 text-center">No bookmarked events</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExploreManage;
