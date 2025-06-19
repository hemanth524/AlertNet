// File: routes/userRoutes.js
import express from 'express';
import { getUserNotifications } from '../controllers/userController.js';
import requireAuth from '../middleware/requireAuth.js';

const router = express.Router();

router.get('/notifications', requireAuth, getUserNotifications);

export default router;
