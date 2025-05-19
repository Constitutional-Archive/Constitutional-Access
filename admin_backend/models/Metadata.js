const mongoose = require("mongoose");

const MetadataSchema = new mongoose.Schema({
  fileName: String,
  description: String,
  category: String,
  fileType:String,
  uploadedBy: String,
  publicationDate: Date, 
  fileUrl: String,
  uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Metadata', MetadataSchema);
