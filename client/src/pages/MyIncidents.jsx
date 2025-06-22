// src/pages/MyIncidents.jsx
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const MyIncidents = () => {
  const { token } = useContext(AuthContext);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyIncidents = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/incidents/my-incidents", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setIncidents(res.data.incidents);
      } catch (err) {
        console.error("❌ Failed to fetch incidents:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMyIncidents();
  }, [token]);

  if (loading) return <p className="p-6 text-center">Loading your incidents...</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">📋 My Reported Incidents</h1>

      {incidents.length === 0 ? (
        <p className="text-gray-500">You haven't reported any incidents yet.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {incidents.map((incident) => (
            <Link
              key={incident._id}
              to={`/incident/${incident._id}`}
              className="border p-4 rounded-lg shadow hover:shadow-lg transition"
            >
              <h2 className="font-semibold text-lg">{incident.type}</h2>
              <p className="text-sm text-gray-700 mt-1">{incident.description.slice(0, 100)}...</p>
              <p className="text-xs text-gray-500 mt-2">
                Reported on: {new Date(incident.createdAt).toLocaleString()}
              </p>
              <p className="text-xs text-green-600 mt-1 capitalize">
                Status: {incident.status}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyIncidents;
