// File: routes/userRoutes.js
import express from 'express';
import { getUserNotifications,deleteUserNotification } from '../controllers/userController.js';

import requireAuth from '../middleware/requireAuth.js';

const router = express.Router();

router.get('/notifications', requireAuth, getUserNotifications);
router.delete('/notifications/:notificationId', requireAuth, deleteUserNotification);

export default router;
