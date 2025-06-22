// src/context/NotificationContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import { SocketContext } from "./SocketContext";
import toast from "react-hot-toast";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { token } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    if (!token) return;
    try {
      const res = await axios.get("http://localhost:5000/api/users/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(res.data.notifications);
    } catch (err) {
      console.error("❌ Failed to fetch notifications:", err.message);
    }
  };

  // 🔁 Fetch notifications when token changes
  useEffect(() => {
    fetchNotifications();
  }, [token]);

  // 🔔 Listen to real-time notifications from server
  useEffect(() => {
    if (!socket) return;

    const handleNotification = (newNotif) => {
      setNotifications((prev) => [newNotif, ...prev]);

      // Show toast for nearby incident
      if (newNotif.type === "alert") {
        toast.success(`🚨 Nearby Incident: ${newNotif.incident?.type || "Alert"}`, {
          duration: 6000,
        });
      }

      // Optional: show toast for self-report too
      if (newNotif.type === "self-report") {
        toast("✅ Your incident has been reported", {
          icon: "📝",
        });
      }
    };

    socket.on("notification", handleNotification);

    return () => {
      socket.off("notification", handleNotification);
    };
  }, [socket]);

  return (
    <NotificationContext.Provider value={{ notifications, setNotifications, fetchNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};
