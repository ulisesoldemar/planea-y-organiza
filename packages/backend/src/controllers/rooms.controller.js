// En el controlador o donde sea que se maneje la unión de jugadores a la sala
const { Room, Player } = require('../models')
const argon2 = require('argon2');
const { HttpError } = require('../error');
const { errorHandler, withTransaction, verifyPassword } = require("../util");

const createRoom = errorHandler(withTransaction(async (req, res, session) => {
    console.log(req.body);
    const roomDoc = new Room({
        roomNumber: req.body.roomNumber,
        password: await argon2.hash(req.body.password),
        expiration: req.body.expiration || null
    });

    await roomDoc.save({ session });

    return roomDoc;

}));

const joinRoom = errorHandler(withTransaction(async (req, res, session) => {
    const { roomNumber, password } = req.body;
    const roomDoc = await Room.findOne({ roomNumber }).select('+password').exec();

    if (!roomDoc) {
        throw new HttpError(401, 'Jugador o sala no encontrado');
    }

    await verifyPassword(roomDoc.password, password, 'Wrong room number or password');

    return roomDoc;

}));

module.exports = {
    createRoom,
    joinRoom
}