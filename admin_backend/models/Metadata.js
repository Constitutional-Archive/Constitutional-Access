const mongoose = require('mongoose');

const metadataSchema = new mongoose.Schema({
  fileName: String,
  description: String,
  category: String,
  fileUrl: String,
  fileSize: Number,
  fileType: String,
  uploadedBy: String, // Auth0 user ID (sub claim)
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Metadata', metadataSchema);