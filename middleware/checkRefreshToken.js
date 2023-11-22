const jwt = require('jsonwebtoken');
const TokenBlacklist = require('../models/tokenBlacklist');

module.exports = async(req, res, next) => {
    try {
        const refreshToken = req.body.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({ error: 'Refresh token not provided' });
        }

        // Check if the refresh token is in the blacklist
        const blacklistedToken = await TokenBlacklist.findOne({ token: refreshToken });

        if (blacklistedToken) {
            return res.status(401).json({ error: 'Refresh token is blacklisted' });
        }

        // Verify if the refresh token is valid
        const decodedToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        // You can add additional checks here, such as verifying against user-specific data

        req.user = decodedToken; // Attach the decoded token to the request for later use in routes
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid refresh token' });
    }
};