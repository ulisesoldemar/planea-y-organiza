const { errorHandler } = require("../util");
const UserAdmin = require("../models/admin.model");
const { HttpError } = require("../error");

const me = errorHandler(async (req, res) => {
    const userDoc = await UserAdmin.findById(req.userId).exec();
    if (!userDoc) {
        throw new HttpError(400, 'User not found');
    }
    return userDoc;
});

module.exports = {
    me
};