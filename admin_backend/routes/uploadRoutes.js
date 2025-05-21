const express = require("express");
const router = express.Router();
const uploadController = require("../controllers/uploadController");
const multer = require("multer");
const { azureStorage } = require("../utils/azureStorage");

// Setup multer with Azure
const upload = multer({ storage: azureStorage });

// Protected routes
router.post("/upload", upload.array("files"), uploadController.uploadFiles);
router.post("/upload/metadata", uploadController.uploadMetadata);
router.post("/files", uploadController.getUserFiles);
router.delete("/files/delete", uploadController.deleteMetadataAndFile);
router.post("/files/update", uploadController.updateMetadata);

module.exports = router;