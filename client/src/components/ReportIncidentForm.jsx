import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const ReportIncidentForm = () => {
  const { token } = useContext(AuthContext);

  const [type, setType] = useState("theft");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [coordinates, setCoordinates] = useState([0, 0]); // [longitude, latitude]
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const getCoordinatesFromLocation = async () => {
  try {
    // Add ", India" automatically if not included
    const query = location.toLowerCase().includes("india") ? location : `${location}, India`;

    const res = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(query)}&key=991d0eb7e0aa4fe191a3e71bbe3b62c7`
    );

    console.log("Geocode API response:", res.data);

    if (!res.data.results || res.data.results.length === 0) {
      alert("Location not found. Please be more specific.");
      throw new Error("No location results");
    }

    const { lat, lng } = res.data.results[0].geometry;
    return [lng, lat]; // [longitude, latitude]
  } catch (error) {
    console.error("Geocoding failed:", error.message);
    throw error;
  }
};


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("You must be logged in to report an incident.");
      return;
    }

    if (!description || images.length === 0 || !location) {
      alert("Please provide a description, at least one image, and a location.");
      return;
    }

    setLoading(true);

    try {
      const coords = await getCoordinatesFromLocation();
      setCoordinates(coords);

      const base64Images = await Promise.all(
        Array.from(images).map(
          (file) =>
            new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result);
              reader.onerror = reject;
              reader.readAsDataURL(file);
            })
        )
      );

      await axios.post(
        "http://localhost:5000/api/incidents/upload",
        {
          type,
          description,
          location,
          coordinates: coords,
          base64Images,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Incident reported successfully!");
      setType("theft");
      setDescription("");
      setLocation("");
      setImages([]);
      setCoordinates([0, 0]);
    } catch (err) {
      console.error("Error reporting incident:", err.response?.data || err.message);
      alert("Failed to report incident. Check location or try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow max-w-md mx-auto mt-6">
      <h2 className="text-xl font-bold mb-4">Report an Incident</h2>

      <label className="block font-semibold mb-1">Type:</label>
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="w-full p-2 border mb-4 rounded"
      >
        <option value="theft">Theft</option>
        <option value="accident">Accident</option>
        <option value="murder">Murder</option>
        <option value="fire">Fire</option>
        <option value="fight">Fight</option>
        <option value="other">Other</option>
      </select>

      <label className="block font-semibold mb-1">Description:</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 border mb-4 rounded"
        placeholder="Describe what happened..."
      />

      <label className="block font-semibold mb-1">Location (City/Area):</label>
      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="w-full p-2 border mb-4 rounded"
        placeholder="e.g. Guntur, Andhra Pradesh"
      />

      <label className="block font-semibold mb-1">Upload Image(s):</label>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => setImages(e.target.files)}
        className="mb-4"
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {Array.from(images).map((file, index) => (
          <img
            key={index}
            src={URL.createObjectURL(file)}
            alt={`preview-${index}`}
            className="w-20 h-20 object-cover rounded"
          />
        ))}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
      >
        {loading ? "Reporting..." : "Submit Report"}
      </button>
    </form>
  );
};

export default ReportIncidentForm;
