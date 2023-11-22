// config/jwt.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

const secretKey = process.env.JWT_SECRET;

const jwtSecret = secretKey;

module.exports = {
    generateToken: (payload) => jwt.sign(payload, jwtSecret, { expiresIn: '2h' }),
};