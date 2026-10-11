import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useSocket } from '../context/SocketContext';
import axiosInstance from '../utils/axios';

const getId = (value) => (typeof value === 'object' && value !== null ? value._id || value.id : value);

const formatMessageTime = (value) => {
    if (!value) return '';
    const date = new Date(value);
    return Number.isNaN(date.getTime())
        ? ''
        : date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
};

const getMessageStatus = (message) => message.status || message.deliveryStatus;

const MessageTicks = ({ status }) => {
    if (!['sent', 'delivered', 'read'].includes(status)) return null;
    const isRead = status === 'read';
    const isDouble = status === 'delivered' || isRead;

    return (
        <span
            className={`ml-1 font-semibold ${isRead ? 'text-info' : 'text-base-content/50'}`}
            aria-label={`${status} message`}
            title={status.charAt(0).toUpperCase() + status.slice(1)}
        >
            {isDouble ? 
                (
                    <svg width="14" height="24" viewBox="0 0 24 24" id="check-double" data-name="Line Color" xmlns="http://w3.org" className="w-4 h-4 fill-none stroke-current" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <line id="secondary" x1="13.22" y1="16.5" x2="21" y2="7.5" />
                        <polyline id="primary" points="3 11.88 7 16.5 14.78 7.5" />
                    </svg>
                ) : 
                (
                    <svg width="24" height="24" viewBox="0 0 24 24" id="check-double" data-name="Line Color" xmlns="http://w3.org" className="w-4 h-4 fill-none stroke-current" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <polyline id="primary" points="3 11.88 7 16.5 14.78 7.5" />
                    </svg>
                )
            }
        </span>
    );
};

