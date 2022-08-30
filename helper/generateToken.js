const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.EMAIL_SECRET, {
        expiresIn: '1d',
    });
};

module.exports = {
    generateToken
}