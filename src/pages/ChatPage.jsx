import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useSocket } from '../context/SocketContext';
import axiosInstance from '../utils/axios';

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
    
    const messagesEndRef = useRef(null);

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
            } catch (error) {
                console.error("Failed to fetch receiver profile");
            }
        };
        fetchReceiver();

        const fetchOldMessages = async () => {
            try {
                // Aapko backend mein ek GET '/messages/:receiverId' route banana hoga
                // jahan aap in dono ke purane messages fetch kar sakein.
                const { data } = await axiosInstance.get(`/message/fetch/${receiverId}`);
                setMessages(data.data || []);
            } catch (error) {
                console.error("Failed to fetch chat history");
            }
        };
        fetchOldMessages();

        return () => {
            isActive = false;
        };
    }, [receiverId]);

    // 2. Real-time Socket Listeners
    useEffect(() => {
        if (!socket) return;

        // Naya message aane par UI update karna
        const handleReceiveMessage = (newMessage) => {
            setMessages((prev) => [...prev, newMessage]);
        };

        // Jab user ki limit exhaust ho jaye
        const handleLimitExhausted = (data) => {
            setShowPremiumModal(true); // Paywall modal open karna!
        };

        socket.on("receiveMessage", handleReceiveMessage);
        socket.on("chatLimitExhausted", handleLimitExhausted);

        // Cleanup listeners
        return () => {
            socket.off("receiveMessage", handleReceiveMessage);
            socket.off("chatLimitExhausted", handleLimitExhausted);
        };
    }, [socket]);

    // 3. Send Message Function
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputText.trim() || !socket) return;

        // Backend socket logic ko message bhejna
        socket.emit("sendMessage", {
            receiverId,
            text: inputText
        });

        setInputText(""); // Input field clear karna
    };

    return (
        <div className="flex flex-col h-[calc(70vh)] max-w-3xl my-10 mx-auto bg-base-100 shadow-xl rounded-xl border border-base-300">
            {/* Chat Header */}
            <div className="p-4 border-b border-base-300 bg-base-200 rounded-t-xl font-bold text-lg">
                DevTinder Chat
            </div>

            {/* Chat Messages Box */}
            <div className="flex-1 p-4 overflow-y-auto">
                {messages.length === 0 ? (
                    <div className="text-center text-gray-500 mt-10">
                        Start the conversation! Say Hi 👋
                    </div>
                ) : (
                    messages.map((msg, index) => {
                        const isMe = msg.senderId === user._id; // Check if I sent it
                        return (
                            <div key={index} className={`chat ${isMe ? 'chat-end' : 'chat-start'}`}>
                                <div className="chat-image avatar">
                                    <div className="w-10 rounded-full">
                                        <img src={isMe ? user.photoUrl : receiver?.photoUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} alt="avatar" />
                                    </div>
                                </div>
                                <div className={`chat-bubble ${isMe ? 'chat-bubble-primary' : 'chat-bubble-secondary'}`}>
                                    {msg.text}
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Box */}
            <form onSubmit={handleSendMessage} className="p-4 bg-base-200 rounded-b-xl flex gap-2">
                <input 
                    type="text" 
                    placeholder="Type a message..." 
                    className="input input-bordered flex-1"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                />
                <button type="submit" className="btn btn-primary" disabled={!inputText.trim()}>
                    Send
                </button>
            </form>

            {/* 🚀 THE PAYWALL MODAL (Premium Coming Soon) */}
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