// File: controllers/userController.js
import User from '../models/User.js';

export const getUserNotifications = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('notifications.incidentId') // populate incident
      .lean();

    const formatted = user.notifications
      .map((n) => ({
        message: n.message,
        type: n.type,
        createdAt: n.createdAt,
        incident: n.incidentId, // populated
      }))
      .reverse();

    res.status(200).json({ notifications: formatted });
  } catch (err) {
    console.error("❌ Error fetching notifications:", err.message);
    res.status(500).json({ message: 'Server error' });
  }
};
