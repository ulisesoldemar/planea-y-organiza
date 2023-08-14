const { Room, AccessPassword } = require('../models');
const argon2 = require('argon2');
const { HttpError } = require('../error');
const { errorHandler, withTransaction } = require("../util");

const createRoom = errorHandler(withTransaction(async (req, res, session) => {
    const roomDoc = new Room({
        roomNumber: req.body.roomNumber,
        roomName: req.body.roomName || null,
        expiration: req.body.expiration || null
    });

    await roomDoc.save({ session });

    return roomDoc;
}));

const listRooms = errorHandler(async (req, res) => {
    const rooms = await Room
        .find()
        .exec();

    if (!rooms) {
        throw new HttpError(404, 'No se encontraron salas');
    }

    return rooms;
});

const addAccessPassword = errorHandler(withTransaction(async (req, res, session) => {
    const { roomNumber, accessPassword } = req.body;
    const roomDoc = await Room.findOne({ roomNumber });

    if (!roomDoc) {
        throw new HttpError(401, 'Sala no encontrada');
    }

    const newAccessPassword = new AccessPassword({
        password: await argon2.hash(accessPassword),
        room: roomDoc._id
    });

    await newAccessPassword.save({ session });

    roomDoc.accessPasswords.push(newAccessPassword);
    await roomDoc.save({ session });
}));

const joinRoom = errorHandler(withTransaction(async (req, res, session) => {
    const { roomNumber, password } = req.body;
    const roomDoc = await Room.findOne({ roomNumber }).populate('accessPasswords').exec();

    if (!roomDoc) {
        throw new HttpError(401, 'Sala no encontrada');
    }

    const validPassword = await verifyAccessPassword(roomDoc.accessPasswords, password);
    if (!validPassword) {
        throw new HttpError(401, 'Contraseña de acceso no válida');
    }

    return roomNumber;
}));

async function verifyAccessPassword(accessPasswords, passwordToVerify) {
    for (const accessPassword of accessPasswords) {
        if (!accessPassword.idUsed && await argon2.verify(accessPassword.password, passwordToVerify)) {
            accessPassword.idUsed = true;
            await accessPassword.save();
            return true;
        }
    }
    return false;
}

module.exports = {
    createRoom,
    listRooms,
    addAccessPassword,
    joinRoom,
};
