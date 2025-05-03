import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import getRandomProfile from '../components/random_img';
import { useWebSocket } from '../context/webSocketContext';
import axios from '../axios';
import { useNavigate } from 'react-router-dom';

function MessageWindow({ recipient }) {
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const messagesEndRef = useRef(null);
  
  const { isConnected, sendMessage, messages: globalMessages, error } = useWebSocket();
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      if (!userData) {
        navigate('/Login');
        return;
      }
      setUser(userData);
      setUserId(userData.id);
    } catch (e) {
      console.error('Failed to parse user data:', e);
      navigate('/Login');
    }
  }, [navigate]);

  const getMessages = useCallback(async () => {
    if (!recipient || !userId) return;
    
    setLoading(true);
    try {
      const res = await axios.post('/getMessages', {
        senderId: userId,
        receiverId: recipient.friendId,
      });
      setMessages(res.data.messages);
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  }, [recipient, userId]);

  useEffect(() => {
    getMessages();
  }, [getMessages]);

  const filteredGlobalMessages = useMemo(() => {
    if (!recipient || !userId) return [];
    
    return globalMessages.filter(
      msg =>
        (msg.sender === recipient.friendId && msg.to === userId) ||
        (msg.sender === userId && msg.to === recipient.friendId)
    );
  }, [globalMessages, recipient, userId]);

  useEffect(() => {
    if (filteredGlobalMessages.length === 0) return;

    const messageMap = new Map();
    
    messages.forEach(msg => {
      const key = `${msg.timestamp}-${msg.messageText}`;
      messageMap.set(key, msg);
    });

    filteredGlobalMessages.forEach(msg => {
      const key = `${msg.timestamp}-${msg.messageText}`;
      messageMap.set(key, msg);
    });

    const uniqueSorted = Array.from(messageMap.values())
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    setMessages(uniqueSorted);
  }, [filteredGlobalMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!messageText.trim() || !isConnected || !recipient || !userId) return;

    const newMessage = {
      sender: userId,
      to: recipient.friendId,
      messageText: messageText,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, newMessage]);
    setMessageText('');

    try {
      await sendMessage({
        recipientId: recipient.friendId,
        text: messageText,
      });
    } catch (error) {
      console.error('Failed to send message:', error);
      setMessages(prev => prev.filter(m => m.timestamp !== newMessage.timestamp));
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

  if (!user) {
    return (
      <div className="h-full bg-[#000000] w-full flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading user data...</p>
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
        {loading ? (
          <div className="flex justify-center">
            <p className="text-gray-500">Loading messages...</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={`${msg.timestamp}-${idx}`}
              className={`max-w-xs p-3 rounded-lg text-white ${
                msg.sender === userId ? 'bg-blue-600 self-end' : 'bg-gray-700 self-start'
              }`}
            >
              {msg.messageText}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {error && (
        <div className="bg-red-900 text-white p-2 text-center">
          Connection error: {error}
        </div>
      )}

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