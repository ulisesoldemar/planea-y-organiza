const { HttpError } = require('../error');
const { errorHandler } = require("../util");
const jwt = require("jsonwebtoken");


const verifyAccessToken = errorHandler(async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        throw new HttpError(401, 'Unauthorized');
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.userId = decodedToken.userId;
        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new HttpError(401, 'Unauthorized');
        } else {
            throw new HttpError(500, 'Server fail');
        }
    }
});

module.exports = {
    verifyAccessToken
};