const { checkAdmin, isBlank, getProduct, delayedData } = require('../utils/index');
const Order = require('../models/order');
const OrderItem = require('../models/orderItem');
const Product = require('../models/product');
const User = require('../models/user');

exports.placeOrder = async(req, res) => {
    try {
        const { user_id, products } = req.body;
        if (isBlank(products) || products.length === 0) {
            return res.status(400).json({ message: 'Add products to place an order' });
        }

        const productPrices = await Product.find({ _id: { $in: products.map(product => product.product_id) } });
        const productPriceMap = new Map(productPrices.map(product => [product._id.toString(), product.price]));

        const total_price = products.reduce((total, product) => {
            const price = productPriceMap.get(product.product_id.toString());
            return total + (price ? price * product.quantity : 0);
        }, 0);

        const newOrder = new Order({
            user_id,
            total_price,
            status: 'pending'
        });

        const savedOrder = await newOrder.save();

        const orderItems = products.map(async(product) => {
            const orderItem = new OrderItem({
                order_id: savedOrder._id,
                product_id: product.product_id,
                price: productPriceMap.get(product.product_id.toString()),
                quantity: product.quantity
            });
            return await orderItem.save();
        });

        await Promise.all(orderItems);

        res.status(201).json({ message: 'Order placed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json(error.message);
    }
};


exports.getUserOrders = async(req, res) => {
    try {
        const user_id = req.user.user_id;
        const userOrders = await Order.find({ user_id }).sort({ created_at: 'desc' });
        const totalOrders = userOrders.length;
        const pendingOrders = userOrders.filter(order => order.status === 'Pending').length;
        const approvedOrders = userOrders.filter(order => order.status === 'Approved').length;
        const canceledOrders = userOrders.filter(order => order.status === 'Canceled').length;
        const deliveredOrders = userOrders.filter(order => order.status === 'Delivered').length;
        const summaryResponse = {
            totalOrders,
            pendingOrders,
            approvedOrders,
            canceledOrders,
            deliveredOrders,
            orders: userOrders.map(order => ({
                order_id: order._id,
                status: order.status,
                total_price: order.total_price,
                totalProducts: order.orderItems.length
            }))
        };

        res.status(200).json(summaryResponse);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.getAllOrders = async(req, res) => {
    try {
        const allOrders = await Order.find().sort({ created_at: 'desc' }).populate('orderItems');

        const summaryResponse = {
            totalOrders: allOrders.length,
            orders: allOrders.map(async order => {
                const user = await User.findOne({ _id: order.user_id }); // Fetch user details

                return {
                    order_id: order._id,
                    status: order.status,
                    total_price: order.total_price,
                    totalProducts: order.orderItems.length,
                    user: {
                        name: user.name,
                        email: user.email,
                        phone: user.phone,
                        address: user.address // Adjust this based on your User model fields
                    }
                };
            })
        };

        res.status(200).json(summaryResponse);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getOrderDetails = async(req, res) => {
    try {

        const order_id = req.params.order_id;
        const user_id = req.user.user_id;

        let order = '';
        if (checkAdmin(req)) {
            order = await Order.findOne({ _id: order_id }).populate('orderItems');
        } else {
            order = await Order.findOne({ user_id, _id: order_id }).populate('orderItems');
        }


        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        const user = await User.findOne({ _id: order.user_id });
        const allOrderItems = await OrderItem.find({ order_id: order._id });

        const jsonOrderItems = await Promise.all(
            allOrderItems.map(async(item) => {
                const product = await Product.findOne({ _id: item.product_id })
                return {
                    name: product.name,
                    unit_price: item.price,
                    quantity: item.quantity,
                    total_price: item.price * item.quantity
                };
            }))

        // const jsonOrderItems = await delayedData(allOrderItems, Product, 'product_id');
        const detailedResponse = {
            order_id: order._id,
            total_price: order.total_price,
            totalProducts: allOrderItems.length,
            order_date: order.created_at,
            status: order.status,
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address,
            products: jsonOrderItems
        };

        res.status(200).json(detailedResponse);
    } catch (error) {
        console.error(error);
        res.status(500).json(error.message);
    }
};

exports.getUserOrdersByStatus = async(req, res) => {
    try {
        const user_id = req.user.user_id;
        const { status } = req.params;
        let allOrders = '';

        if (checkAdmin(req)) {
            allOrders = await Order.find({ status }).sort({ created_at: 'desc' }).populate('orderItems');
        } else {
            allOrders = await Order.find({ user_id, status }).sort({ created_at: 'desc' }).populate('orderItems');
        }

        const ordersWithUserData = await Promise.all(
            allOrders.map(async(order) => {
                let user = await User.findOne({ _id: order.user_id });
                console.log(order.orderItems); // Log orderItems for debugging
                return {
                    order_id: order._id,
                    total_price: order.total_price,
                    // totalProducts: order.orderItems.length,
                    order_date: order.created_at,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    address: user.address,
                };
            })
        );

        const jsonResponse = {
            totalOrders: ordersWithUserData.length,
            status,
            orders: ordersWithUserData,
        };

        res.status(200).json(jsonResponse);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.updateStatus = async(req, res) => {
    try {
        const { order_id, new_status } = req.body;
        if (isBlank(order_id, true)) {
            return res.status(400).json({ error: 'valid order_id Required' });
        }
        if (isBlank(new_status, false)) {
            return res.status(400).json({ error: 'new_status field Required' });
        }

        const allowedStatusValues = ['pending', 'approved', 'canceled', 'delivered'];
        if (!allowedStatusValues.includes(new_status)) {
            return res.status(400).json({ error: 'Invalid status value' });
        }

        const order = await Order.findOne({ _id: order_id }).populate('orderItems');
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        order.status = new_status;
        order.updated_at = new Date();
        await order.save();

        res.status(200).json({ message: 'Order status updated successfully', updatedOrder: order });
    } catch (error) {
        console.error(error);
        res.status(500).json(error.message);
    }
};