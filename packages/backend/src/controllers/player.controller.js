const jwt = require('jsonwebtoken');
const { Player, RefreshToken } = require('../models');
const argon2 = require('argon2');
const { errorHandler, withTransaction, verifyPassword } = require("../util");
const { HttpError } = require('../error');

const createPlayer = errorHandler(withTransaction(async (req, res, session) => {
    const playerDoc = new Player({
        firstName: req.body.firstName,
        firstLastName: req.body.firstName,
        secondLastName: req.body.firstName || null,
        email: req.body.email,
        age: req.body.age,
        roomId: req.body.roomId,
    });
    const refreshTokenDoc = new RefreshToken({
        owner: playerDoc.id,
        ownerModel: 'Player',
    })

    await playerDoc.save({ session });
    await refreshTokenDoc.save({ session });

    const refreshToken = createRefreshToken(playerDoc.id, refreshTokenDoc.id);
    const accessToken = createAccessToken(playerDoc.id);

    return {
        id: playerDoc.id,
        accessToken,
        refreshToken
    };
}))

const newRefreshToken = errorHandler(withTransaction(async (req, res, session) => {
    const currentRefreshToken = await validateRefreshToken(req.body.refreshToken);
    const refreshTokenDoc = new RefreshToken({
        owner: currentRefreshToken.userId
    });

    await refreshTokenDoc.save({ session });
    await RefreshToken.deleteOne({ _id: currentRefreshToken.tokenId }, { session });

    const refreshToken = createRefreshToken(currentRefreshToken.userId, refreshTokenDoc.id);
    const accessToken = createAccessToken(currentRefreshToken.userId);

    return {
        id: currentRefreshToken.userId,
        accessToken,
        refreshToken
    };
}));

const newAccessToken = errorHandler(async (req, res) => {
    const refreshToken = await validateRefreshToken(req.body.refreshToken);
    const accessToken = createAccessToken(refreshToken.userId);

    return {
        id: refreshToken.userId,
        accessToken,
        refreshToken: req.body.refreshToken
    };
});

const logout = errorHandler(withTransaction(async (req, res, session) => {
    const refreshToken = await validateRefreshToken(req.body.refreshToken);
    await RefreshToken.deleteOne({ _id: refreshToken.tokenId }, { session });
    return { success: true };
}));

const logoutAll = errorHandler(withTransaction(async (req, res, session) => {
    const refreshToken = await validateRefreshToken(req.body.refreshToken);
    await RefreshToken.deleteMany({ owner: refreshToken.userId }, { session });
    return { success: true };
}));

function createAccessToken(userId) {
    return jwt.sign({
        userId: userId
    }, process.env.JWT_SECRET_KEY, {
        expiresIn: '10m'
    });
}

function createRefreshToken(userId, refreshTokenId) {
    return jwt.sign({
        userId: userId,
        tokenId: refreshTokenId
    }, process.env.JWT_REFRESH_SECRET_KEY, {
        expiresIn: '30d'
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

module.exports = {
    signup: createPlayer,
    login,
    newRefreshToken,
    newAccessToken,
    logout,
    logoutAll
};