const ChatPage = () => {
    const { receiverId } = useParams(); // URL se receiver ka ID nikalna (e.g. /chat/123)
    const navigate = useNavigate();
   
    const [receiver, setReceiver] = useState(null);

    // Global States
    const user = useSelector((store) => store.user.data);
    const { socket } = useSocket();
    
    // Local States
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState("");
    const [showPremiumModal, setShowPremiumModal] = useState(false);
    const [isOtherUserTyping, setIsOtherUserTyping] = useState(false);
    const [historyLoadedFor, setHistoryLoadedFor] = useState(null);
    const [showUnlockWarning, setShowUnlockWarning] = useState(false);
    
    const messagesEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    // Auto-scroll to bottom jab bhi naya message aaye
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // 1. Fetch Old Chat History (REST API)
    useEffect(() => {
        let isActive = true;
        const fetchReceiver = async () => {
            try {
                const { data } = await axiosInstance.get(`/user/profile/${receiverId}`);
                if (isActive && data.success) {
                    setReceiver(data.data);
                }
            } catch {
                console.error("Failed to fetch receiver profile");
            }
        };
        fetchReceiver();

        const fetchOldMessages = async () => {
            try {
                const { data } = await axiosInstance.get(`/message/fetch/${receiverId}`);
                if (!isActive) return;
                const history = Array.isArray(data.data) ? data.data : data.data?.messages || [];
                setMessages(history);
                setHistoryLoadedFor(receiverId);
            } catch {
                console.error("Failed to fetch chat history");
            }
        };
        fetchOldMessages();

        return () => {
            isActive = false;
        };
    }, [receiverId]);

    useEffect(() => {
        if (socket && historyLoadedFor === receiverId) {
            socket.emit("markMessagesAsRead", { otherUserId: receiverId });
        }
    }, [socket, receiverId, historyLoadedFor]);

    // 2. Real-time Socket Listeners
    useEffect(() => {
        if (!socket) return;

        socket.emit("joinConversation", { otherUserId: receiverId });

        // Naya message aane par UI update karna
        const handleReceiveMessage = (newMessage) => {
            setMessages((prev) => {
                const newId = getId(newMessage._id || newMessage.id || newMessage.messageId);
                if (newId && prev.some((message) => getId(message._id || message.id || message.messageId) === newId)) {
                    return prev;
                }
                return [...prev, newMessage];
            });
            socket.emit("markMessagesAsRead", { otherUserId: receiverId });
        };

        // Jab user ki limit exhaust ho jaye
        const handleLimitExhausted = () => {
            setShowPremiumModal(true); // Paywall modal open karna!
        };

        const handleTyping = (data) => {
            const typingUserId = getId(data?.userId || data?.senderId || data?.from);
            if (typingUserId && typingUserId === getId(user?._id)) return;
            setIsOtherUserTyping(true);
        };

        const handleStopTyping = (data) => {
            const typingUserId = getId(data?.userId || data?.senderId || data?.from);
            if (typingUserId && typingUserId === getId(user?._id)) return;
            setIsOtherUserTyping(false);
        };

        const handleMessageStatusUpdated = (data) => {
            const status = data?.status || data?.message?.status;
            const updatedIds = data?.messageIds || [data?.messageId || data?.message?._id || data?._id];
            const ids = updatedIds.filter(Boolean).map(getId);
            if (!status || ids.length === 0) return;

            setMessages((previous) => previous.map((message) => {
                const messageId = getId(message._id || message.id || message.messageId);
                return ids.includes(messageId) ? { ...message, status } : message;
            }));
        };

        socket.on("receiveMessage", handleReceiveMessage);
        socket.on("chatLimitExhausted", handleLimitExhausted);
        socket.on("typing", handleTyping);
        socket.on("stopTyping", handleStopTyping);
        socket.on("messageStatusUpdated", handleMessageStatusUpdated);

        // Cleanup listeners
        return () => {
            socket.off("receiveMessage", handleReceiveMessage);
            socket.off("chatLimitExhausted", handleLimitExhausted);
            socket.off("typing", handleTyping);
            socket.off("stopTyping", handleStopTyping);
            socket.off("messageStatusUpdated", handleMessageStatusUpdated);
        };
    }, [socket, receiverId, user?._id]);

    useEffect(() => () => {
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    }, []);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputText(value);
        if (!socket) return;

        if (value.trim()) {
            socket.emit("typing", { otherUserId: receiverId });
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = setTimeout(() => {
                socket.emit("stopTyping", { otherUserId: receiverId });
                typingTimeoutRef.current = null;
            }, 2000);
        } else {
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = null;
            socket.emit("stopTyping", { otherUserId: receiverId });
        }
    };

    const emitMessageToBackend = () => {
        socket.emit("sendMessage", {
            receiverId,
            text: inputText
        });

        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
        socket.emit("stopTyping", { otherUserId: receiverId });

        // OPTIMISTIC REDUX UPDATE (Only if it's the first message)
        const haveISentMessage = messages.some(msg => msg.senderId === user._id);
        if (!haveISentMessage) {
            dispatch(addUser({ 
                ...user, 
                freeChatsUsed: (user.freeChatsUsed || 0) + 1 
            }));
        }

        setInputText(""); // Input field clear karna
    }

    // 3. Send Message Function
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputText.trim() || !socket) return;

        // Check if I (the logged-in user) have sent at least one message in this chat
        const haveISentMessage = messages.some(msg => msg.senderId === user._id);

        // Agar maine abhi tak ek bhi message nahi bheja hai, toh Unlock Warning Modal dikhao
        if (!haveISentMessage) {
            setShowUnlockWarning(true);
            return; 
        }

        // Agar main pehle message bhej chuka hu, toh direct send karo (Credit already used)
        // Backend socket logic ko message bhejna
        emitMessageToBackend();
    };

    return (
        <div className="flex flex-col h-[calc(70vh)] max-w-3xl my-10 mx-auto bg-base-100 shadow-xl rounded-xl border border-base-300">
            {/* Chat Header */}
            <div className="p-4 border-b border-base-300 bg-base-200 rounded-t-xl font-bold text-lg">
                {receiver ? `${receiver.firstName} ${receiver.lastName || ''}`.trim() : 'DevTinder Chat'}
            </div>

            {/* Chat Messages Box */}
            <div className="flex-1 p-4 overflow-y-auto">
                {messages.length === 0 ? (
                    <div className="text-center text-gray-500 mt-10">
                        Start the conversation! Say Hi 👋
                    </div>
                ) : (
                    messages.map((msg, index) => {
                        const isMe = getId(msg.senderId) === getId(user?._id); // Check if I sent it
                        const messageKey = msg._id || msg.id || msg.messageId || index;
                        return (
                            <div key={messageKey} className={`chat ${isMe ? 'chat-end' : 'chat-start'}`}>
                                <div className="chat-image avatar">
                                    <div className="w-10 rounded-full">
                                        <img src={isMe ? user.photoUrl : receiver?.photoUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} alt="avatar" />
                                    </div>
                                </div>
                                <div className={`text-md chat-bubble ${isMe ? 'chat-bubble-primary' : 'chat-bubble-secondary'}`}>
                                    {msg.text}
                                    <div className="text-[9px] chat-footer mt-1 flex items-center">
                                        <time className="uppercase">{formatMessageTime(msg.timestamp || msg.createdAt)}</time>
                                        {isMe && <MessageTicks status={getMessageStatus(msg)} />}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Box */}
            {isOtherUserTyping && (
                <div className="px-4 pb-2 text-sm text-base-content/65" role="status" aria-live="polite">
                    <span className="loading loading-dots loading-xs mr-2 align-middle" />
                    {receiver?.firstName || 'User'} is typing...
                </div>
            )}

            <form onSubmit={handleSendMessage} className="p-4 bg-base-200 rounded-b-xl flex gap-2">
                <input 
                    type="text" 
                    placeholder="Type a message..." 
                    className="input input-bordered flex-1"
                    value={inputText}
                    onChange={handleInputChange}
                />
                <button type="submit" className="btn btn-primary" disabled={!inputText.trim()}>
                    Send
                </button>
            </form>

            {/* 1. THE CONVERSATION UNLOCK WARNING MODAL */}
            {showUnlockWarning && (
                <div className="modal modal-open modal-bottom sm:modal-middle backdrop-blur-sm z-50">
                    <div className="modal-box">
                        <h3 className="font-bold text-xl mb-4">Start New Conversation? 💬</h3>
                        
                        <div className="bg-base-200 p-4 rounded-lg mb-4">
                            <p className="flex justify-between text-sm mb-1">
                                <span>Free Chats Limit:</span>
                                <span className="font-bold">3 / week</span>
                            </p>
                            <p className="flex justify-between text-sm mb-1">
                                <span>Currently Used:</span>
                                <span className="font-bold">{user.freeChatsUsed || 0}</span>
                            </p>
                            <div className="text-xs text-gray-500 mt-2 text-center italic">
                                (Limit resets every Monday at 00:00)
                            </div>
                        </div>

                        <p className="text-sm">
                            Replying to or starting this conversation will use <strong>1 free chat credit</strong>. Once unlocked, you can chat with this person infinitely for free.
                        </p>
                        
                        <div className="modal-action">
                            <button 
                                className="btn btn-ghost" 
                                onClick={() => setShowUnlockWarning(false)}
                            >
                                Cancel
                            </button>
                            <button 
                                className="btn btn-primary"
                                onClick={() => {
                                    setShowUnlockWarning(false);
                                    emitMessageToBackend(); // Asli message yahan se jayega
                                }}
                            >
                                Unlock & Send
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 2. THE PAYWALL MODAL (Premium Coming Soon) */}
            {showPremiumModal && (
                <div className="modal modal-open modal-bottom sm:modal-middle backdrop-blur-sm">
                    <div className="modal-box">
                        <h3 className="font-bold text-2xl text-error mb-2">Limit Reached! 🚀</h3>
                        <p className="py-2 text-lg">
                            You have exhausted your limit of <strong>3 new conversations</strong> for this week. 
                        </p>
                        <p className="py-2 text-gray-500">
                            Our <strong>Plus</strong> and <strong>Pro</strong> plans are launching soon with up to 900 connection limits, advanced matching, and zero restrictions!
                        </p>
                        
                        <div className="modal-action">
                            <button 
                                className="btn" 
                                onClick={() => {
                                    setShowPremiumModal(false);
                                    navigate("/feed"); // Wapas feed par bhej do
                                }}
                            >
                                Back to Feed
                            </button>
                            <button 
                                className="btn btn-primary cursor-not-allowed opacity-80"
                            >
                                Get Premium (Coming Soon)
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatPage;