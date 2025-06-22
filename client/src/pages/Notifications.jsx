import React, { useContext } from "react";
import { NotificationContext } from "../context/NotificationContext";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

const Notifications = () => {
  const { notifications, setNotifications,fetchNotifications  } = useContext(NotificationContext);
  const { token } = useContext(AuthContext);

  const handleDelete = async (id) => {
  try {
    const res = await axios.delete(`http://localhost:5000/api/users/notifications/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 200) {
      await fetchNotifications(); // 🔁 use context method to reload fresh data
      toast.success("✅ Notification deleted");
    }
  } catch (err) {
    console.error("❌ Failed to delete notification:", err.message);
    toast.error("❌ Failed to delete notification");
  }
};


  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🔔 Notifications</h1>

      {notifications.length === 0 ? (
        <p className="text-gray-500">No notifications yet.</p>
      ) : (
        <ul className="space-y-4">
          {notifications.map((notif) => (
            <li
              key={notif._id}
              className="bg-blue-100 p-4 rounded shadow border border-blue-300 hover:bg-blue-200 transition relative"
            >
              {notif.incident ? (
                <Link to={`/incident/${notif.incident._id}`} className="block">
                  <p className="font-semibold text-blue-900">{notif.message}</p>
                  <p className="text-sm text-gray-700">
                    <strong>Type:</strong> {notif.incident.type}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Reported At:</strong>{" "}
                    {new Date(notif.incident.createdAt).toLocaleString()}
                  </p>
                </Link>
              ) : (
                <p className="text-blue-900">{notif.message}</p>
              )}

              <button
                onClick={() => handleDelete(notif._id)}
                className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
