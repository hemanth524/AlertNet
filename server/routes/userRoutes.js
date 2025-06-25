import express from 'express';
import upload from '../middleware/upload.js';
import {
  getUserNotifications,
  deleteUserNotification,
  updateUserProfile,
  getTopReporters
} from '../controllers/userController.js';

import requireAuth from '../middleware/requireAuth.js';

const router = express.Router();

router.get('/notifications', requireAuth, getUserNotifications);
router.delete('/notifications/:notificationId', requireAuth, deleteUserNotification);

// ✅ Updated route
router.get('/top-reporters', getTopReporters);
router.put('/update', requireAuth, upload.single('avatar'), updateUserProfile);

export default router;
