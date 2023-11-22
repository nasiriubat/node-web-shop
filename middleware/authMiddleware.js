const jwt = require('jsonwebtoken');
const TokenBlacklist = require('../models/tokenBlacklist');


const { validate } = require('jsonschema');
const User = require('../models/user');
require('dotenv').config();

exports.authenticateToken = async(req, res, next) => {

    const token = req.headers['authorization'] ? req.headers['authorization'].replace('Bearer ', '') : null;
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const isTokenBlacklisted = await TokenBlacklist.exists({ token });

    if (isTokenBlacklisted) {
        return res.status(401).json({ error: 'Token Expired' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid Token' });
        }
        req.user = decoded;
        next();
    });
};

exports.isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized: Admin access required' });
    }
    next();
};

exports.isCustomer = (req, res, next) => {
    if (req.user.role !== 'customer') {
        return res.status(403).json({ error: 'Unauthorized: Customer access required' });
    }
    next();
};

exports.validateRegistration = (userData) => {
    const schema = {
        type: 'object',
        properties: {
            name: { type: 'string' },
            phone: { type: 'string' },
            email: { type: 'string', format: 'email' },
            password: { type: 'string' },
            role: { type: 'string', enum: ['admin', 'customer'] },
        },
        required: ['name', 'phone', 'email', 'password', 'role'],
    };

    const result = validate(userData, schema);
    // const errorMsg = [];

    if (!result.valid) {
        const errorMsg = result.errors.map((error) => error.stack).join('\n')
        return { status: false, error: errorMsg }
    }
    return { status: true, error: [] };

};

exports.validateLogin = (userData) => {
    const schema = {
        type: 'object',
        properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string' },
        },
        required: ['email', 'password'],
    };

    const result = validate(userData, schema);

    if (!result.valid) {
        const errorMsg = result.errors.map((error) => error.stack).join('\n')
        return { status: false, error: errorMsg }
    }
    return { status: true, error: [] };
};