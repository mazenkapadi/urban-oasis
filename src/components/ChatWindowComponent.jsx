import { useEffect, useState, useRef } from "react";
import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    arrayUnion,
    onSnapshot,
    Timestamp,
} from "firebase/firestore";
import { XMarkIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { auth,db } from "../firebaseConfig.js";
import { format } from "date-fns";
import { onAuthStateChanged } from "firebase/auth";


const ChatWindowComponent = ({
                                 userId,
                                 hostDetails,
                                 eventId,
                                 eventTitle,
                                 eventImages,
                                 chatWindowOpen,
                                 toggleChatWindow,
                             }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [chatId, setChatId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const messagesEndRef = useRef(null);
    const [ senderName, setSenderName] = useState('');
    const [ senderProfile, setSenderProfile] = useState('');

    

    const createChatId = (userId, hostId) => {
        return userId < hostId
            ? `${userId}_${hostId}_${eventId}`
            : `${hostId}_${userId}_${eventId}`;
    };

    const createOrFetchChat = async (hostId) => {
        const chatId = createChatId(userId, hostId);
        const chatRef = doc(db, "chats", chatId);
        const chatDoc = await getDoc(chatRef);

        if (chatDoc.exists()) {
            setChatId(chatId);
            return chatId;
        } else {
            const newChatData = {
                event: {
                    id: eventId,
                    name: eventTitle,
                    image: eventImages.length > 0 ? eventImages[0] : "",
                },
                participants: [userId, hostId],
                messages: [],
                sender: { id: userId, name: senderName,profilePicture:senderProfile },
                receiver: { id: hostId, name: hostDetails.name, profilePicture: hostDetails.profilePicture},
            };
            await setDoc(chatRef, newChatData);
            setChatId(chatId);
            return chatId;
        }
    };

    const fetchMessages = (chatId) => {
        const chatRef = doc(db, "chats", chatId);
        return onSnapshot(chatRef, (doc) => {
            if (doc.exists()) {
                setMessages(doc.data().messages || []);
                setIsLoading(false);
                scrollToBottom();
            }
        });
    };

    const sendMessage = async () => {
        if (newMessage.trim() === "") return;
        const chatRef = doc(db, "chats", chatId);
        try {
            await updateDoc(chatRef, {
                messages: arrayUnion({
                    senderId: userId,
                    msg: newMessage,
                    ts: Timestamp.now(),
                }),
            });
            setNewMessage("");
            scrollToBottom();
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user && userId) {
                try {
                    const senderRef = doc(db, 'Users', userId); // Adjust 'users' collection if needed
                    const senderSnap = await getDoc(senderRef);
                    if (senderSnap.exists()) {
                        const senderData = senderSnap.data();
                        setSenderName(`${senderData.firstName} ${senderData.lastName}`);
                        setSenderProfile(senderData.profilePicture);
                    } else {
                        console.log('No such user!');
                    }
                } catch (error) {
                    console.error('Error fetching sender details:', error);
                }
            } else {
                console.log('No user logged in or invalid userId');
            }
        });

        return () => unsubscribe();
    }, [userId]);

    useEffect(() => {
        if (hostDetails && userId && chatWindowOpen) {
            const initChat = async () => {
                const chatId = await createOrFetchChat(hostDetails.id);
                fetchMessages(chatId);
            };
            initChat();
        }
    }, [chatWindowOpen, hostDetails, userId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);


    return chatWindowOpen ? (
        <div className="fixed bottom-0 right-5 w-80 md:w-96 h-96 bg-primary-light dark:bg-primary-dark shadow-lg rounded-t-lg flex flex-col">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-3 bg-accent-blue rounded-t-lg">
                <div className="flex items-center space-x-2">
                    <img
                        src={hostDetails.profilePicture || "/default-avatar.png"}
                        alt="Host Avatar"
                        className="w-8 h-8 rounded-full"
                    />
                    <h4 className="text-white font-semibold font-roboto">
                        {hostDetails.companyName || hostDetails.name}
                    </h4>
                </div>
                <button
                    onClick={toggleChatWindow}
                    className="text-white hover:text-Light-L2"
                >
                    <XMarkIcon className="w-5 h-5" />
                </button>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 bg-Light-L2 dark:bg-Dark-D2">
                {isLoading ? (
                    <div className="text-center text-gray-500">Loading messages...</div>
                ) : (
                    messages.map((msg, index) => (
                        <div key={index} className="mb-2">
                            <div
                                className={`flex ${
                                    msg.senderId === userId ? "justify-end" : "justify-start"
                                }`}
                            >
                                <div
                                    className={`max-w-xs px-4 py-2 rounded-lg ${
                                        msg.senderId === userId
                                            ? "bg-gradient-to-r from-accent-blue to-blue-500 text-white rounded-br-none"
                                            : "bg-gradient-to-r from-Light-L3 to-Light-L2 dark:from-Dark-D1 dark:to-Dark-D2 text-black dark:text-white rounded-bl-none"
                                    }`}
                                >
                                    <p className="text-sm font-inter">{msg.msg}</p>
                                    <p className="text-xs text-right opacity-75 mt-1">
                                        {format(msg.ts.toDate(), "p")}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-2 bg-Light-L2 dark:bg-Dark-D2">
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        className="flex-1 px-4 py-2 rounded-full bg-primary-light dark:bg-primary-dark border border-Light-L1 dark:border-Dark-D2 focus:outline-none text-black dark:text-white font-inter"
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === "Return") {
                                e.preventDefault();
                                sendMessage();
                            }
                        }}
                    />
                    <button
                        onClick={sendMessage}
                        className="text-accent-blue hover:text-accent-purple transform"
                    >
                        <PaperAirplaneIcon className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </div>
    ) : null;
};

export default ChatWindowComponent;
