// src/pages/IncidentDetails.jsx
import { useParams, Link } from "react-router-dom";
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const IncidentDetails = () => {
  const { id } = useParams();
  const { user ,token} = useContext(AuthContext); // ⬅️ get token
  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
     console.log("🚀 id:", id);
console.log("🔑 token:", token);
  if (!token || id === "undefined") return;
    

  const fetchIncident = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/incidents/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
   
      setIncident(res.data.incident);
    } catch (err) {
      console.error("❌ Failed to load incident:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchIncident();
}, [id, user]);


  if (loading) return <p className="text-center p-6">Loading...</p>;
  if (!incident) return <p className="text-center p-6 text-red-600">Incident not found</p>;

  const coordinates = incident.location?.coordinates || [];

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Link to="/notifications" className="text-blue-600 underline mb-4 inline-block">
        ← Back to Notifications
      </Link>

      <h2 className="text-2xl font-bold mb-4">🚨 Incident Details</h2>

      <div className="space-y-2 text-gray-800">
        <p><strong>Type:</strong> {incident.type}</p>
        <p><strong>Description:</strong> {incident.description}</p>
        <p><strong>Coordinates:</strong> {coordinates.join(", ") || "N/A"}</p>
        <p className="text-sm text-gray-600">
          Reported At: {new Date(incident.createdAt).toLocaleString()}
        </p>
      </div>

      {incident.imageURLs?.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Images:</h3>
          <div className="flex gap-3 overflow-x-auto">
            {incident.imageURLs.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`incident-${idx}`}
                className="w-32 h-32 object-cover rounded shadow"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default IncidentDetails;
