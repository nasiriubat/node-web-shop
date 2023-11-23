const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    total_price: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'approved', 'canceled', 'delivered'], default: 'pending' },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    orderItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'OrderItem' }]
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;