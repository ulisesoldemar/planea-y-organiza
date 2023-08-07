const { errorHandler } = require("../util");
const User = require("../models/user.model");
const { HttpError } = require("../error");

const me = errorHandler(async (req, res) => {
    const userDoc = await User.findById(req.userId).exec();
    if (!userDoc) {
        throw new HttpError(400, 'User not found');
    }
    return userDoc;
});

module.exports = {
    me
};