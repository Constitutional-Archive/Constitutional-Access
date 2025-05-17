const express = require('express');
const router = express.Router();
const { BlobServiceClient } = require('@azure/storage-blob');
const pdfParse = require('pdf-parse');
const axios = require('axios');
const OpenAI = require('openai');
const NodeCache = require('node-cache');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const cache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour

// Fetch all blobs with metadata
const getAllBlobsFromAzure = async () => {
  const blobServiceClient = new BlobServiceClient(
    `https://${process.env.ACCOUNT_NAME}.blob.core.windows.net?${process.env.SAS_TOKEN}`
  );
  const containerClient = blobServiceClient.getContainerClient(process.env.CONTAINER_NAME);
  const files = [];

  for await (const blob of containerClient.listBlobsFlat({ includeMetadata: true })) {
    const url = `https://${process.env.ACCOUNT_NAME}.blob.core.windows.net/${process.env.CONTAINER_NAME}/${blob.name}?${process.env.SAS_TOKEN}`;
    files.push({
      name: blob.name,
      url,
      contentType: blob.properties?.contentType || '',
      metadata: blob.metadata || {},
    });
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

// Semantic Search Endpoint
router.get('/semantic-search', async (req, res) => {
  const query = req.query.query;
  const requestedType = (req.query.filter || 'all').toLowerCase();
  const rawCategoryString = req.query.categories || '';
const requestedCategories = rawCategoryString
  .split(',')
  .map(c => c.trim().toLowerCase())
  .filter(Boolean);

 const cacheKey = `${query.toLowerCase()}|${requestedType}|${requestedCategories.join('+')}`;

  if (!query) return res.status(400).json({ error: 'Query is required' });


console.log(`🔍 Query: ${query}`);
console.log(`📂 Filter (type): ${requestedType}`);
console.log(`🏷️  Categories: ${requestedCategories.join(', ') || '[none]'}`);
console.log(`🧠 Cache Key: ${cacheKey}`);
const cached = cache.get(cacheKey);
  console.log(`🔍 Query: ${query}, Filter: ${requestedType}, Cache Key: ${cacheKey}`);
  if (cached) return res.json(cached);

  try {
    const files = await getAllBlobsFromAzure();

    // Extract simplified query
    const extract = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: `Extract the key concept from this query: "${query}". Respond with only the concept.`
        }
      ]
    });

    const simplifiedQuery = extract.choices[0].message.content.trim().toLowerCase();

    const queryEmbedding = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: simplifiedQuery
    });

    const results = await Promise.all(
      files.map(async (file) => {
        try {
          const name = file.name.toLowerCase();
        
          const description = (file.metadata?.description || '').toLowerCase();
          const extension = file.name.split('.').pop().toLowerCase();

          const extensionMap = {
            pdf: 'pdf',
            doc: 'pdf', docx: 'pdf', txt: 'pdf',
            jpg: 'image', jpeg: 'image', png: 'image', gif: 'image', svg: 'image', webp: 'image',
            mp3: 'audio', wav: 'audio', m4a: 'audio',
            mp4: 'video', avi: 'video', mov: 'video', mkv: 'video',
          };
          // Filter out files that don't start with any of the selected categories
        const pathPrefix = file.name.toLowerCase().split('/')[0];

const matchesCategory = requestedCategories.length === 0 || 
  requestedCategories.some(cat => pathPrefix === cat);

if (!matchesCategory) {
  console.log(`❌ Skipping ${file.name} - '${pathPrefix}' does not match any of: ${requestedCategories.join(', ')}`);
  return null;
}

        




          const typeCategory = extensionMap[extension] || 'other';

          if (requestedType !== 'all' && typeCategory !== requestedType) {
            return null;
          }

          let content = `${name} ${description}`;
          let source = 'meta';

          if (extension === 'pdf') {
            const response = await axios.get(file.url, { responseType: 'arraybuffer' });
            const pdfText = (await pdfParse(response.data)).text;
            content += ` ${pdfText}`;
            source = 'pdf';
          }

          const docEmbedding = await openai.embeddings.create({
            model: 'text-embedding-ada-002',
            input: content.slice(0, 3000)
          });

          const score = cosineSimilarity(
            queryEmbedding.data[0].embedding,
            docEmbedding.data[0].embedding
          );

          const directMatch = content.includes(simplifiedQuery) || content.includes(query.toLowerCase());

          if (score > 0.50 || directMatch) {
            return {
              fileName: file.name,
              url: file.url,
              preview: content.slice(0, 350),
              score,
              source,
              type: extension
            };
          }

          return null;
        } catch (err) {
          console.warn(`⚠️ Skipped ${file.name}:`, err.message);
          return null;
        }
      })
    );

    const valid = results.filter(Boolean);

    const uniqueMap = new Map();
    for (const doc of valid) {
      if (!uniqueMap.has(doc.fileName) || uniqueMap.get(doc.fileName).score < doc.score) {
        uniqueMap.set(doc.fileName, doc);
      }
    }

    const sorted = Array.from(uniqueMap.values())
      .sort((a, b) => {
        if (a.fileName.includes('saconstitution-web-eng.pdf')) return -1;
        if (b.fileName.includes('saconstitution-web-eng.pdf')) return 1;
        return b.score - a.score;
      })
      .slice(0, 10);

    // AI-generated answer
    let aiAnswer = '';
    const combinedText = sorted.map(doc => doc.preview).join('\n\n').slice(0, 4000);

    if (combinedText.length > 10) {
      const chat = await openai.chat.completions.create({
        model: 'gpt-4-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful assistant that explains South African legal and constitutional documents clearly.' },
          { role: 'user', content: `Answer the following based on this text:\n\n${combinedText}\n\nQuestion: ${query}` }
        ]
      });

      aiAnswer = chat.choices[0].message.content.trim();
    }

    const response = { answer: aiAnswer, results: sorted };
    cache.set(cacheKey, response); // ✅ set after response is defined
    res.json(response);

  } catch (err) {
    console.error('❌ Semantic search failed:', err.message);
    res.status(500).json({ error: 'Semantic search failed' });
  }
});

module.exports = router;
