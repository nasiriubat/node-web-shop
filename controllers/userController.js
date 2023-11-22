const User = require('../models/user');
const { userRequest } = require('../utils/customValidator')
const { isBlank } = require('../utils/index')
const { isAdmin } = require('../middleware/authMiddleware');

exports.getAllUsers = async(req, res) => {
    try {

        const users = await User.find({}, '-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.createUser = async(req, res) => {
    try {
        // Check if the user is an admin
        isAdmin(req.user);

        const { name, phone, email, password, role, user_id } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            phone,
            email,
            password: hashedPassword,
            role,
            user_id,
        });

        await user.save();

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.showUser = async(req, res) => {
    try {
        const userId = req.params.userId;

        // Check if the user is the owner or an admin
        if (req.user.user_id == userId) {
            res.status(403).json({ error: 'Forbidden' });
        }

        const user = await User.findOne({ _id: userId }, '-password');
        if (!user) {
            res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.editUser = async(req, res) => {
    const errors = userRequest(req.body);
    console.log(errors)
    if (!isBlank(errors)) {
        res.status(400).json(errors);
    } else {
        try {
            const userId = req.params.userId;
            const { name, phone, password, role } = req.body;

            await User.findOneAndUpdate({ _id: userId }, {
                $set: {
                    name,
                    phone,
                    role,
                    ...(password && { password: await bcrypt.hash(password, 10) }),
                    updated_at: Date.now(),
                },
            });

            res.json({ message: 'User updated successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};

exports.deleteUser = async(req, res) => {
    try {
        const userId = req.params.userId;
        await User.findOneAndDelete({ _id: userId });
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};