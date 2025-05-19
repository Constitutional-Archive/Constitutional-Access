const express = require('express');
const router = express.Router();
const Metadata = require('../models/Metadata'); // or your actual model path
const { BlobServiceClient } = require('@azure/storage-blob');
require('dotenv').config();

const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const containerName = process.env.CONTAINER_NAME; // set this to match your Azure container

const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
const containerClient = blobServiceClient.getContainerClient(containerName);

// POST a file
router.post('/', async (req, res) => {
  try {
    const file = new Metadata(req.body);
    await file.save();
    res.status(201).json(file);
  } catch (err) {
    res.status(500).json({ error: 'Upload failed', details: err.message });
  }
});

// GET all files
router.get('/', async (req, res) => {
  try {
    const files = await Metadata.find().sort({ uploadedAt: -1 });
    res.status(200).json(files);
  } catch (err) {
    res.status(500).json({ error: 'Fetch failed', details: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Metadata.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Metadata not found' });

    const blobPath = deleted.fileUrl; 
    const blockBlobClient = containerClient.getBlockBlobClient(blobPath);

    console.log("Deleting blob:", blobPath);

    await blockBlobClient.deleteIfExists();
    
    res.json({ message: 'Metadata deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { fileName, description, tags, category } = req.body;
    const file = await Metadata.findById(req.params.id);

    if (!file) return res.status(404).json({ message: 'File not found' });

    const oldBlobName = file.fileUrl; 
    const newBlobName = `${category}/${Date.now()}-${fileName}`;

    // Copy blob to new path
    const sourceBlobClient = containerClient.getBlobClient(oldBlobName);
    const targetBlobClient = containerClient.getBlobClient(newBlobName);

    await targetBlobClient.beginCopyFromURL(sourceBlobClient.url);
    await sourceBlobClient.deleteIfExists();

    // Update MongoDB
    file.fileName = fileName;
    file.description = description;
    file.tags = tags;
    file.category = category;
    file.fileUrl = newBlobName; // update fileUrl in DB

    await file.save();

    res.status(200).json(file);
  } catch (err) {
    console.error('Update failed:', err);
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
});



module.exports = router;
