// import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
// import { io, Socket } from 'socket.io-client';

// interface SocketContextType {
//   socket: Socket | null;
//   isConnected: boolean;
//   connect: () => void;
//   disconnect: () => void;
// }

// const SocketContext = createContext<SocketContextType>({
//   socket: null,
//   isConnected: false,
//   connect: () => {},
//   disconnect: () => {}
// });

// interface SocketProviderProps {
//   children: ReactNode;
// }

// export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
//   const [socket, setSocket] = useState<Socket | null>(null);
//   const [isConnected, setIsConnected] = useState(false);

//   const connect = () => {
//     const token = localStorage.getItem('token');
//     if (!token) return;

//     if (!socket) {
//       console.log("Creating new socket connection...");
//       const newSocket = io('http://localhost:5000', { transports: ['websocket'] });
      
//       newSocket.on('connect', () => {
//         console.log('Socket connected:', newSocket.id);
//         setIsConnected(true);
//       });

//       newSocket.on('disconnect', () => {
//         console.log('Socket disconnected');
//         setIsConnected(false);
//       });

//       newSocket.on('connect_error', (err) => {
//         console.error('Connection error:', err);
//         setIsConnected(false);
//       });

//       setSocket(newSocket);
//     } else if (!socket.connected) {
//       socket.connect();
//     }
//   };

//   const disconnect = () => {
//     if (socket) {
//       socket.disconnect();
//       setIsConnected(false);
//     }
//   };

//   useEffect(() => {
//     return () => {
//       if (socket) {
//         console.log("Cleaning up socket on provider unmount");
//         socket.disconnect();
//       }
//     };
//   }, [socket]);

//   return (
//     <SocketContext.Provider value={{ socket, isConnected, connect, disconnect }}>
//       {children}
//     </SocketContext.Provider>
//   );
// };

// export const useSocket = () => useContext(SocketContext);

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  Close_SOCKET: () => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  connect: () => {},
  disconnect: () => {},
  Close_SOCKET: () => {}
});

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [socketId, setSocketId] = useState<string | null>(null);

  const connect = () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    // If we already have a socket that's connected, don't create a new one
    if (socket && socket.connected) {
      console.log("Socket already connected with ID:", socket.id);
      setIsConnected(true);
      return;
    }
    
    // If we have a socket that's disconnected, try to reconnect it instead of creating a new one
    if (socket && !socket.connected) {
      console.log("Reconnecting existing socket...");
      socket.connect();
      return;
    }

    // Otherwise create a new socket
    console.log("Creating new socket connection...");
    const newSocket = io('http://localhost:5000', {
      transports: ['websocket'],
      autoConnect: true,
      // Don't use Socket.IO's reconnection to avoid getting new socket IDs
      reconnection: false
    });
    
    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
      setSocketId(newSocket.id ?? null);
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (err) => {
      console.error('Connection error:', err);
      setIsConnected(false);
    });

    setSocket(newSocket);
  };

  // Manual ping to keep connection alive
  useEffect(() => {
    if (!socket || !isConnected) return;
    
    const pingInterval = setInterval(() => {
      if (socket && socket.connected) {
        // Send a custom ping to keep connection alive
        socket.emit('ping');
        console.log('Ping sent to maintain connection');
      }
    }, 25000); // Every 25 seconds to stay under most timeout limits
    
    return () => clearInterval(pingInterval);
  }, [socket, isConnected]);

  const disconnect = () => {
    if (socket) {
      // Just disconnect temporally, keeping the socket instance
      socket.disconnect();
      setIsConnected(false);
    }
  };
  
  const Close_SOCKET = () => {
    if (socket) {
      console.log("Completely closing socket connection");
      socket.disconnect();
      socket.removeAllListeners();
      setSocket(null);
      setSocketId(null);
      setIsConnected(false);
    }
  };

  // This handles cleanup on component unmount
  useEffect(() => {
    return () => {
      // Don't disconnect the socket on unmount - this is key for persistence
      // Just clean up listeners that might be specific to this component
      if (socket) {
        console.log("Component unmounting, keeping socket alive");
      }
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={{ 
      socket, 
      isConnected, 
      connect, 
      disconnect,
      Close_SOCKET 
    }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);