import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

// Create a context for the socket
const SocketContext = createContext();

// Create a provider component
export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Replace 'http://localhost:4000' with your server URL
    const newSocket = io(process.env.REACT_APP_API_URL, { transports: ['websocket'] });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

// Create a custom hook to use the socket context
export const useSocket = () => {
  return useContext(SocketContext);
};
