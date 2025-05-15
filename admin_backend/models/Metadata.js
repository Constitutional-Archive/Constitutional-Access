const mongoose = require("mongoose");

const MetadataSchema = new mongoose.Schema({
  fileName: String,
  description: String,
  category: String,
  uploadedBy: String,
  tags: [String],
  fileUrl: String,
  uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Metadata', MetadataSchema);
