// --- Updated backend route: routes/search.js ---
const express = require("express");
const router = express.Router();
const axios = require("axios");
const Metadata = require("../models/Metadata");

// Encode safely for URLs
const encode = str => encodeURIComponent(str);

// SEMANTIC SEARCH fallback route
router.get("/semantic", async (req, res) => {
  const { query } = req.query;
  if (!query) return res.status(400).json({ error: "Missing search query." });

  try {
    const response = await axios.get(`http://localhost:5000/api/semantic-search?query=${encode(query)}`);
    return res.json(response.data);
  } catch (err) {
    console.error("Semantic search failed:", err.message);
    return res.status(500).json({ error: "Semantic search error" });
  }
});

// Default Mongo keyword search
router.get("/", async (req, res) => {
  try {
    const { q, category } = req.query;
    const query = {};

    if (q && q.trim() !== "") {
      const searchRegex = { $regex: q, $options: "i" };
      query.$or = [
        { fileName: searchRegex },
        { description: searchRegex },
        { uploadedBy: searchRegex }
      ];
    }

    if (category && category.trim() !== "") {
      query.category = category;
    }

    const results = await Metadata.find(query).sort({ uploadedAt: -1 }).limit(50);

    const formattedResults = results.map(doc => {
      const fileUrl = doc.fileUrl;
      if (!fileUrl || typeof fileUrl !== "string" || fileUrl.includes("undefined")) return null;

      const encodedPath = encode(fileUrl);

      return {
        id: doc._id,
        title: doc.fileName || "Untitled",
        excerpt: doc.description || "No description available",
        type: doc.category || "Unknown",
        relevance: `${Math.floor(Math.random() * 21) + 80}%`,
        fileUrl: `${process.env.REACT_APP_SEARCH_BACKEND_URL}/api/search/download?path=${encodeURIComponent(doc.fileUrl)}`,
        uploadedAt: doc.uploadedAt,
      };
    }).filter(item => item !== null);

    res.json(formattedResults);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Download redirect
router.get("/download", async (req, res) => {
  try {
    const { path } = req.query;
    if (!path) return res.status(400).send("Missing file path.");

    const blobPath = decodeURIComponent(path);
    const blobUrl = `https://${process.env.ACCOUNT_NAME}.blob.core.windows.net/${process.env.CONTAINER_NAME}/${blobPath}?${process.env.SAS_TOKEN}`;

    return res.redirect(blobUrl);
  } catch (err) {
    console.error("Redirect download error:", err.message);
    res.status(500).send("Failed to redirect to file.");
  }
});

module.exports = router;
