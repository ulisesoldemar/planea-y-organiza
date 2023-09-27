const { HttpError } = require('../error');
const { errorHandler } = require("../util");
const { UserAdmin } = require('../models');
const jwt = require("jsonwebtoken");
const logger = require('../logger');

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
        logger.error(error);
        if (error instanceof jwt.TokenExpiredError) {
            throw new HttpError(419, 'Authentication Timeout');
        }
    }
});

const validateAdmin = errorHandler(async (req, res, next) => {
    const _id = req.userId;

    try {
        const adminDoc = await UserAdmin.findOne({ _id });
        if (!adminDoc) {
            throw new HttpError(404, 'User not found');
        }

        req.adminDoc = adminDoc;
        next();
    } catch (error) {
        logger.error(error);
        throw new HttpError(500, 'Server fail');
    }
});



module.exports = {
    verifyAccessToken,
    validateAdmin,
};