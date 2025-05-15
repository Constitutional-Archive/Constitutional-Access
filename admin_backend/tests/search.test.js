const request = require('supertest');
const express = require('express');
const searchRouter = require('../routes/search');
const Metadata = require('../models/Metadata');

// Mock the database
jest.mock('../models/Metadata');

const app = express();
app.use('/api/search', searchRouter);

describe('Search API', () => {
  beforeEach(() => {
    // Clear previous mocks
    jest.clearAllMocks();
  });

  it('returns 200 and mock search results', async () => {
    Metadata.find.mockImplementation(() => ({
      sort: () => ({
        limit: () => [
          {
            _id: '1',
            fileName: 'Mock File',
            description: 'A mock description',
            category: 'Mock Category',
            fileUrl: 'path/to/file.pdf',
            uploadedAt: new Date()
          }
        ]
      })
    }));

    const res = await request(app).get('/api/search?q=mock');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('title', 'Mock File');
  });
});
