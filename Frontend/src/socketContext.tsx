import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAppSelector } from './store/hooks';

interface Notification {
    message: string;
    // Add other notification properties as needed
}

interface SocketContextProps {
    notifications: Notification[];
    socket: Socket | null;
}

const SocketContext = createContext<SocketContextProps>({
    notifications: [],
    socket: null,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const user = useAppSelector((state) => state.user);

    useEffect(() => {
        const newSocket = io('http://localhost:8000', {
            auth: {
                token: user?.token,
            },
        }); // Replace with your server URL
        setSocket(newSocket);

        newSocket.on('notification', (notification: Notification) => {
            setNotifications((prevNotifications) => [...prevNotifications, notification]);
        });

        return () => {
            newSocket.close();
        };
    }, [user]);

    return (
        <SocketContext.Provider value={{ socket, notifications }}>
            {children}
        </SocketContext.Provider>
    );
};