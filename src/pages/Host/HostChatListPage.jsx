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

const HostChatList = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState({});
  const messagesEndRef = useRef(null);

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
  }, [userId]);

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
  }, [userId]);

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
  }, [selectedChat]);

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

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="h-screen flex">
      {/* Left Sidebar */}
      <div className="w-1/3 border-r p-4">
        <div className="text-lg font-semibold mb-4">Chats</div>
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
                chat.sender.id == userId
                  ? chat.receiver.profilePicture
                  : chat.sender.profilePicture
              }
              alt={
                chat.sender.id == userId ? chat.receiver.name : chat.sender.name
              }
              className="w-12 h-12 rounded-full mr-3"
            />

            <div className="flex-grow">
              <div className="font-medium">{chat.event.name}</div>
              <div className="font-medium">
                {chat.sender.id === userId
                  ? chat.receiver.name
                  : chat.sender.name}
              </div>
              <div className="text-sm text-gray-600 truncate">
                {chat.messages.length > 0
                  ? chat.messages[chat.messages.length - 1].msg
                  : "No messages yet"}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="w-2/3 p-4 flex flex-col">
        {selectedChat ? (
          <>
            <div className="flex items-center border-b border-gray-300 pb-3 mb-4">
              <img
                src={selectedChat.event.image.url}
                alt={selectedChat.event.name}
                className="w-12 h-12 rounded-full mr-3"
              />
              <div>
                <div className="font-medium">{selectedChat.event.name}</div>
                <div className="font-medium">
                  {selectedChat.sender.id === userId
                    ? selectedChat.receiver.name
                    : selectedChat.sender.name}
                </div>
              </div>
            </div>

            <div className="flex-grow overflow-y-auto mb-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-2 p-2 w-fit rounded-lg ${
                    msg.senderId === auth.currentUser.uid
                      ? "bg-blue-500 text-white self-end"
                      : "bg-gray-200 text-black self-start"
                  }`}
                >
                  {msg.msg}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Box */}
            <div className="flex items-center border-t border-gray-300 pt-2">
              <input
                type="text"
                placeholder="Type a message"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-grow p-2 border border-gray-300 rounded-lg outline-none bg-black"
              />
              <button
                onClick={sendMessage}
                className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
              >
                <PaperAirplaneIcon className="h-6 w-6" />
              </button>
            </div>
          </>
        ) : (
          <div className="text-center text-gray-500">
            Select a chat to start messaging.
          </div>
        )}
      </div>
    </div>
  );
};

export default HostChatList;
