const { isBlank } = require("./index");

exports.productRequest = (inputs) => {
    const error = [];
    if (isBlank(inputs)) {
        return error['Validation error'] = 'name, description, quantity and price field is required !'
    }
    if (!inputs.name) {
        error[inputs.name] = 'name is required.';
    }
    if (!inputs.description) {
        error[inputs.description] = 'description is required.';
    }
    if (!inputs.quantity) {
        error[inputs.quantity] = 'quantity is required.';
    }
    if (!inputs.price) {
        error[inputs.price] = 'price is required.';
    }

    return error;
}




exports.userRequest = (inputs) => {
    const error = {};
    if (isBlank(inputs)) {
        return error['Validation error'] = 'name, phone and role field is required !'
    }
    if (!inputs.name) {
        error['name'] = 'name is required.';
    }
    if (!inputs.phone) {
        error['phone'] = 'phone is required.';
    }
    if (!inputs.role) {
        error['role'] = 'role is required.';
    }
    return error;

}