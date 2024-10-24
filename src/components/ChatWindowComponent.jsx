import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc, arrayUnion, onSnapshot, Timestamp } from 'firebase/firestore';
import { XMarkIcon } from "@heroicons/react/20/solid";
import { db } from "../firebaseConfig.js";

const ChatWindowComponent = ({ userId, hostDetails, eventId, eventTitle, eventImages, chatWindowOpen, toggleChatWindow }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [chatId, setChatId] = useState(null);

    const createChatId = (userId, hostId) => {
        return userId < hostId ? `${userId}_${hostId}_${eventId}` : `${hostId}_${userId}_${eventId}`;
    };

    const createOrFetchChat = async (hostId) => {
        const chatId = createChatId(userId, hostId);
        const chatRef = doc(db, 'chats', chatId);
        const chatDoc = await getDoc(chatRef);

        if (chatDoc.exists()) {
            setChatId(chatId);
            return chatId;
        } else {
            const newChatData = {
                event: { id: eventId, name: eventTitle, image: eventImages.length > 0 ? eventImages[0] : "" },
                participants: [userId, hostId],
                messages: [],
                sender: { id: userId, name: hostDetails.name },
                receiver: { id: hostId, name: hostDetails.name }
            };
            await setDoc(chatRef, newChatData);
            setChatId(chatId);
            return chatId;
        }
    };

    const fetchMessages = (chatId) => {
        const chatRef = doc(db, 'chats', chatId);
        return onSnapshot(chatRef, (doc) => {
            if (doc.exists()) {
                setMessages(doc.data().messages || []);
            }
        });
    };

    const sendMessage = async () => {
        if (newMessage.trim() === '') return;
        const chatRef = doc(db, 'chats', chatId);
        await updateDoc(chatRef, {
            messages: arrayUnion({
                senderId: userId,
                msg: newMessage,
                ts: Timestamp.now(),
            }),
        });
        setNewMessage('');
    };

    useEffect(() => {
        if (hostDetails && userId && chatWindowOpen) {
            const initChat = async () => {
                const chatId = await createOrFetchChat(hostDetails.id);
                fetchMessages(chatId);
            };
            initChat();
        }
    }, [chatWindowOpen, hostDetails, userId]);

    return chatWindowOpen ? (
        <div className="fixed bottom-0 right-0 w-96 h-96 bg-gray-800 shadow-lg p-4 rounded-t-lg">
            <div className="flex justify-between items-center mb-4">
                <h4 className="text-white font-semibold">Chat with {hostDetails.name}</h4>
                <button onClick={toggleChatWindow} className="text-white">
                    <XMarkIcon className="w-6 h-6" />
                </button>
            </div>
            <div className="chat-messages flex flex-col space-y-2 overflow-y-auto h-64 bg-gray-700 p-2 rounded-lg">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`p-2 rounded-lg ${msg.senderId === userId ? 'bg-blue-500 text-white self-end' : 'bg-gray-300 text-black self-start'}`}
                    >
                        {msg.msg}
                    </div>
                ))}
            </div>
            <input
                type="text"
                className="w-full mt-2 p-2 rounded-lg bg-gray-600 text-white"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />
        </div>
    ) : null;
};

export default ChatWindowComponent;
