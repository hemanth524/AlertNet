// src/pages/AdminUsers.jsx
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AdminUsers = () => {
  const { token, user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/login");
      return;
    }
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data.users);
      } catch (err) {
        console.error("Failed to fetch users", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [token, user, navigate]);

  const handleToggle = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  const updateTopReporters = async () => {
    try {
      await axios.patch(
        "http://localhost:5000/api/admin/top-reporters",
        { topUserIds: selectedIds },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Top reporters updated successfully.");
    } catch (err) {
      console.error("Update failed", err);
      alert("Failed to update top reporters.");
    }
  };

  const toggleSingleUser = async (id, currentStatus) => {
    try {
      const updatedIds = currentStatus
        ? selectedIds.filter((uid) => uid !== id)
        : [...selectedIds, id];

      await axios.patch(
        "http://localhost:5000/api/admin/top-reporters",
        { topUserIds: updatedIds },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update UI state
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u._id === id ? { ...u, isTopReporter: !currentStatus } : u
        )
      );

      // Update selectedIds state too
      setSelectedIds(updatedIds);
    } catch (err) {
      console.error("Error toggling top reporter:", err);
      alert("Failed to toggle top reporter status.");
    }
  };

  if (loading) return <div className="p-6">Loading users...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-800">Manage Top Reporters</h1>
      <div className="bg-white p-4 rounded shadow">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">#</th>
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Top Reporter?</th>
              <th className="p-2">Select</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={u._id} className="border-t">
                <td className="p-2">{i + 1}</td>
                <td className="p-2">{u.name}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2">
                  <button
                    onClick={() => toggleSingleUser(u._id, u.isTopReporter)}
                    className={`text-lg ${
                      u.isTopReporter ? "text-green-600" : "text-red-600"
                    } hover:underline`}
                    title="Click to toggle"
                  >
                    {u.isTopReporter ? "✅" : "❌"}
                  </button>
                </td>
                <td className="p-2">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(u._id)}
                    onChange={() => handleToggle(u._id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button
          onClick={updateTopReporters}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default AdminUsers;
