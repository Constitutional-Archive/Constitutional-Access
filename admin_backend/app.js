require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const uploadRoutes = require("./routes/uploadRoutes");
const searchRoutes = require("./routes/search");

const app = express();

// CORS setup
const corsOptions = {
  origin: 'https://gray-flower-0a4bfd703.6.azurestaticapps.net',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

// Connect to MongoDB (only outside of test mode)
if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));
}

// Routes
app.use("/api", uploadRoutes);
app.use("/api/search", searchRoutes);

// Export app for server and testing
module.exports = app;

