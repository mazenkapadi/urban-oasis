import { doc, setDoc, deleteDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";

export const getBookmarkStatus = async (userId, eventId) => {
    const bookmarkId = `${userId}_${eventId}`;
    const bookmarkRef = doc(db, "Bookmarks", bookmarkId);

    try {
        const bookmarkSnap = await getDoc(bookmarkRef);
        return bookmarkSnap.exists();
    } catch (error) {
        console.error("Error checking bookmark status:", error);
        return false;
    }
};


export const toggleBookmark = async (userId, event) => {
    const eventId = event.objectID || event.eventId || event.id;
    if (!eventId) {
        console.error("Error: eventId is undefined");
        return null;
    }
    const bookmarkId = `${userId}_${eventId}`;
    const bookmarkRef = doc(db, "Bookmarks", bookmarkId);

    try {
        const bookmarkSnap = await getDoc(bookmarkRef);
        if (bookmarkSnap.exists()) {
            await deleteDoc(bookmarkRef);
            return false;
        } else {
            const eventTitle = event.basicInfo?.title || event.eventTitle || 'Untitled Event';
            const eventDateTime = event.eventDetails?.eventDateTime || event.eventDateTime || null;
            const eventLocation = event.basicInfo?.location?.label || event.eventLocation || 'Location not specified';

            await setDoc(bookmarkRef, {
                bookmarkId,
                userId,
                eventId,
                eventTitle,
                eventDateTime,
                eventLocation,
                bookmarkedAt: serverTimestamp(),
            });
            return true;
        }
    } catch (error) {
        console.error("Error toggling bookmark:", error);
        return null;
    }
};
