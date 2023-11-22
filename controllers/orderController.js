const Order = require('../models/order');
const { isCustomer, isAdmin } = require('../middleware/authMiddleware');

exports.placeOrder = async(req, res) => {
    try {
        const { product_ids, total_price, status } = req.body;
        const userId = req.user.user_id;

        // Check if the user is a customer
        isCustomer(req.user);

        const order = new Order({
            user_id: userId,
            product_ids,
            total_price,
            status,
            order_id: generateOrderId(), // You need to implement a function to generate a unique order ID
        });

        await order.save();

        res.status(201).json({ message: 'Order placed successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getUserOrders = async(req, res) => {
    try {
        const userId = req.user.user_id;

        // Check if the user is the owner or an admin
        if (req.user.user_id !== userId && !isAdmin(req.user)) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        const orders = await Order.find({ user_id: userId });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getAllOrders = async(req, res) => {
    try {
        // Check if the user is an admin
        isAdmin(req.user);

        const orders = await Order.find();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getOrderDetails = async(req, res) => {
    try {
        const orderId = req.params.orderId;

        const order = await Order.findOne({ order_id: orderId });
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.editOrder = async(req, res) => {
    try {
        // Check if the user is an admin
        isAdmin(req.user);

        const orderId = req.params.orderId;
        const { product_ids, total_price, status } = req.body;

        // Update order details
        await Order.findOneAndUpdate({ order_id: orderId }, {
            $set: {
                product_ids,
                total_price,
                status,
                updated_at: Date.now(),
            },
        });

        res.json({ message: 'Order updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};