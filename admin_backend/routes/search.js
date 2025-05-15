const express = require("express");
const router = express.Router();
const Metadata = require("../models/Metadata");

const encode = str => encodeURIComponent(str);

router.get("/", async (req, res) => {
  try {
    const { q, category } = req.query;
    const query = {};

    // Text search
    if (q && q.trim() !== "") {
      const searchRegex = { $regex: q, $options: "i" };
      query.$or = [
        { fileName: searchRegex },
        { description: searchRegex },
        { uploadedBy: searchRegex }
      ];
    }

    // Category filter
    if (category && category.trim() !== "") {
      query.category = category;
    }

    console.log("Executing query:", query);

    const results = await Metadata.find(query).sort({ uploadedAt: -1 }).limit(50);

    const formattedResults = results.map(doc => {
      const fileUrl = doc.fileUrl;

      // Validate fileUrl
      if (
        !fileUrl ||
        typeof fileUrl !== "string" ||
        fileUrl.includes("http") || // avoid full URLs
        fileUrl.includes("undefined")
      ) {
        console.log("Invalid fileUrl:", fileUrl);
        return null;
      }

      console.log("Found fileUrl:", fileUrl);
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

    console.log("Formatted results with valid fileUrl:", formattedResults.map(r => r.fileUrl));
    res.json(formattedResults);

  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/download", async (req, res) => {
  try {
    const { path } = req.query;
    if (!path) return res.status(400).send("Missing file path.");

    const blobPath = decodeURIComponent(path);
    console.log("Decoded blobPath:", blobPath);

    const blobUrl = `https://${process.env.ACCOUNT_NAME}.blob.core.windows.net/${process.env.CONTAINER_NAME}/${blobPath}`;
    return res.redirect(blobUrl);
  } catch (err) {
    console.error("Redirect download error:", err.message);
    res.status(500).send("Failed to redirect to file.");
  }
});

module.exports = router;
