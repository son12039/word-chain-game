import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const serverURL = "http://localhost:3001";
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = io(serverURL);
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [serverURL]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
