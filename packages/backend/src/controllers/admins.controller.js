const { errorHandler, withTransaction } = require("../util");
const avatarColors = require("../util/colors");
const UserAdmin = require("../models/admin.model");
const { HttpError } = require("../error");
const mongoose = require("mongoose");
const argon2 = require('argon2');

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

const listAdminUsers = errorHandler(async (req, res) => {
    const adminUsers = await UserAdmin
        .find({ superAdmin: 0 })
        .exec();
    return adminUsers;
});

const createAdminUser = errorHandler(async (req, res) => {
    const randomColorIndex = Math.floor(Math.random() * avatarColors.length);
    const randomColor = avatarColors[randomColorIndex];

    const newAdminUser = new UserAdmin({
        firstName: req.body.firstName || null,
        surName: req.body.surName,
        secondSurName: req.body.secondSurName,
        email: req.body.email,
        password: await argon2.hash(req.body.password),
        username: req.body.username,
        superAdmin: 0,
        avatarColor: randomColor,
    });

    await newAdminUser.save();
    return newAdminUser;
})

//Obtener datos de un Admin en específico
const getAdminUser = errorHandler(async (req, res) => {
    const adminUserId = req.params.adminUserId;
    const adminUser = await UserAdmin.findById(adminUserId).exec();
    if (!adminUser) {
        throw new HttpError(404, 'Admin User not found');
    }
    return adminUser;
});

// Actualizar los datos de un Admin
const updateAdminUser = errorHandler(async (req, res) => {
    const adminUserId = req.params.adminUserId;
    const { firstName, surName, secondSurName, email, password, username } = req.body;

    // Uso de transacción para actualizar los datos del jugador
    const session = await mongoose.startSession();
    session.startTransaction();
    let updatedAdmin;

    try {
        if (!req.body.password) {
            updatedAdmin = await UserAdmin.findByIdAndUpdate(
                adminUserId,
                {
                    $set: {
                        firstName,
                        surName,
                        secondSurName,
                        email,
                        username,
                    }
                },
                { new: true, session }).exec();
        } else {
            req.body.password = await argon2.hash(req.body.password);
            updatedAdmin = await UserAdmin.findByIdAndUpdate(
                adminUserId,
                req.body,
                { new: true, session }).exec();
        }

        if (!updatedAdmin) {
            throw new HttpError(404, 'updatedAdmin not found on update');
        }

        await session.commitTransaction();
        session.endSession();
        return updatedAdmin;

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
});

const updatePassword = errorHandler(async (req, res) => {
    const adminUserId = req.params.adminUserId;
    // Verifica si se proporciona una nueva contraseña en el cuerpo de la solicitud
    if (!req.body.password) {
        throw new HttpError(404, 'Nueva contraseña no proporcionada');
    }

    const newPassword = await argon2.hash(req.body.password);

    // Uso de transacción para actualizar la contraseña
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const updatedPassword = await UserAdmin.findByIdAndUpdate(
            adminUserId,
            { password: newPassword },
            { new: true, session }).exec();

        if (!updatedPassword) {
            throw new HttpError(404, 'Admin not found on updatePassword');
        }

        await session.commitTransaction();

    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
});


const updateAvatar = errorHandler(withTransaction(async (req, res, session) => {
    const _id = req.params.adminUserId;

    const newColor = {
        avatarColor: {
            bkColor: req.body.avatar.bkColor._value,
            textColor: req.body.avatar.textColor._value
        }
    }

    // Verifica si se proporciona el dato
    if (!req.body.avatar) {
        throw new HttpError(404, 'Color no proporcionado');
    }

    const updatedColor = await UserAdmin.findOneAndUpdate(
        { _id },
        { $set: newColor},
        {new: true}
    ).session(session).exec();
    
    if(!updatedColor){
        throw new HttpError(404, 'Admin not found on UpdateColor');
    }
}));

// Eliminar un jugador
const deleteAdminUser = errorHandler(async (req, res) => {
    const adminUserId = req.params.adminUserId;

    // Uso de transacción para eliminar un jugador y sus puntajes asociados
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const adminUser = await UserAdmin.findByIdAndDelete(adminUserId, { session }).exec();

        if (!adminUser) {
            throw new HttpError(404, 'adminUser not found on delete');
        }

        // Eliminar las salas del Administrador, si existen
        // Eliminar los sujetos del Administrador, si existen

        await session.commitTransaction();
        session.endSession();

        return { message: 'adminUser deleted successfully' };
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
});


module.exports = {
    me,
    updateAdminData,
    listAdminUsers,
    createAdminUser,
    getAdminUser,
    updateAdminUser,
    deleteAdminUser,
    updatePassword,
    updateAvatar,

};
