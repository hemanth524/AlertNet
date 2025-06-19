// models/User.js
import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  message: String,
  type: { type: String, enum: ['alert', 'self-report'], default: 'alert' },
  incidentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Incident' },
  createdAt: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },

  // Replaced coordinates with a manual location name (city/area)
  location: {
  type: {
    type: String,
    enum: ['Point'],
    default: 'Point',
  },
  coordinates: {
    type: [Number], // [longitude, latitude]
    required: true,
  }
},

  points: {
    type: Number,
    default: 0
  },

  notifications: [notificationSchema]
}, {
  timestamps: true
});

export default mongoose.model('User', userSchema);
