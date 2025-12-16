import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';
import { Send, User, Plus, X } from 'lucide-react';

const Chat = () => {
    const { user } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [showNewChatModal, setShowNewChatModal] = useState(false);
    const [availableUsers, setAvailableUsers] = useState([]);
    const location = useLocation();

    // Determine if we are starting a new chat from navigation state
    useEffect(() => {
        if (location.state?.recipientId) {
            // Check if conversation already exists, if not create temporary one
            const startChat = async () => {
                // Fetch conversations to see if it exists
                await fetchConversations();
                const existing = conversations.find(c => c.user._id === location.state.recipientId);
                if (existing) {
                    setActiveChat(existing.user);
                } else {
                    // Set temporary active chat (will become real once message sent)
                    setActiveChat({
                        _id: location.state.recipientId,
                        name: location.state.recipientName || 'User',
                        email: ''
                    });
                }
            };
            startChat();
        } else {
            fetchConversations();
        }
    }, [location.state]);

    const fetchConversations = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5001/api/messages/conversations', {
                headers: { 'x-auth-token': token }
            });
            setConversations(res.data);
        } catch (error) {
            console.error('Error fetching conversations:', error);
        }
    };

    const fetchMessages = async (userId) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`http://localhost:5001/api/messages/${userId}`, {
                headers: { 'x-auth-token': token }
            });
            setMessages(res.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5001/api/users', {
                headers: { 'x-auth-token': token }
            });
            setAvailableUsers(res.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    useEffect(() => {
        if (activeChat && activeChat._id) {
            fetchMessages(activeChat._id);
            // Poll for new messages every 3 seconds
            const interval = setInterval(() => fetchMessages(activeChat._id), 3000);
            return () => clearInterval(interval);
        }
    }, [activeChat]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeChat) return;

        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('http://localhost:5001/api/messages', {
                recipientId: activeChat._id,
                content: newMessage
            }, {
                headers: { 'x-auth-token': token }
            });

            setMessages([...messages, res.data]);
            setNewMessage('');

            // Refresh conversations list to update last message
            fetchConversations();
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const openNewChatModal = () => {
        fetchUsers();
        setShowNewChatModal(true);
    };

    const startNewChat = (recipient) => {
        const existing = conversations.find(c => c.user._id === recipient._id);
        if (existing) {
            setActiveChat(existing.user);
        } else {
            setActiveChat(recipient);
        }
        setShowNewChatModal(false);
    };

    return (
        <div className="container mx-auto p-4 h-[calc(100vh-80px)] flex gap-4 relative">
            {/* Conversations Sidebar */}
            <div className="w-1/3 bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
                <div className="p-4 border-b bg-slate-50 flex justify-between items-center text-brand-grey">
                    <div className="font-bold text-lg">Messages</div>
                    <button onClick={openNewChatModal} className="p-1 hover:bg-slate-200 rounded-full transition-colors" title="New Chat">
                        <Plus size={20} />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {conversations.map(conv => (
                        <div
                            key={conv.user._id}
                            onClick={() => setActiveChat(conv.user)}
                            className={`p-4 border-b cursor-pointer hover:bg-slate-50 transition-colors ${activeChat?._id === conv.user._id ? 'bg-yellow-50 border-l-4 border-brand-yellow' : ''}`}
                        >
                            <div className="font-bold text-gray-800">{conv.user.name}</div>
                            <div className="text-sm text-gray-500 truncate">{conv.lastMessage}</div>
                            <div className="text-xs text-gray-400 mt-1">{new Date(conv.date).toLocaleDateString()}</div>
                        </div>
                    ))}
                    {conversations.length === 0 && (
                        <div className="p-8 text-center text-gray-400">No conversations yet</div>
                    )}
                </div>
            </div>

            {/* Chat Window */}
            <div className="w-2/3 bg-white rounded-lg shadow-md flex flex-col">
                {activeChat ? (
                    <>
                        <div className="p-4 border-b bg-slate-50 flex items-center">
                            <div className="w-10 h-10 bg-brand-yellow rounded-full flex items-center justify-center text-brand-grey font-bold mr-3">
                                <User size={20} />
                            </div>
                            <div className="font-bold text-lg text-brand-grey">{activeChat.name}</div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                            {messages.map(msg => {
                                const isMe = msg.sender === (user?._id || user?.id);
                                return (
                                    <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[70%] p-3 rounded-lg shadow-sm ${isMe ? 'bg-brand-yellow text-brand-grey' : 'bg-white text-gray-800'}`}>
                                            <p>{msg.content}</p>
                                            <span className={`text-xs block mt-1 ${isMe ? 'text-yellow-800' : 'text-gray-400'}`}>
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        <form onSubmit={handleSendMessage} className="p-4 border-t flex gap-2">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1 p-3 border rounded-lg focus:outline-none focus:border-brand-yellow"
                            />
                            <button type="submit" className="bg-brand-grey text-white p-3 rounded-lg hover:bg-black transition-colors">
                                <Send size={20} />
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-400">
                        Select a conversation or start a new one
                    </div>
                )}
            </div>

            {/* New Chat Modal */}
            {showNewChatModal && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-96 max-h-[80%] flex flex-col">
                        <div className="p-4 border-b flex justify-between items-center">
                            <h3 className="font-bold text-lg">New Chat</h3>
                            <button onClick={() => setShowNewChatModal(false)} className="text-gray-500 hover:text-black">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-2">
                            {availableUsers.length > 0 ? (
                                availableUsers.map(u => (
                                    <div
                                        key={u._id}
                                        onClick={() => startNewChat(u)}
                                        className="p-3 hover:bg-slate-50 cursor-pointer rounded-lg flex items-center gap-3"
                                    >
                                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                            <User size={16} className="text-gray-500" />
                                        </div>
                                        <div>
                                            <div className="font-medium">{u.name}</div>
                                            <div className="text-xs text-gray-400 capitalize">{u.role}</div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-4 text-center text-gray-400">No users found</div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chat;
