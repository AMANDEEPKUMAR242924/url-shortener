const mongoose = require('mongoose');

const clickSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  device: { type: String, default: 'Desktop' },
  userAgent: { type: String },
});

const urlSchema = new mongoose.Schema(
  {
    originalUrl: {
      type: String,
      required: true,
      trim: true,
    },
    shortCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    clicks: {
      type: Number,
      default: 0,
    },
    analytics: [clickSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Url', urlSchema);