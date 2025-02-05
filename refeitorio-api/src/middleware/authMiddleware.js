require('dotenv').config();
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

const authorizeRole = (requiredRole) => (req, res, next) => {
    const userRole = req.user.role;

    if (userRole >= requiredRole) {
        next();
    } else {
        return res.status(403).json({ message: 'Acesso negado.' });
    }
};

module.exports = { authenticateToken, authorizeRole };
