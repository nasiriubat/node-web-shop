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

exports.isBlank = (input) => {
    if (
        input === null ||
        input === undefined ||
        input === false ||
        input === 0 ||
        (typeof input === 'string' && input.trim() === '') ||
        (Array.isArray(input) && input.length === 0) ||
        (typeof input === 'object' && Object.keys(input).length === 0)
    ) {
        return true;
    }

    return false;
}