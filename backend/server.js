require('dotenv').config();

if (!process.env.AUTH0_DOMAIN) {
  console.error('AUTH0_DOMAIN is not defined in .env');
}
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth0'); // ✅ we only need this


const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth0', authRoutes); // ✅ this handles all user + role routes

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
