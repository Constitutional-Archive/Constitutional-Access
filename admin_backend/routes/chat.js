const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
const axios = require('axios');
const pdfParse = require('pdf-parse'); // npm install pdf-parse


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];

const isImageUrl = (url) => {
  if (!url) return false;

  // Check if url contains container name, else return false early
  const parts = url.split(`files/`);

  // Extract the blob name before query params, safely handle missing parts
  const blobNameWithQuery = parts[1] || '';
  const blobName = decodeURI(blobNameWithQuery.split('?')[0] || '');

  return imageExtensions.some(ext => blobName.toLowerCase().endsWith(ext));
};

router.post('/chat-with-doc', async (req, res) => {
    const { fileUrl, history } = req.body;
    console.log('📥 Incoming request with fileUrl:', fileUrl);
  
    try {

      if (isImageUrl(fileUrl)) {
        // For images, you might just return a message or handle differently
        return res.json({ reply: "This file is an image. Chatting on image content is not supported." });
      }
      // ✅ Step 1: Download the PDF from Azure blob
      const response = await axios.get(fileUrl, { responseType: 'arraybuffer' });
  
      // ✅ Step 2: Extract text from the PDF
      const pdfData = await pdfParse(response.data);
      const content = pdfData.text.slice(0, 4000); // Limit for token safety (adjust as needed)
  
      // ✅ Step 3: Send to OpenAI
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: `You are an AI assistant. Use this document to help the user:\n\n${content}` },
          ...history,
        ],
      });
  
      const reply = completion.choices[0].message.content;
      console.log('🤖 OpenAI reply:', reply);
      res.json({ reply });
    } catch (err) {
      console.error('❌ Error during chat-with-doc:', err.response?.data || err.message);
      res.status(500).json({ error: 'Failed to process document for chat.' });
    }
  });
  

module.exports = router;
