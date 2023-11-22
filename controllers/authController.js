const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const TokenBlacklist = require('../models/tokenBlacklist');
const { validateRegistration, validateLogin } = require('../middleware/authMiddleware');
const { generateToken } = require('../config/jwt');
const { organizeError } = require('../utils/index');


exports.register = async(req, res) => {
    try {
        const { name, phone, email, password, role } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            phone,
            email,
            password: hashedPassword,
            role
        });

        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json(error.message);
        // res.status(500).json(organizeError(error.message));
    }
};

exports.login = async(req, res) => {
    try {
        const { email, password } = req.body;
        // Validate input data
        let isValid = validateLogin(req.body);
        if (!isValid.status) {
            res.status(500).json(isValid.error);

        }

        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = generateToken({ user_id: user._id, role: user.role });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getProfile = async(req, res) => {
    try {
        const user = await User.findOne({ _id: req.user.user_id }, '-password');
        res.status(200).json(user)

    } catch (error) {

    }
}

exports.editProfile = async(req, res) => {
    try {
        const { name, phone, password } = req.body;
        const userId = req.user.user_id;
        // Update user profile
        await User.findOneAndUpdate({ _id: userId }, {
            $set: {
                name,
                phone,
                ...(password && { password: await bcrypt.hash(password, 10) }),
                updated_at: Date.now(),
            },
        });

        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.logout = async(req, res) => {
    try {
        const token = req.headers['authorization'].replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const newToken = new TokenBlacklist({
            token
        });
        await newToken.save();

        res.json({ message: 'Logout successful' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.refreshToken = async(req, res) => {
    try {
        const refreshToken = req.body.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({ error: 'Refresh token not provided' });
        }

        // Verify if the refresh token is valid
        const decodedToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        // Check if the user exists and the refresh token is still valid
        const user = await User.findOne({ user_id: decodedToken.user_id });

        if (!user || !user.refreshTokens.includes(refreshToken)) {
            return res.status(401).json({ error: 'Invalid refresh token' });
        }

        // Generate a new access token
        const newAccessToken = generateToken({ user_id: decodedToken.user_id, role: decodedToken.role });

        res.json({ accessToken: newAccessToken });
    } catch (error) {
        res.status(401).json({ error: 'Invalid refresh token' });
    }
};