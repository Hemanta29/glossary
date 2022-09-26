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
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            req.user = await User.findById(decoded.id).select('-pwd');
            next();
        } catch (error) {
            console.log(error);
            res.status(401).send('Not authorized! Token may be expired or failed.');
        }
    }
    else if (!token) {
        res.status(401).send('Not authorized! No Token.');
    }
}

module.exports = {
    authGuard
}