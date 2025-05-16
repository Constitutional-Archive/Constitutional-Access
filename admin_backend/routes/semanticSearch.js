const express = require('express');
const router = express.Router();
const { BlobServiceClient } = require('@azure/storage-blob');
const pdfParse = require('pdf-parse');
const axios = require('axios');
const OpenAI = require('openai');
const NodeCache = require('node-cache');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const cache = new NodeCache({ stdTTL: 3600 }); // 1 hour cache

// Azure blob reader
const getAllBlobsFromAzure = async () => {
  const blobServiceClient = new BlobServiceClient(
    `https://${process.env.ACCOUNT_NAME}.blob.core.windows.net?${process.env.SAS_TOKEN}`
  );
  const containerClient = blobServiceClient.getContainerClient(process.env.CONTAINER_NAME);

  const files = [];
  for await (const blob of containerClient.listBlobsFlat()) {
    if (blob.name.endsWith('.pdf')) {
      const url = `https://${process.env.ACCOUNT_NAME}.blob.core.windows.net/${process.env.CONTAINER_NAME}/${blob.name}?${process.env.SAS_TOKEN}`;
      files.push({ name: blob.name, url });
    }
  }

  return files;
};

// Cosine similarity
const cosineSimilarity = (vecA, vecB) => {
  const dot = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dot / (magA * magB);
};

// Timeout helper
const timeoutPromise = (ms) => new Promise((_, reject) =>
  setTimeout(() => reject(new Error("Timeout")), ms)
);

// Main route
router.get('/semantic-search', async (req, res) => {
  const query = req.query.query;
  if (!query) return res.status(400).json({ error: 'Query is required' });

  const cached = cache.get(query);
  if (cached) return res.json(cached);

  try {
    const files = await getAllBlobsFromAzure();

    const queryEmbedding = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: query
    });

    const searchPromise = Promise.all(
      files.map(async (file) => {
        try {
          const response = await axios.get(file.url, { responseType: 'arraybuffer' });
          const pdfText = (await pdfParse(response.data)).text;
          const snippet = pdfText.slice(0, 2000);

          const docEmbedding = await openai.embeddings.create({
            model: "text-embedding-ada-002",
            input: snippet
          });

          const score = cosineSimilarity(
            queryEmbedding.data[0].embedding,
            docEmbedding.data[0].embedding
          );

          return {
            fileName: file.name,
            url: file.url,
            preview: snippet.slice(0, 300),
            score
          };
        } catch (e) {
          console.warn(`⚠️ Skipping ${file.name}: ${e.message}`);
          return null;
        }
      })
    );

    const results = await Promise.race([
      searchPromise,
      timeoutPromise(15000) // ⏰ Increased to 15 seconds
    ]);

    const filtered = results.filter(Boolean);
    const uniqueResults = new Map();

    for (const doc of filtered) {
      if (!uniqueResults.has(doc.fileName) || uniqueResults.get(doc.fileName).score < doc.score) {
        uniqueResults.set(doc.fileName, doc);
      }
    }

    const sorted = Array.from(uniqueResults.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, 3); // return top 3 most relevant

    cache.set(query, sorted);
    res.json(sorted);
  } catch (err) {
    if (err.message === 'Timeout') {
      return res.status(408).json({ error: 'Timeout' });
    }
    console.error('🔥 Semantic search error:', err);
    res.status(500).json({ error: 'Something went wrong during semantic search' });
  }
});

module.exports = router;
