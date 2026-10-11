import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../utils/axios";
import { handleApiError } from "../utils/errorHandler";
import { useSelector } from 'react-redux';
import { useSocket } from '../context/SocketContext';

const formatConversationTime = (value) => {
    if (!value) return "";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";

    const now = new Date();
    
    // Clear times to strictly compare dates without time interference
    const targetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // Calculate the difference in days
    const diffTime = todayDate - targetDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // Today: Show time (e.g., "2:30 PM")
    if (diffDays === 0) {
        return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true });
    }

    // Yesterday: Show "Yesterday"
    if (diffDays === 1) {
        return "Yesterday";
    }

    // Past week (2 to 6 days ago): Show weekday name (e.g., "Friday")
    if (diffDays > 1 && diffDays < 7) {
        return date.toLocaleDateString([], { weekday: "long" });
    }

    // Older than a week: Show numeric date (dd/mm/yyyy)
    return date.toLocaleDateString([], { day: "2-digit", month: "2-digit", year: "numeric" });
};


const MessagesList = () => {
    const { socket } = useSocket();
    const loggedInUser = useSelector((store) => store.user.data); 
    const [conversations, setConversations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // 1. Define the fetch function outside so both hooks can use it
    const fetchConversations = useCallback(async (isActive = true) => {
        try {
            const { data } = await axiosInstance.get("/message/conversations");
            const items = Array.isArray(data) ? data : data?.data;
            if (isActive) setConversations(Array.isArray(items) ? items : []);
        } catch (error) {
            if (isActive) handleApiError(error); // Assuming handleApiError is defined above
        } finally {
            if (isActive) setIsLoading(false);
        }
    }, []); // Empty dependency array ensures this function is only created once

    // 2. Fetch data on initial mount (Your existing logic)
    useEffect(() => {
        let isActive = true;
        fetchConversations(isActive);

        return () => {
            isActive = false;
        };
    }, [fetchConversations]);

    // 3. Real-time Socket Listener
    useEffect(() => {
        if (!socket || !loggedInUser) return;

        const handleNewMessage = (newMessage) => {
            setConversations((prevConversations) => {
                // Determine who the "other user" is
                const otherUserId = newMessage.senderId === loggedInUser._id 
                    ? newMessage.receiverId 
                    : newMessage.senderId;
                
                // Find if they are already in the sidebar
                const existingIndex = prevConversations.findIndex(
                    (conv) => conv.user._id === otherUserId
                );

                if (existingIndex !== -1) {
                    // Chat exists: Extract it from the array
                    const updatedConversations = [...prevConversations];
                    const [movedChat] = updatedConversations.splice(existingIndex, 1);

                    // Duplicate event check
                    const isDuplicate = movedChat.lastMessage?._id === newMessage._id;
                    
                    // Check if user is currently viewing this exact chat page
                    const isCurrentlyInThisChat = location.pathname.includes(`/chat/${otherUserId}`);
                    
                    // 3.1 Update the latest message snippet
                    movedChat.lastMessage = newMessage;

                    if (!isDuplicate) {
                        // 3.2 Update the unread count logic
                        if (!isCurrentlyInThisChat || newMessage.senderId !== loggedInUser._id) {
                            // Agar saamne wale ne message bheja hai, toh counter +1 kar do
                            movedChat.unreadCount = (movedChat.unreadCount || 0) + 1;
                        } else {
                            // Agar maine khud message bheja hai, toh matlab main chat padh raha hoon -> reset to 0
                            movedChat.unreadCount = 0;
                        }
                    }
                    
                    // Move it back to the TOP (Index 0)
                    return [movedChat, ...updatedConversations];
                } else {
                    // Brand new chat: We need their profile details, so trigger API fetch
                    fetchConversations(true); 
                    return prevConversations;
                }
            });
        };

        // Listen for new messages
        socket.on("receiveMessage", handleNewMessage);

        return () => {
            socket.off("receiveMessage", handleNewMessage);
        };
    }, [socket, loggedInUser, fetchConversations]);

    return (
        <main className="mx-auto my-8 w-full max-w-3xl px-4 sm:px-6">
            <section className="flex flex-col h-[calc(70vh)] overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-xl">
                <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 border-b border-base-300 bg-base-200 px-5 py-4 sm:px-6">
                    <div>
                        <h1 className="text-2xl font-bold">Messages</h1>
                        <p className="mt-1 text-sm text-base-content/65">Your recent conversations</p>
                    </div>
                    <div className="sm:text-right text-sm">
                        <div className="text-gray-500 mb-1">
                            Plan: <span className="font-bold text-primary">{loggedInUser?.isPremium ? 'Premium (300)' : 'Free (3/week)'}</span>
                        </div>
                        <div className="text-gray-500">
                            Used: <span className={`font-bold ${loggedInUser?.freeChatsUsed >= 3 && !loggedInUser?.isPremium ? 'text-error' : 'text-success'}`}>
                                {loggedInUser?.freeChatsUsed || 0}
                            </span>
                        </div>
                    </div>
                </header>

                {isLoading ? (
                    <ul className="list divide-y divide-base-300">
                        {[0, 1, 2, 3].map((item) => (
                            <li key={item} className="flex items-center gap-4 p-4">
                                <div className="skeleton h-12 w-12 shrink-0 rounded-full" />
                                <div className="flex-1 space-y-2">
                                    <div className="skeleton h-4 w-1/3" />
                                    <div className="skeleton h-3 w-2/3" />
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : conversations.length === 0 ? (
                    <div className="px-6 py-16 text-center">
                        <div className="mb-3 text-4xl" aria-hidden="true">💬</div>
                        <h2 className="font-semibold">No conversations yet</h2>
                        <p className="mt-1 text-sm text-base-content/60">Connect with someone to start chatting.</p>
                    </div>
                ) : (
                    <ul className="overflow-y-auto list divide-y divide-base-300">
                        {conversations.map((conversation) => {
                            const user = conversation.user || {};
                            const receiverId = user._id || user.id || conversation.userId;
                            const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ") || "DevTinder member";
                            const lastMessage = conversation.lastMessage;
                            const unreadCount = conversation.unreadCount;

                            if (!receiverId) return null;

                            return (
                                <li key={receiverId} className="p-0 transition-colors hover:bg-base-200">
                                    <Link
                                        to={`/messages/${receiverId}`}
                                        state={{ receiverName: fullName }}
                                        className="flex w-full items-center gap-4 px-4 py-4 sm:px-6"
                                    >
                                        <div className="avatar shrink-0">
                                            <div className="w-12 rounded-full ring-2 ring-primary/15 ring-offset-2 ring-offset-base-100">
                                                <img src={user.photoUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} alt={fullName} />
                                            </div>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center justify-between gap-3">
                                                <h2 className="truncate font-semibold">{fullName}</h2>
                                                <time className={`shrink-0 text-xs uppercase ${unreadCount>0 ? 'text-primary' : 'text-base-content/55'}`}>
                                                    {formatConversationTime(lastMessage?.timestamp || lastMessage?.createdAt)}
                                                </time>
                                            </div>
                                            <p className="mt-1 truncate text-sm text-base-content/65 flex items-center justify-between gap-3">
                                                {
                                                    lastMessage?.senderId ? 
                                                        (lastMessage?.senderId === loggedInUser?._id) ? 'You: '+lastMessage?.text
                                                        : (<><strong className={`${unreadCount>0 && 'font-black text-primary'}`}>{lastMessage?.senderId !== loggedInUser?._id && lastMessage?.text}</strong> {unreadCount>0 && <span className="bg-primary text-white text-xs rounded-full p-2 h-[21px] flex items-center justify-center">{unreadCount}</span>}</>)
                                                        : "Start a conversation"
                                                }
                                            </p>
                                        </div>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </section>
        </main>
    );
};

export default MessagesList;