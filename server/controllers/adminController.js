import User from '../models/User.js';
import Incident from '../models/Incident.js';

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({ users });
  } catch (err) {
    console.error("❌ Error fetching users:", err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Mark selected users as top reporters
export const markTopReporters = async (req, res) => {
  try {
    const { topUserIds } = req.body; // array of _id
   // ✅ Replace your current logic with this:
await User.updateMany({}, { $set: { isTopReporter: false } }); // 👈 Explicitly set false
await User.updateMany({ _id: { $in: topUserIds } }, { $set: { isTopReporter: true } });

    res.status(200).json({ message: 'Top reporters updated' });
  } catch (err) {
    console.error("❌ Error updating top reporters:", err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all incidents
export const getAllIncidents = async (req, res) => {
  try {
    const incidents = await Incident.find().populate('reporter', 'name email');
    res.status(200).json({ incidents });
  } catch (err) {
    console.error("❌ Error fetching incidents:", err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get latest 5 incidents (for top incident updates on user side)
export const getAdminStats = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const userCount = await User.countDocuments();
    const incidentCount = await Incident.countDocuments();

    res.status(200).json({
      users: userCount,
      incidents: incidentCount,
    });
  } catch (err) {
    console.error("❌ Admin stats error:", err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getLatestIncidents = async (req, res) => {
  try {
    const incidents = await Incident.find().sort({ createdAt: -1 }).limit(5);
    res.status(200).json({ incidents });
  } catch (err) {
    console.error("❌ Error fetching latest incidents:", err);
    res.status(500).json({ message: 'Server error' });
  }
};

