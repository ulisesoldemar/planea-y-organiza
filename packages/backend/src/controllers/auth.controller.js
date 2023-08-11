const jwt = require('jsonwebtoken');
const { UserAdmin, RefreshToken } = require('../models');
const argon2 = require('argon2');
const { errorHandler, withTransaction, verifyPassword } = require("../util");
const { HttpError } = require('../error');

const signup = errorHandler(withTransaction(async (req, res, session) => {
    const userDoc = new UserAdmin({
        firstName: req.body.firstName,
        surName: req.body.surName,
        secondSurName: req.body.secondSurName,
        email: req.body.email,
        username: req.body.username,
        password: await argon2.hash(req.body.password)
    });
    const refreshTokenDoc = new RefreshToken({
        owner: userDoc.id,
        ownerModel: 'UserAdmin',
    })

    await userDoc.save({ session });
    await refreshTokenDoc.save({ session });

    const refreshToken = createRefreshToken(userDoc.id, refreshTokenDoc.id);
    const accessToken = createAccessToken(userDoc.id);

    return {
        id: userDoc.id,
        accessToken,
        refreshToken
    };
}))

const login = errorHandler(withTransaction(async (req, res, session) => {
    const { identifier, password } = req.body;
    // Buscar el usuario por nombre de usuario o correo electrónico
    const userDoc = await UserAdmin.findOne({
        $or: [
            { username: identifier },
            { email: identifier }
        ],
    }).select('+password').exec();

    if (!userDoc) {
        throw new HttpError(401, 'Wrong username or email or password');
    }
    await verifyPassword(userDoc.password, password, 'Wrong username or password');

    const refreshTokenDoc = RefreshToken({
        owner: userDoc.id,
        ownerModel: 'UserAdmin',
    });

    await refreshTokenDoc.save({ session });

    const refreshToken = createRefreshToken(userDoc.id, refreshTokenDoc.id);
    const accessToken = createAccessToken(userDoc.id);

    return {
        id: userDoc.id,
        accessToken,
        refreshToken
    };
}));


const newRefreshToken = errorHandler(withTransaction(async (req, res, session) => {
    const currentRefreshToken = await validateRefreshToken(req.body.refreshToken);
    const refreshTokenDoc = new RefreshToken({
        owner: currentRefreshToken.userId,
        ownerModel: 'UserAdmin',
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
            throw new HttpError(401, 'Unauthorised');
        }
    }

    const decodedToken = decodeToken();
    const tokenExists = await RefreshToken.exists({ _id: decodedToken.tokenId, owner: decodedToken.userId });
    if (tokenExists) {
        return decodedToken;
    } else {
        throw new HttpError(401, 'Unauthorised');
    }
};

module.exports = {
    signup,
    login,
    newRefreshToken,
    newAccessToken,
    logout,
    logoutAll
};