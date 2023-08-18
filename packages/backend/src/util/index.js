const mongoose = require("mongoose");
const argon2 = require("argon2");
const jwt = require('jsonwebtoken');
const { HttpError } = require("../error");
const { RefreshToken } = require("../models")

function errorHandler(fn) {
    return async function (req, res, next) {
        try {
            let nextCalled = false;
            const result = await fn(req, res, (params) => {
                nextCalled = true;
                next(params);
            });
            if (!res.headersSent && !nextCalled) {
                res.json(result);
            }
        } catch (e) {
            next(e);
        }
    }
}

function withTransaction(fn) {
    return async function (req, res, next) {
        let result;
        await mongoose.connection.transaction(async (session) => {
            result = await fn(req, res, session);
            return result;
        });

        return result;
    }
}

function createAccessToken(userId) {
    return jwt.sign({
        userId: userId
    }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_ACCESS_EXPIRATION,
    });
}

function createRefreshToken(userId, refreshTokenId) {
    return jwt.sign({
        userId: userId,
        tokenId: refreshTokenId
    }, process.env.JWT_REFRESH_SECRET_KEY, {
        expiresIn: process.env.JWT_REFRESH_EXPIRATION
    });
}

const validateRefreshToken = async (token) => {
    const decodeToken = () => {
        try {
            return jwt.verify(token, process.env.JWT_REFRESH_SECRET_KEY);
        } catch (err) {
            // err
            throw new HttpError(401, 'Unauthorized');
        }
    }

    const decodedToken = decodeToken();
    const tokenExists = await RefreshToken.exists({ _id: decodedToken.tokenId, owner: decodedToken.userId });
    if (tokenExists) {
        return decodedToken;
    } else {
        throw new HttpError(401, 'Unauthorized');
    }
};

const verifyPassword = async (hashedPassword, rawPassword, msg) => {
    if (!await argon2.verify(hashedPassword, rawPassword)) {
        throw new HttpError(401, msg);
    }
};

module.exports = {
    errorHandler,
    withTransaction,
    createAccessToken,
    createRefreshToken,
    validateRefreshToken,
    verifyPassword
};