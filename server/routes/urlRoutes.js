const express = require('express');
const Url = require('../models/Url');
const generateShortCode = require('../utils/generateCode');

const router = express.Router();

// Shorten a URL
router.post('/shorten', async (req, res) => {
  try {
    const { originalUrl } = req.body;
    if (!originalUrl) {
      return res.status(400).json({ message: 'Please provide a URL' });
    }

    // Validate URL format
    try {
      const parsed = new URL(originalUrl);
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        return res.status(400).json({ message: 'URL must start with http:// or https://' });
      }
    } catch {
      return res.status(400).json({ message: 'Invalid URL format' });
    }

    let shortCode = generateShortCode(6);
    while (await Url.findOne({ shortCode })) {
      shortCode = generateShortCode(6);
    }

    const newUrl = await Url.create({ originalUrl, shortCode });
    res.status(201).json(newUrl);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all URLs
router.get('/', async (req, res) => {
  try {
    const urls = await Url.find().sort({ createdAt: -1 });
    res.json(urls);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete a URL
router.delete('/:id', async (req, res) => {
  try {
    await Url.findByIdAndDelete(req.params.id);
    res.json({ message: 'URL deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;