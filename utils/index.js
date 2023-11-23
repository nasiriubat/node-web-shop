const Product = require("../models/product");
const mongoose = require('mongoose');


exports.generateOrderId = () => {
    return 'ORD_' + Math.random().toString(36).substr(2, 9);
};

exports.organizeError = (errorString) => {

    let cleanedString = errorString.replace("Product validation failed: ", "");
    cleanedString = cleanedString.replace("User validation failed: ", "");

    const errors = cleanedString.split(', ');

    const organizedErrors = {};

    errors.forEach((error) => {
        const [fieldPath, errorMessage] = error.split(': Path `').map(str => str.replace(/`| is required\./g, ''));
        const fieldName = fieldPath.split(' ')[0];
        organizedErrors[fieldName] = `${fieldName} field is required.`;
    });

    return organizedErrors;

}

exports.isBlank = (input, mongo = false) => {
    if (
        input === null ||
        input === undefined ||
        input === false ||
        input === 0 ||
        (typeof input === 'string' && input.trim() === '') ||
        (Array.isArray(input) && input.length === 0) ||
        (typeof input === 'object' && Object.keys(input).length === 0)) {
        if (mongo && (!mongoose.Types.ObjectId.isValid(input))) {
            return true;
        } else {
            return true;
        }
    }

    return false;
}

exports.checkAdmin = (req) => {
    if (req.user.role == 'admin') {
        return true
    }
    return false
};
exports.getProduct = async(_id) => {
    const product = await Product.findOne({ _id });
    return product;
};

exports.delayedData = async(data, model, primaryKey) => {
    const json = await Promise.all(
        data.map(async(item) => {
            const search_id = item[primaryKey];
            const product = await model.findOne({ _id: search_id })
            return product;
        }))

    return json;
}