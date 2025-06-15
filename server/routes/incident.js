import express from 'express';
import Incident from '../models/Incident.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import cloudinary from 'cloudinary';

export default function(io) {
  const router = express.Router();

  // Middleware to get user from token
  const requireAuth = async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      res.status(401).json({ message: 'Invalid token' });
    }
  };

  // POST /api/incidents/upload
  router.post('/upload', requireAuth, async (req, res) => {
    try {
      const { type, description, base64Images, coordinates } = req.body;

      if (!Array.isArray(base64Images) || base64Images.length === 0) {
        return res.status(400).json({ message: 'At least one image is required' });
      }

      const uploadPromises = base64Images.map(img =>
        cloudinary.v2.uploader.upload(img, { folder: 'alertnet_incidents' })
      );

      const uploadResults = await Promise.all(uploadPromises);
      const imageURLs = uploadResults.map(result => result.secure_url);

      const incident = await Incident.create({
        type,
        description,
        imageURLs,
        location: {
          type: 'Point',
          coordinates
        },
        reporter: req.user.id
      });

      res.status(201).json({ message: 'Incident uploaded', incident });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // POST /api/incidents/help/:incidentId
  router.post('/help/:incidentId', requireAuth, async (req, res) => {
    const { incidentId } = req.params;
    const userId = req.user.id;

    try {
      const incident = await Incident.findById(incidentId);
      if (!incident) return res.status(404).json({ message: 'Incident not found' });

      if (!incident.helpedBy.includes(userId)) {
        incident.helpedBy.push(userId);
        await incident.save();

        await User.findByIdAndUpdate(userId, { $inc: { points: 10 } });

        io.emit('userHelped', {
          userId,
          incidentId,
          message: `User ${userId} is helping with the incident ${incidentId}`
        });
      }

      res.status(200).json({ message: 'Help registered' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });

  return router;
}
