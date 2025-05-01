// src/context/webSocketContext.js
import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';

const WebSocketContext = createContext(null);
export const WebSocketProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const ws = useRef(null);
  const reconnectTimer = useRef(null);

  const cleanup = useCallback(() => {
    if (ws.current) {
      ws.current.onopen = null;
      ws.current.onclose = null;
      ws.current.onerror = null;
      ws.current.onmessage = null;
      if (ws.current.readyState === WebSocket.OPEN) {
        ws.current.close();
      }
    }
    if (reconnectTimer.current) {
      clearTimeout(reconnectTimer.current);
    }
  }, []);

  const connectWebSocket = useCallback(() => {
    cleanup();

    ws.current = new WebSocket('ws://localhost:3000');

    ws.current.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      
      const token = localStorage.getItem('accesstoken');
      const user=JSON.parse(localStorage.getItem('user'));

      if (token && user.id) {
        ws.current.send(JSON.stringify({
          type: 'register',
          userId:user.id
        }));
      }
    };

    ws.current.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        setMessages(prev => [...prev, message]);
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };

    ws.current.onclose = () => {
      setIsConnected(false);
      const delay = Math.min(5000, 1000 * Math.pow(2, 5)); 
      reconnectTimer.current = setTimeout(connectWebSocket, delay);
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }, [cleanup]);

  const sendMessage = useCallback((messageData) => {
    const user=JSON.parse(localStorage.getItem('user'));

    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({
        type: 'chat',
        from: user.id,
        to: messageData.recipientId,
        messageText: messageData.text
      }));
    } else {
      console.error('Cannot send message - WebSocket not connected');
    }
  }, []);

  useEffect(() => {
    connectWebSocket();
    return () => {
      cleanup();
    };
  }, [connectWebSocket, cleanup]);

  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem('accesstoken');
      const user=JSON.parse(localStorage.getItem('user'));
      
      if (token && user.id && ws.current?.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify({
          type: 'register',
          userId:user.id,
        }));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const value = {
    isConnected,
    messages,
    sendMessage
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};