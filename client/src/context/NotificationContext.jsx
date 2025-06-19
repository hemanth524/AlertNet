import { createContext, useState, useEffect, useContext } from "react";
import { SocketContext } from "./SocketContext";
import {toast} from 'react-hot-toast';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { socket } = useContext(SocketContext);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
  if (!socket) return;

  socket.on("notification", (data) => {
    console.log("📥 Notification received on client:", data);
    setNotifications((prev) => [data, ...prev]);

    if (data.type === "self" && data.reporterId === user?._id) {
      toast.success("✅ You have reported this incident.");
    } else if (data.type === "area"  && data.reporterId !== user?._id) {
      toast("🚨 New incident reported near your area!", {
        icon: "⚠️",
      });
    }
  });

  return () => {
    socket.off("notification");
  };
}, [socket]);

  return (
    <NotificationContext.Provider value={{ notifications }}>
      {children}
    </NotificationContext.Provider>
  );
};
