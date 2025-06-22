// File: controllers/userController.js
import User from '../models/User.js';
import Incident from '../models/Incident.js';

export const getUserNotifications = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('notifications.incidentId') // populate incident
      .lean();

    const formatted = user.notifications
      .map((n) => ({
        _id: n._id,
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

// controllers/userController.js
export const deleteUserNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user.id;

    if (!notificationId) {
      return res.status(400).json({ message: "Missing notification ID" });
    }

    // Step 1: Get the user's notification to check incidentId and type
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const notif = user.notifications.find(n => n._id.toString() === notificationId);
    if (!notif) {
      return res.status(404).json({ message: 'Notification not found in user' });
    }

    const { incidentId, type } = notif;

    // Step 2: Remove notification using $pull
    await User.findByIdAndUpdate(userId, {
      $pull: { notifications: { _id: notificationId } }
    });

    // Step 3: If it's a self-report, also delete the incident + clean all related notifications
    if (type === 'self-report' && incidentId) {
      const incident = await Incident.findById(incidentId);

      if (incident && incident.reporter.toString() === userId) {
        await Incident.findByIdAndDelete(incidentId);

        // Remove related notifications from all users
        await User.updateMany(
          {},
          { $pull: { notifications: { incidentId } } }
        );

        console.log(`🗑️ Deleted incident ${incidentId} and related notifications`);
      }
    }

    res.status(200).json({ message: 'Notification deleted (and incident if self-reported)' });
  } catch (err) {
    console.error("❌ Error in deleting notification:", err);
    res.status(500).json({ message: 'Server error' });
  }
};
