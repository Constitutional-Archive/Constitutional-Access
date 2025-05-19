const Metadata = require("../models/Metadata");

exports.uploadFiles = (req, res) => {
  console.log("Files received:", req.files);
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "No files uploaded" });
  }

  const fileUrls = req.files.map(file => {
    return `https://${process.env.ACCOUNT_NAME}.blob.core.windows.net/${process.env.CONTAINER_NAME}/${file.blobName}`;
  });

  res.status(200).json({
    message: "Files uploaded successfully",
    files: req.files,
    fileUrls: fileUrls,
  });
};

exports.uploadMetadata = async (req, res) => {
  console.log("POST /upload/metadata hit");
  try {
    const { fileName, description, category, uploadedBy, publicationDate, fileType, fileUrl } = req.body;

    if (!fileUrl || fileUrl.length === 0) {
      return res.status(400).json({ message: "No file URL provided" });
    }
    
    const newMeta = new Metadata({
      fileName,
      description,
      category,
      uploadedBy,
      publicationDate,
      fileType,
      fileUrl,
      uploadedAt: new Date(),
    });

    await newMeta.save();
    res.status(201).json({ message: "Metadata saved", metadata: newMeta });
  } catch (err) {
    console.error("Error saving metadata:", err);
    res.status(500).json({ error: err.message });
  }
};
