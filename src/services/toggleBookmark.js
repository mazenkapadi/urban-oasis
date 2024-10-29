import { doc, setDoc, deleteDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";

export const toggleBookmark = async (userId, event) => {
    const bookmarkId = `${userId}_${event.id}`; // Unique ID based on user and event
    const bookmarkRef = doc(db, "Bookmarks", bookmarkId);

    try {
        const bookmarkSnap = await getDoc(bookmarkRef);
        if (bookmarkSnap.exists()) {
            await deleteDoc(bookmarkRef);
            return false;
        } else {
            await setDoc(bookmarkRef, {
                bookmarkId,
                userId,
                eventId: event.id,
                eventTitle: event.basicInfo.title,
                eventDateTime: event.eventDetails.eventDateTime,
                eventLocation: event.basicInfo.location.label,
                bookmarkedAt: serverTimestamp(),
            });
            return true;
        }
    } catch (error) {
        console.error("Error toggling bookmark:", error);
    }
};
