const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const authGuard = async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.EMAIL_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            res.status(401).send('Not authorized! Token failed.');
        }
    }
    else if (!token) {
        res.status(401).send('Not authorized! No Token.');
    }
}

module.exports = {
    authGuard
}