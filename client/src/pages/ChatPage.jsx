import React from "react";
import { useParams } from "react-router-dom";
import ChatBox from "../components/ChatBox";

const ChatPage = () => {
  const { incidentId, receiverId } = useParams();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white p-6">
      <ChatBox incidentId={incidentId} receiverId={receiverId} />
    </div>
  );
};

export default ChatPage;
