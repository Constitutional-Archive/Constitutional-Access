const express = require('express');
const router = express.Router();
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const mime = require('mime-types');
const FormData = require('form-data');
const pdfParse = require('pdf-parse');
const OpenAI = require('openai');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const os = require('os');

ffmpeg.setFfmpegPath(ffmpegPath);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];

const isImageUrl = (url) => {
  if (!url) return false;
  const parts = url.split(`files/`);
  const blobNameWithQuery = parts[1] || '';
  const blobName = decodeURI(blobNameWithQuery.split('?')[0] || '');
  return imageExtensions.some(ext => blobName.toLowerCase().endsWith(ext));
};

// 🔊 Trims audio to multiple durations until under 25MB, then transcribes
async function transcribeAudio(originalFilePath) {
  const trimmedPath = path.join(os.tmpdir(), 'trimmed.mp3');
  const durations = [30, 20, 10, 5]; // smaller durations to ensure under 25MB

  for (let duration of durations) {
    try {
      console.log(`⏱️ Trying trim: ${duration}s`);
      await new Promise((resolve, reject) => {
        ffmpeg(originalFilePath)
          .setStartTime(0)
          .duration(duration)
          .output(trimmedPath)
          .on('end', resolve)
          .on('error', reject)
          .run();
      });

      const fileSize = fs.statSync(trimmedPath).size;
      console.log(`📦 Trimmed to ${duration}s: ${fileSize} bytes`);

      if (fileSize <= 25 * 1024 * 1024) {
        const formData = new FormData();
        formData.append('file', fs.createReadStream(trimmedPath));
        formData.append('model', 'whisper-1');

        const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', formData, {
          headers: {
            ...formData.getHeaders(),
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
        });

        fs.unlinkSync(trimmedPath);
        console.log('✅ Transcription successful:', response.data.text.slice(0, 100));
        return response.data.text;
      } else {
        console.warn(`⚠️ Still too large after ${duration}s`);
      }
    } catch (err) {
      console.warn(`❌ Error trimming at ${duration}s:`, err.message);
    }
  }

  throw new Error('Unable to trim audio under 25MB');
}

router.post('/chat-with-doc', async (req, res) => {
  const { fileUrl, history } = req.body;
  console.log('📥 Received request with fileUrl:', fileUrl);

  try {
    if (isImageUrl(fileUrl)) {
      return res.json({ reply: 'This file is an image. Chatting on image content is not supported.' });
    }

    const response = await axios.get(fileUrl, { responseType: 'arraybuffer' });
    const contentType = response.headers['content-type'] || mime.lookup(fileUrl);
    const fileExt = mime.extension(contentType);
    const tempFilePath = path.join(__dirname, `tempfile.${fileExt}`);
    fs.writeFileSync(tempFilePath, response.data);

    let extractedText = '';

    if (contentType.includes('pdf')) {
      const pdfData = await pdfParse(response.data);
      extractedText = pdfData.text.slice(0, 4000);
    } else if (contentType.startsWith('audio') || /\.(mp3|m4a|wav|webm|ogg)$/i.test(fileUrl)) {
      console.log('🎤 Processing audio...');
      try {
        extractedText = await transcribeAudio(tempFilePath);
      } catch (transcribeError) {
        fs.unlinkSync(tempFilePath);
        return res.status(400).json({ error: 'Audio file is too large to transcribe.' });
      }
    } else {
      fs.unlinkSync(tempFilePath);
      return res.status(400).json({ error: 'Unsupported file type' });
    }

    fs.unlinkSync(tempFilePath); // Cleanup

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: `Use this transcribed content to help the user:\n\n${extractedText}` },
        ...history,
      ],
    });

    const reply = completion.choices[0].message.content;
    console.log('🤖 GPT reply:', reply);
    res.json({ reply });
  } catch (error) {
    console.error('❌ Error during chat-with-doc:', error);
    res.status(500).json({ error: error.message || 'Failed to process document or audio.' });
  }
});

module.exports = router;
