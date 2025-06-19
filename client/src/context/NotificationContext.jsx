// File: context/NotificationContext.jsx
import { createContext, useState, useEffect, useContext } from "react";
import { SocketContext } from "./SocketContext";
import { AuthContext } from "./AuthContext";
import axios from "axios";
import { toast } from "react-hot-toast";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { socket } = useContext(SocketContext);
  const { user, token } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);

  // Load notifications from backend
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/notifications", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setNotifications(res.data.notifications);
      } catch (err) {
        console.error("Failed to fetch notifications:", err.message);
      }
    };

    if (token) fetchNotifications();
  }, [token]);

  // Listen to real-time notifications
  useEffect(() => {
    if (!socket) return;

    socket.on("notification", (data) => {
      setNotifications((prev) => [data, ...prev]);

      if (data.type === "self-report" && data.reporterId === user?._id) {
        toast.success("✅ You have reported this incident.");
      } else if (data.type === "alert" && data.reporterId !== user?._id) {
        toast("🚨 New incident reported near your area!", { icon: "⚠️" });
      }
    });

    return () => socket.off("notification");
  }, [socket, user]);

  return (
    <NotificationContext.Provider value={{ notifications }}>
      {children}
    </NotificationContext.Provider>
  );
};
