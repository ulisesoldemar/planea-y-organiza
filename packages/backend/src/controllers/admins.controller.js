const { errorHandler } = require("../util");
const UserAdmin = require("../models/admin.model");
const { HttpError } = require("../error");

// Obtener los datos del administrador actual
const me = errorHandler(async (req, res) => {
    const userDoc = await UserAdmin.findById(req.userId).exec();
    if (!userDoc) {
        throw new HttpError(404, 'User not found');
    }
    return userDoc;
});

// Actualizar los datos del administrador
const updateAdminData = errorHandler(async (req, res) => {
    const updates = req.body; // Los datos a actualizar se esperan en el cuerpo de la solicitud
    const userDoc = await UserAdmin.findByIdAndUpdate(req.userId, updates, { new: true }).exec();

    if (!userDoc) {
        throw new HttpError(404, 'User not found');
    }

    return userDoc;
});

module.exports = {
    me,
    updateAdminData
};
