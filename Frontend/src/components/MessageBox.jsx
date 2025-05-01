import { useState, useEffect } from 'react';
import { useWebSocket } from '../context/webSocketContext';

function MessageBox() {
  const [messageText, setMessageText] = useState('');
  const { isConnected, sendMessage } = useWebSocket();

  const handleSendMessage = () => {
    if (messageText.trim() && isConnected) {
      sendMessage({
        recipientId:'68132669f73cbb81f4a95291',
        text: messageText
      });
      setMessageText('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
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
  );
}

export default MessageBox;