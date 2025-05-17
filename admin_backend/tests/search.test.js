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

describe('Download route', () => {
  it('redirects to Azure blob URL when path is provided', async () => {
    process.env.ACCOUNT_NAME = 'fakeaccount';
    process.env.CONTAINER_NAME = 'fakecontainer';
    process.env.SAS_TOKEN = 'fakeSASToken';

    const testPath = 'some/file.pdf';
    const encodedPath = encodeURIComponent(testPath);

    const res = await request(app).get(`/api/search/download?path=${encodedPath}`);

    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe(
      `https://fakeaccount.blob.core.windows.net/fakecontainer/${testPath}?fakeSASToken`
    );
  });

  it('returns 400 if no path is provided', async () => {
    const res = await request(app).get('/api/search/download');
    expect(res.statusCode).toBe(400);
    expect(res.text).toBe('Missing file path.');
  });
});
