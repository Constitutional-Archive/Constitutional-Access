const Metadata = require("../models/Metadata");
const { BlobServiceClient, StorageSharedKeyCredential } = require('@azure/storage-blob');

const accountName = process.env.ACCOUNT_NAME;
const accountKey = process.env.ACCESS_KEY;
const containerName = process.env.CONTAINER_NAME;

// Initialize Azure Blob Service Client and Container Client
const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
const containerClient = blobServiceClient.getContainerClient(process.env.CONTAINER_NAME);

// Helper function to delete blob from Azure Storage
const deleteBlob = async (fileUrl) => {
  try {
    // Extract blob name from URL
    const blobName = decodeURI(fileUrl
    .split(`${process.env.CONTAINER_NAME}/`)[1]
    ?.split('?')[0]);
    console.log("Blob name to delete:", blobName);
    const blobClient = containerClient.getBlobClient(blobName);
    await blobClient.delete();
    return true;
  } catch (err) {
    console.error('Error deleting blob:', err);
    throw new Error('Failed to delete file from storage');
  }
};

exports.uploadFiles = (req, res) => {
  console.log("Files received:", req.files);
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "No files uploaded" });
  }

  const fileUrls = req.files.map(file => file.url);

  res.status(200).json({
    message: "Files uploaded successfully",
    files: req.files,
    fileUrls: fileUrls,
  });
};

exports.uploadMetadata = async (req, res) => {
  try {
    const { fileName, description, fileSize, category, tags, fileUrl, uploadedBy } = req.body;
    const userEmail = uploadedBy; // From Auth0

    if (!fileUrl) {
      return res.status(400).json({ message: "No file URL provided" });
    }
    
    // Create and save metadata
    const newMeta = new Metadata({
      fileName,
      description,
      category,
      tags,
      fileUrl,
      fileSize,
      uploadedBy: userEmail,
      uploadedAt: new Date(),
    });


    console.log("Saving metadata:", newMeta);
    // Save metadata to MongoDB

    await newMeta.save();
    res.status(201).json({ 
      message: "Metadata saved", 
      metadata: newMeta 
    });
  } catch (err) {
    console.error("Error saving metadata:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get metadata without verification
exports.getMetadata = async (req, res) => {
  try {
    const { id } = req.params;
    const metadata = await Metadata.findById(id);
    
    if (!metadata) {
      return res.status(404).json({ message: "Metadata not found" });
    }

    res.status(200).json(metadata);
  } catch (err) {
    console.error("Error fetching metadata:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateMetadata = async (req, res) => {
  try {
    const { fileName, description, category } = req.body;
    const file = await Metadata.findById(req.body.id);

    if (!file) return res.status(404).json({ message: 'File not found' });

    // Update MongoDB
    file.fileName = fileName;
    file.description = description;
    file.category = category;

    await file.save();

    res.status(200).json(file);
  } catch (err) {
    console.error('Update failed:', err);
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
};


// Protected operations (require authentication)
exports.getUserFiles = async (req, res) => {
  try {
    const userEmail = req.body.email;

    if (!userEmail) {
      return res.status(400).json({ message: "Email is required" });
    }

    const files = await Metadata.find({ uploadedBy: userEmail }).sort({ uploadedAt: -1 });

    res.status(200).json(files);
  } catch (err) {
    console.error("Error fetching user files:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteMetadataAndFile = async (req, res) => {
  try {
    const id = req.body.id;
    const userEmail = req.body.email;


    console.log("Deleting file with ID:", id);
    // Verify ownership before deletion
    const fileMeta = await Metadata.findById(id);

    if (!fileMeta) {
      return res.status(404).json({ message: "File not found" });
    }
    if (fileMeta.uploadedBy !== userEmail) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Try to delete blob but continue even if it fails
    let blobDeleteSuccess = true;
    if (fileMeta.fileUrl) {
      try {
        console.log("Blob name to delete:", fileMeta.blobName);
        await deleteBlob(fileMeta.fileUrl);
      } catch (blobError) {
        blobDeleteSuccess = false;
        console.error("Error deleting blob (continuing with metadata deletion):", blobError.message);
      }
    }

    // Delete metadata from MongoDB
    const deletedFile = await Metadata.findByIdAndDelete(id);

    res.status(200).json({
      message: "File and metadata deleted successfully",
      metadata: deletedFile
    });
  } catch (err) {
    console.error("Error deleting file:", err);
    res.status(500).json({ error: err.message });
  }
};