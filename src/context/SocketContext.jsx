// src/context/SocketContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux'; // Redux import kiya

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const userId = useSelector((store) => store.user.data?._id);
    const authStatus = useSelector((store) => store.user.status);

    useEffect(() => {
        // Only connect after AuthBootstrap has verified the session.
        if (authStatus !== 'authenticated' || !userId) {
            return;
        }

        // Agar user logged in hai, tabhi connection banao
        const newSocket = io(import.meta.env.VITE_SOCKET_URL, {
            path: "/api/socket",
            withCredentials: true,
            transports: ['polling', 'websocket'] // 🚀 YE ADD KAREIN (Pehle polling karega, phir smoothly upgrade karega)
        });

        newSocket.on("connect", () => {
            setSocket(newSocket);
            console.log("Connected to live chat!", newSocket.id);
        });

        newSocket.on("connect_error", (error) => {
            console.error("Socket connection error:", error.message);
        });

        newSocket.io.on("upgrade", (transport) => {
            console.info("Socket upgraded to:", transport.name);
        });

        newSocket.on("disconnect", (reason) => {
            setSocket((currentSocket) => currentSocket === newSocket ? null : currentSocket);
            console.info("Socket disconnected:", reason);
        });

        // Cleanup: Jab user logout karega (user === null), ye purane socket ko kaat dega
        return () => {
            newSocket.disconnect();
        };
    }, [authStatus, userId]);

    const activeSocket = authStatus === 'authenticated' && userId ? socket : null;

    return (
        <SocketContext.Provider value={{ socket: activeSocket }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);