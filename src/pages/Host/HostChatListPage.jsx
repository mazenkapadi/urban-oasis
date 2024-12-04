import { useState, useEffect, useRef } from "react";
import {
    collection,
    query,
    where,
    onSnapshot,
    doc,
    updateDoc,
    arrayUnion,
    Timestamp,
    getDoc,
} from "firebase/firestore";
import { db, auth } from "../../firebaseConfig.js";
import { onAuthStateChanged } from "firebase/auth";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline/index.js";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import themeManager from "../../utils/themeManager.jsx";

const HostChatList = () => {
    const [ chats, setChats ] = useState([]);
    const [ selectedChat, setSelectedChat ] = useState(null);
    const [ messages, setMessages ] = useState([]);
    const [ newMessage, setNewMessage ] = useState("");
    const [ userId, setUserId ] = useState(null);
    const [ user, setUser ] = useState({});
    const messagesEndRef = useRef(null);
    const [ darkMode, setDarkMode ] = useState(themeManager.isDarkMode);

    useEffect(() => {
        const handleThemeChange = (isDark) => setDarkMode(isDark);
        themeManager.addListener(handleThemeChange);

        return () => {
            themeManager.removeListener(handleThemeChange);
        };
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
            } else {
                console.log("No user logged in");
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        fetchUserData();
    }, [ userId ]);

    useEffect(() => {
        // const user = auth.currentUser;
        if (user) {
            const q = query(
                collection(db, "chats"),
                where("participants", "array-contains", userId)
            );

            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const chatData = querySnapshot.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id,
                }));
                setChats(chatData);
            });

            return () => unsubscribe();
        }
    }, [ userId ]);

    const fetchUserData = async () => {
        if (userId) {
            try {
                const docRef = doc(db, "Users", userId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    //   console.log("User data:", data);
                    setUser(user);
                } else {
                    console.log("No such document!");
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        }
    };

    const selectChat = (chat) => {
        // console.log(chat.sender.id == userId);

        setSelectedChat(chat);
    };
    useEffect(() => {
        if (selectedChat) {
            const chatRef = doc(db, "chats", selectedChat.id);
            const unsubscribe = onSnapshot(chatRef, (doc) => {
                if (doc.exists()) {
                    setMessages(doc.data().messages || []);
                }
            });
            return () => unsubscribe();
        }
    }, [ selectedChat ]);

    const sendMessage = async () => {
        if (newMessage.trim() === "" || !selectedChat) return;

        try {
            const chatRef = doc(db, "chats", selectedChat.id);

            await updateDoc(chatRef, {
                messages: arrayUnion({
                    senderId: userId,
                    msg: newMessage,
                    ts: Timestamp.now(),
                }),
            });
            setNewMessage("");
        } catch (error) {
            console.error("Error sending message: ", error);
        }
    };

    const navigate = useNavigate();

    const handleEventNavigate = () => {
        // console.log(selectedChat.event.id);
        navigate(`/eventPage/${selectedChat.event.id}`);
    }

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({behavior: "smooth"});
        }
    }, [ messages ]);

    return (
        <div className="h-screen flex" >
            {/* Left Sidebar */}
            <div className={`w-1/3 border-r p-4 ${darkMode ? "border-Light-L2" : "border-Dark-D2"}`} >
                <div className={`text-lg font-semibold mb-4 ${darkMode ? "text-primary-light" : "text-primary-dark"}`} >Chats</div >
                {chats.map((chat) => (
                    <div
                        key={chat.id}
                        onClick={() => selectChat(chat)}
                        className={`flex items-center p-3 cursor-pointer mb-2 rounded-lg transition ${
                            selectedChat?.id === chat.id ? "bg-detail-gray" : ""
                        }`}
                    >
                        <img
                            src={
                                chat.sender.id === userId
                                    ? chat.receiver.profilePicture
                                    : chat.sender.profilePicture
                            }
                            alt={
                                chat.sender.id === userId ? chat.receiver.name : chat.sender.name
                            }
                            className="w-12 h-12 rounded-full mr-3"
                        />

                        <div className="flex-grow" >
                            <div className={`font-medium ${darkMode ? "text-primary-light" : "text-primary-dark"}`} >{chat.event.name}</div >
                            <div className={`font-medium ${darkMode ? "text-primary-light" : "text-primary-dark"}`} >
                                {chat.sender.id === userId
                                    ? chat.receiver.name
                                    : chat.sender.name}
                            </div >
                            <div className="text-sm text-gray-600 truncate" >
                                {chat.messages.length > 0
                                    ? chat.messages[chat.messages.length - 1].msg
                                    : "No messages yet"}
                            </div >
                        </div >
                    </div >
                ))}
            </div >

            <div className="w-2/3 p-4 flex flex-col" >
                {selectedChat ? (
                    <>
                        <div className={`${darkMode ? "border-Light-L2" : "border-Dark-D2"} flex items-center border-b pb-3 mb-4`} >
                            <img
                                src={selectedChat.event.image.url}
                                alt={selectedChat.event.name}
                                className="w-12 h-12 rounded-full mr-3"
                            />
                            <div >
                                <div className={`font-medium cursor-pointer ${darkMode ? "text-primary-light" : "text-primary-dark"}`} onClick={handleEventNavigate}>{selectedChat.event.name}</div >
                                <div className={`font-medium ${darkMode ? "text-primary-light" : "text-primary-dark"}`} >
                                    {selectedChat.sender.id === userId
                                        ? selectedChat.receiver.name
                                        : selectedChat.sender.name}
                                </div >
                            </div >
                        </div >

                        <div className="flex-grow overflow-y-auto mb-4" >
                            {messages.map((msg, index) => (
                                <div key={index} className="mb-2" >
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
                                            <p className="text-sm font-inter" >{msg.msg}</p >
                                            <p className="text-xs text-right opacity-75 mt-1" >
                                                {format(msg.ts.toDate(), "p")}
                                            </p >
                                        </div >
                                    </div >
                                </div >
                            ))}
                            <div ref={messagesEndRef} />
                        </div >

                        {/* Input Box */}
                        <div className={`flex items-center border-t pt-2 ${darkMode ? "border-Light-L2" : "border-Dark-D2"}`} >
                            <input
                                type="text"
                                placeholder="Type a message"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                className={`flex-grow p-2 border ${darkMode ? "border-Light-L2 text-primary-light bg-Dark-D1" : "border-Dark-D2 text-primary-dark bg-Light-L1"} rounded-lg outline-none`}
                            />
                            <button
                                onClick={sendMessage}
                                className={`ml-2 px-4 py-2 bg-accent-blue ${darkMode ? "text-primary-dark" : "text-primary-dark"} rounded-lg`}
                            >
                                <PaperAirplaneIcon className="h-6 w-6" />
                            </button >
                        </div >
                    </>
                ) : (
                    <div className="text-center text-gray-500" >
                        Select a chat to start messaging.
                    </div >
                )}
            </div >
        </div >
    );
};

export default HostChatList;
