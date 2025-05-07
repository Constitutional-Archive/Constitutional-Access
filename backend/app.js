const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

// ✅ Import your Auth0 routes
const auth0Routes = require('./routes/auth0');

// ✅ Middlewares
app.use(cors());
app.use(bodyParser.json());

// ✅ Mount the auth0 API routes
app.use('/api/auth0', auth0Routes);

// ✅ Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
