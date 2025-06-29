import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const ChatInbox = () => {
    const { token } = useContext(AuthContext);
    const [chats, setChats] = useState([]);

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat/my-chats`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                setChats(data);
            } catch (err) {
                console.error("❌ Failed to fetch chats:", err);
            }
        };
        fetchChats();
    }, [token]);

    const handleDelete = async (incidentId, otherUserId) => {
        if (!confirm("Are you sure you want to delete this chat for both users?")) return;

        try {
            const res = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/chat/${incidentId}/${otherUserId}`,
                {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            const data = await res.json();

            if (res.ok) {
                setChats((prev) => prev.filter(chat => !(chat.incidentId._id === incidentId && chat.sender._id === otherUserId)));
                toast.success("Chat deleted successfully for both users.");
            } else {
                toast.error(data.message || "Failed to delete chat.");
            }
        } catch (err) {
            console.error("❌ Error deleting chat:", err);
            toast.error("Server error while deleting chat.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white p-6">
            <h1 className="text-3xl font-bold mb-6 text-center text-red-400">📥 My Chat Inbox</h1>
            {chats.length === 0 ? (
                <p className="text-center text-gray-400">No chats yet.</p>
            ) : (
                <div className="space-y-4 max-w-xl mx-auto">
                    {chats.map((chat, idx) => (
                        <div
                            key={idx}
                            className="
                                bg-slate-800 rounded-xl p-4 shadow 
                                hover:shadow-lg hover:shadow-blue-400/80
                                flex justify-between items-center
                            "
                        >
                            <Link
                                to={`/chat/${chat.incidentId._id}/${chat.sender._id}`}
                                className="flex-1"
                            >
                                <div className="font-semibold text-lg text-blue-300">{chat.sender.name}</div>
                                <div className="text-gray-400 text-sm">Incident: {chat.incidentId.type}</div>
                                <div className="text-gray-300 mt-1 line-clamp-2">{chat.lastMessage}</div>
                                <div className="text-gray-500 text-xs mt-1">{new Date(chat.updatedAt).toLocaleString()}</div>
                            </Link>
                            <button
                                onClick={() => handleDelete(chat.incidentId._id, chat.sender._id)}
                                className="ml-4 text-md border rounded bg-red-600 text-white px-2 hover:cursor-pointer"
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ChatInbox;
