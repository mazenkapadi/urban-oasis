import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  arrayUnion,
  Timestamp,
} from "firebase/firestore";
import { db, auth } from "../firebaseConfig"; // Assuming firebase is already integrated

const HostChatList = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState(""); // State for the input field

  useEffect(() => {
    const fetchChats = async () => {
      const user = auth.currentUser; // Get the logged-in user
      if (user) {
        const q = query(
          collection(db, "chats"),
          where("hostId", "==", user.uid)
        ); // Fetch chats where the user is the logged-in user
        const querySnapshot = await getDocs(q);
        const chatData = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })); // Add document ID to chat data
        setChats(chatData);
      }
    };
    fetchChats();
  }, []);

  const selectChat = (chat) => {
    setSelectedChat(chat);
    setMessages(chat.messages);
  };

  const sendMessage = async () => {
    if (newMessage.trim() === "" || !selectedChat) return; // Prevent empty messages or sending without a chat selected

    const messageData = {
      msg: newMessage,
      sender: auth.currentUser.uid,
      timestamp: Timestamp.now(),
    };

    // Update Firestore
    try {
      const chatRef = doc(db, "chats", selectedChat.id);
      await updateDoc(chatRef, {
        messages: arrayUnion(messageData), // Add the new message to the messages array
      });

      // Update UI
      setMessages((prevMessages) => [...prevMessages, messageData]);
      setNewMessage(""); // Clear the input field after sending
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };

  return (
    <div className="h-screen flex">
      {/* Left Sidebar */}
      <div className="w-1/3 border-r p-4">
        <div className="text-lg font-semibold mb-4">Chats</div>
        {chats.map((chat) => (
          <div
            key={chat.event.id}
            onClick={() => selectChat(chat)}
            className={`flex items-center p-3 cursor-pointer mb-2 rounded-lg transition ${
              selectedChat?.event.id === chat.event.id ? "bg-detail-gray" : ""
            }`}
          >
            <img
              src={chat.event.image}
              alt={chat.event.name}
              className="w-12 h-12 rounded-full mr-3"
            />
            <div className="flex-grow">
              <div className="font-medium">{chat.event.name}</div>
              <div className="font-medium">{chat.user.name}</div>
              <div className="text-sm text-gray-600 truncate">
                {chat.messages.length > 0
                  ? chat.messages[chat.messages.length - 1].msg
                  : "No messages yet"}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Right Chat Area */}
      <div className="w-2/3 p-4 flex flex-col">
        {selectedChat ? (
          <>
            {/* Header */}
            <div className="flex items-center border-b border-gray-300 pb-3 mb-4">
              <img
                src={selectedChat.event.image}
                alt={selectedChat.event.name}
                className="w-12 h-12 rounded-full mr-3"
              />
              <div>
                <div className="font-medium">{selectedChat.event.name}</div>
                <div className="font-medium">{selectedChat.user.name}</div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-grow overflow-y-auto mb-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-2 p-2 max-w-xs rounded-lg ${
                    msg.sender === auth.currentUser.uid
                      ? "bg-blue-500 text-white self-end"
                      : "bg-gray-200 text-black self-start"
                  }`}
                >
                  {msg.msg}
                </div>
              ))}
            </div>

            {/* Input Box */}
            <div className="flex items-center border-t border-gray-300 pt-2">
              <input
                type="text"
                placeholder="Type a message"
                value={newMessage} // Bind the input value to state
                onChange={(e) => setNewMessage(e.target.value)} // Update state on change
                className="flex-grow p-2 border border-gray-300 rounded-lg outline-none bg-black"
              />
              <button
                onClick={sendMessage} // Call the sendMessage function
                className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
              >
                Send
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
