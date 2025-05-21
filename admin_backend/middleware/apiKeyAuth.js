require('dotenv').config();

const allowedOrigins = [
  'https://salmon-pond-060a97a10.6.azurestaticapps.net',
  'http://localhost:3000',
];

module.exports = function apiKeyAuth(req, res, next) {
    const origin = req.headers.origin;
    const clientKey = req.headers['x-api-key'] || req.query.api_key;
    const validKey = process.env.API_KEY;

    if (allowedOrigins.includes(origin)) {
        return next();
    }

    if (clientKey && clientKey === validKey) {
        next(); // API key is valid
    } else {
        res.status(401).json({ error: "Unauthorized – Invalid or missing API key" });
    }
};
