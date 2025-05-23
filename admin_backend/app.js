require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const apiKeyAuth = require('./middleware/apiKeyAuth');

const semanticSearch = require('./routes/semanticSearch');

const uploadRoutes = require("./routes/uploadRoutes");
const searchRoutes = require("./routes/search");
const chatRoutes = require('./routes/chat');


const app = express();

// CORS setup
const corsOptions = {
  origin: [
    'https://happy-wave-077d83310.6.azurestaticapps.net', // deployed frontend URL
    'http://localhost:3000', // local frontend URL for development
    'https://searchback-guhvgzbmdkcudvf4.canadacentral-01.azurewebsites.net', // deployed backend URL
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'],
  credentials: true,
};

app.use(bodyParser.json());
app.use(cors(corsOptions));

app.use(apiKeyAuth); // API key authentication middleware

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
app.use("/api/chat", chatRoutes);
app.use('/api', semanticSearch);

// Export app for server and testing
module.exports = app;

