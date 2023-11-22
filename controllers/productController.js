const Product = require('../models/product');
const { isAdmin } = require('../middleware/authMiddleware');
const { validate } = require('jsonschema');
const { isBlank } = require('../utils/index');
const { productRequest } = require('../utils/customValidator');


exports.getAllProducts = async(req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.createProduct = async(req, res) => {
    try {
        const { name, price, description, quantity } = req.body;
        const product = new Product({
            name,
            price,
            description,
            quantity,
        });
        await product.save();

        res.status(201).json({ message: 'Product created successfully' });
    } catch (error) {
        // res.status(500).json(organizeError(error.message));
        res.status(500).json(error.message);
    }
};

exports.showProduct = async(req, res) => {
    try {
        const productId = req.params.productId;

        const product = await Product.findOne({ _id: productId });
        if (!product) {
            res.status(404).json({ error: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.editProduct = async(req, res) => {
    const errors = productRequest(req.body);

    if (!isBlank(errors)) {
        return res.status(400).json(errors);
    }
    try {
        const productId = req.params.productId;
        const { name, price, description, quantity } = req.body;
        // Update product details
        await Product.findOneAndUpdate({ _id: productId }, {
            $set: {
                name,
                price,
                description,
                quantity,
                updated_at: Date.now(),
            },
        });
        res.status(200).json({ message: 'Product updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.deleteProduct = async(req, res) => {
    try {

        const productId = req.params.productId;

        await Product.findOneAndDelete({ _id: productId });
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};