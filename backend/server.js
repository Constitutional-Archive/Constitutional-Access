
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth0'); // ✅ we only need this


const app = express();
app.use(cors());
app.use(express.json());


app.use('/api/auth0', authRoutes); // ✅ this handles all user + role routes

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
