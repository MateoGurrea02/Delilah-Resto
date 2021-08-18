const config = require('../config/index');
const jwt = require('jsonwebtoken');

function auth(req, res, next) {
    const headerAuth = req.headers['authorization'];
    if (!headerAuth) {
        return res.status('401').json({ 
            status: 401,
            error: 'Token is missing!' });
    }

    const [token] = headerAuth.split(' ');
    
    try {
        const tokenDecoded = jwt.verify(token, config.jwt_secret);
        req.user = tokenDecoded.user;

        return next();

    } catch (error) {
        let message;
        switch (error.name) {
            case 'JsonWebTokenError':
                message = 'Error in the JWT';
                break;
            default:
                message = error.message;
                break;
        }
        return res.status(401).json({ 
            status: 401,
            error: message });
    };
};

module.exports = auth;