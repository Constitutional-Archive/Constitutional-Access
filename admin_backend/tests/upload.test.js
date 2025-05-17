const request = require('supertest');
const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const app = express();
app.use(express.json());

// Setup multer for handling file uploads in-memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Mock in-memory storage
const uploadedFiles = [];
const uploadedMetadata = [];

// Simulated /api/upload route
app.post('/api/upload', upload.array('files'), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No files uploaded' });
  }

  const fileUrls = req.files.map(file => ({
    originalname: file.originalname,
    url: `http://localhost/uploads/${file.originalname}`,
  }));

  uploadedFiles.push(...fileUrls);

  res.status(200).json({
    message: 'Files uploaded successfully',
    files: req.files,
    fileUrls: fileUrls.map(f => f.url),
  });
});

// Simulated /api/upload/metadata route
app.post('/api/upload/metadata', (req, res) => {
  const { fileName, description, category, uploadedBy, tags, fileUrl } = req.body;

  if (!fileName || !fileUrl) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  const newMetadata = {
    id: (uploadedMetadata.length + 1).toString(),
    fileName,
    description,
    category,
    uploadedBy,
    tags,
    fileUrl,
    uploadedAt: new Date(),
  };

  uploadedMetadata.push(newMetadata);

  res.status(201).json({ message: 'Metadata saved', metadata: newMetadata });
});

describe('POST /api/upload', () => {
  it('should successfully upload a file', async () => {
    const filePath = path.resolve(__dirname, 'testfile.txt');

    // Make sure the test file exists
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, 'Dummy content');
    }

    const res = await request(app)
      .post('/api/upload')
      .attach('files', filePath)
      .set('Content-Type', 'multipart/form-data');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Files uploaded successfully');
    expect(Array.isArray(res.body.fileUrls)).toBe(true);
    expect(res.body.fileUrls.length).toBeGreaterThan(0);
  });

  it('should successfully upload metadata', async () => {
    const metadata = {
      fileName: 'testfile.txt',
      description: 'This is a test file',
      category: 'Documents',
      uploadedBy: 'Test User',
      tags: ['test', 'file'],
      fileUrl: 'http://localhost/uploads/testfile.txt',
    };

    const res = await request(app)
      .post('/api/upload/metadata')
      .send(metadata)
      .set('Content-Type', 'application/json');

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message', 'Metadata saved');
    expect(res.body.metadata).toHaveProperty('fileName', 'testfile.txt');
    expect(res.body.metadata).toHaveProperty('fileUrl', 'http://localhost/uploads/testfile.txt');
  });

  it('should handle missing file upload', async () => {
    const res = await request(app)
      .post('/api/upload');

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'No files uploaded');
  });

  it('should handle missing metadata fields', async () => {
    const res = await request(app)
      .post('/api/upload/metadata')
      .send({})
      .set('Content-Type', 'application/json');

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Missing fields');
  });
});
