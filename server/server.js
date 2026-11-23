const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Url = require('./models/Url');
const urlRoutes = require('./routes/urlRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Health Check
app.get('/', (req, res) => {
  res.send('URL Shortener API is running...');
});

// API Routes
app.use('/api/urls', urlRoutes);

// Core Redirect & Click Tracking Route
app.get('/:code', async (req, res) => {
  try {
    const url = await Url.findOne({ shortCode: req.params.code });
    if (!url) {
      return res.status(404).send('Short URL not found');
    }

    const ua = req.headers['user-agent'] || '';
    const device = /mobile|android|iphone|ipad/i.test(ua) ? 'Mobile' : 'Desktop';

    url.clicks += 1;
    url.analytics.push({ device, userAgent: ua });
    await url.save();

    return res.redirect(302, url.originalUrl);
  } catch (error) {
    return res.status(500).send('Server error');
  }
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected Successfully');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error('MongoDB Error:', err.message));