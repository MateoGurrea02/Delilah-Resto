  
const jwt = require('jsonwebtoken');

function isAdmin(req, res, next) {
    const headerAuth = req.headers['authorization'];
    if (!headerAuth) {
        return res.status('401').json({ message: 'Token is missing!' });
    }
    const [token] = headerAuth.split(' ');
    try {
        const tokenDecoded = jwt.verify( token, process.env.JWT_SECRET);
        const isAdmin = tokenDecoded.user.rol === 'Admin';
        if(!isAdmin){
            return res.status('401').json({ message: 'You not authorized' });
        }
    } catch (error) {
        let message;
        switch (error.name) {
            case 'JsonWebTokenError':{
                message = 'Error in the JWT';
                break;
            }
            default:{
                message = 'Error';
                break;
            }
        }
        return res.status(401).json({ token, message});
    }
    return next();
}

module.exports = isAdmin;
