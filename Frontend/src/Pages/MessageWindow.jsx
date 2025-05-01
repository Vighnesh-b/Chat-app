import { useState, useEffect } from 'react';
import getRandomProfile from '../components/random_img';
import { useWebSocket } from '../context/webSocketContext';
import axios from '../axios';

function MessageWindow({ recipient }) {
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState([]);
  const { isConnected, sendMessage } = useWebSocket();
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user.id;

  useEffect(() => {
    if (recipient) {
      getMessages();
    }
  }, [recipient]);

  const handleSendMessage = () => {
    if (messageText.trim() && isConnected && recipient) {
      const newMessage = {
        sender: userId,
        messageText: messageText,
        timestamp: new Date(),
      };
      sendMessage({
        recipientId: recipient.friendId,
        text: messageText,
      });
      setMessageText('');
      setMessages((prev) => [...prev, newMessage]);
    }
  };

  const getMessages = async () => {
    try {
      const res = await axios.post('/getMessages', {
        senderId: userId,
        receiverId: recipient.friendId,
      });
      setMessages(res.data.messages); 
      console.log(res.data);
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!recipient) {
    return (
      <div className="h-full bg-[#000000] w-full flex items-center justify-center">
        <p className="text-gray-500 text-lg">Select a friend to start chatting</p>
      </div>
    );
  }

  return (
    <div className="h-full bg-[#000000] w-full flex flex-col">
      <div className="bg-gray-900 w-full p-5">
        <div className="flex items-center gap-4">
          <img
            src={getRandomProfile()}
            alt="User Profile"
            className="w-10 h-10 rounded-full object-cover"
          />
          <p className="text-white font-bold text-lg">{recipient.friendName}</p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 flex flex-col space-y-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-xs p-3 rounded-lg text-white ${
              msg.sender === userId ? 'bg-blue-600 self-end' : 'bg-gray-700 self-start'
            }`}
          >
            {msg.messageText} {/* Render the messageText */}
          </div>
        ))}
      </div>
      <div className="bg-black w-full p-4 flex items-center gap-2">
        <input
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyDown={handleKeyPress}
          className="flex-1 bg-gray-700 text-white placeholder-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
          placeholder={isConnected ? "Type a message" : "Connecting..."}
          disabled={!isConnected}
        />
        <button
          onClick={handleSendMessage}
          disabled={!messageText.trim() || !isConnected}
          className={`px-4 py-2 rounded-full font-semibold transition duration-200 ${
            !messageText.trim() || !isConnected
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default MessageWindow;
