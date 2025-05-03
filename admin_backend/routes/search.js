const express = require("express");
const router = express.Router();
const Metadata = require("../models/Metadata");

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

    // Category filter (exact match)
    if (category && category.trim() !== "") {
      query.category = category;
    }

    console.log("Executing query:", query);

    const results = await Metadata.find(query)
      .sort({ uploadedAt: -1 })
      .limit(50);

    const formattedResults = results.map(doc => ({
      id: doc._id,
      title: doc.fileName || "Untitled",
      excerpt: doc.description || "No description available",
      type: doc.category || "Unknown",
      fileUrl: doc.fileUrl || "",
      uploadedAt: doc.uploadedAt,
    }));

    res.json(formattedResults);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
