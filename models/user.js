const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: function(value) {
                return isEmailUnique(value, this.model('User'), this._id);
            },
            message: 'Email address must be unique.',
        },
    },
    password: { type: String, required: true, trim: true },
    role: { type: String, enum: ['admin', 'customer'], default: 'customer', trim: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
});

function isEmailUnique(email, UserModel, userId) {
    return UserModel.findOne({ email: email, _id: { $ne: userId } })
        .then(user => !user);
}

const User = mongoose.model('User', userSchema);

module.exports = User;