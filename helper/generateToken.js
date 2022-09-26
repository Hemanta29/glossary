const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '1d',
    });
};

const refreshToken = (id) => {
    return jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET);
};

module.exports = {
    generateToken,
    refreshToken
}