import { useState, useEffect, useRef } from "react";
import { db, auth } from "../firebaseConfig";
import { useParams } from "react-router-dom";
import { collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";

const ChatPage = () => {
  const { chatId } = useParams(); // Get chat ID from URL params
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null); // To auto-scroll to the bottom

  const currentUser = auth.currentUser;

  // Fetch messages for this chat in real-time
  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, `chats/${chatId}/messages`),
      orderBy("timestamp", "asc") // Orders messages by timestamp
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedMessages = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(fetchedMessages);
      setLoading(false);

      // Scroll to the bottom when new messages arrive
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    });

    // Clean up the listener
    return () => unsubscribe();
  }, [chatId, currentUser]);

  // Function to send a new message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return; // Prevent empty messages

    const messageData = {
      msg: newMessage,
      sender: currentUser.uid,
      timestamp: new Date(),
    };

    try {
      await addDoc(collection(db, `chats/${chatId}/messages`), messageData);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };

  if (loading) {
    return <p>Loading chat...</p>;
  }

  return (
    <div className="flex flex-col h-screen p-4">
      <div className="flex-grow overflow-y-auto">
        {messages.length > 0 ? (
          messages.map((message) => (
            <div
              key={message.id}
              className={`mb-2 p-2 rounded-lg max-w-xs ${
                message.sender === currentUser.uid ? "bg-blue-500 text-white ml-auto" : "bg-gray-200 text-black"
              }`}
            >
              <p>{message.msg}</p>
              <p className="text-xs mt-1 text-right text-gray-600">
                {new Date(message.timestamp?.toDate()).toLocaleTimeString()}
              </p>
            </div>
          ))
        ) : (
          <p>No messages yet</p>
        )}
        {/* Auto-scroll to bottom */}
        <div ref={bottomRef}></div>
      </div>

      {/* Message input */}
      <form onSubmit={sendMessage} className="flex">
        <input
          type="text"
          className="flex-grow p-2 border border-gray-300 rounded-l-lg"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          type="submit"
          className="p-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatPage;
