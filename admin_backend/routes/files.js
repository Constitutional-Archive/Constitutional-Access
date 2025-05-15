const express = require('express');
const router = express.Router();
const File = require('../models/Metadata'); // or your actual model path

// POST a file
router.post('/', async (req, res) => {
  try {
    const file = new File(req.body);
    await file.save();
    res.status(201).json(file);
  } catch (err) {
    res.status(500).json({ error: 'Upload failed', details: err.message });
  }
});

// GET all files
router.get('/', async (req, res) => {
  try {
    const files = await File.find().sort({ uploadedAt: -1 });
    res.status(200).json(files);
  } catch (err) {
    res.status(500).json({ error: 'Fetch failed', details: err.message });
  }
});

module.exports = router;
