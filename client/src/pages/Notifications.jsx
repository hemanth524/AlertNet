import React, { useContext } from "react";
import { NotificationContext } from "../context/NotificationContext";
import { Link } from "react-router-dom";

const Notifications = () => {
  const { notifications } = useContext(NotificationContext);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🔔 Notifications</h1>

      {notifications.length === 0 ? (
        <p className="text-gray-500">No notifications yet.</p>
      ) : (
        <ul className="space-y-4">
          {notifications.map((notif, index) => (
            <li
              key={index}
              className="bg-blue-100 p-4 rounded shadow border border-blue-300 hover:bg-blue-200 transition"
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
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
