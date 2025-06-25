// server.js
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http';
import cloudinary from 'cloudinary';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import incidentRoutes from './routes/incident.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Cloudinary config
cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/incidents', incidentRoutes(io)); // Pass io to route factory
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/uploads', express.static(path.join(path.resolve(), 'uploads')));

// Default route
app.get('/', (req, res) => {
  res.send('🚀 AlertNet API is running...');
});

// Socket.IO Setup with Validation
function iosetup(io) {
  io.on("connection", (socket) => {
    console.log("User connected");

    socket.on("join", (userId) => {
      // ✅ Ensure userId is a valid MongoDB ObjectId (24 hex characters)
      if (typeof userId === 'string' && /^[0-9a-fA-F]{24}$/.test(userId)) {
        socket.join(userId);
        console.log(`✅ User ${userId} joined their notification room`);
      } else {
        console.warn(`❌ Invalid userId received in socket.join:`, userId);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
}

iosetup(io);

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ MongoDB connection failed:', err.message));

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
