const argon2 = require('argon2');
const { Room, RefreshToken, Player } = require('../models');
const { HttpError } = require('../error');
const { errorHandler, withTransaction, createAccessToken, createRefreshToken } = require("../util");

const createRoom = errorHandler(withTransaction(async (req, res, session) => {
    const roomDoc = new Room({
        roomNumber: req.body.roomNumber,
        roomName: req.body.roomName || null,
        password: req.body.password || null,
        expiration: req.body.expiration || null
    });

    await roomDoc.save({ session });

    return roomDoc;
}));

const listRooms = errorHandler(async (req, res) => {
    const rooms = await Room
        .find()
        .exec();

    return rooms;
});

const deleteRoom = errorHandler(withTransaction(async (req, res, session) => {
    const { roomNumber } = req.params;

    const deletedRoom = await Room.findOneAndDelete({ roomNumber }).session(session).exec();

    if (!deletedRoom) {
        throw new HttpError(404, 'Sala no encontrada');
    }

    return deletedRoom;
}));

const updateRoom = errorHandler(withTransaction(async (req, res, session) => {
    const { roomNumber } = req.params;

    const updatedRoom = await Room.findOneAndUpdate(
        { roomNumber },
        { $set: req.body },
        { new: true }
    ).session(session).exec();

    if (!updatedRoom) {
        throw new HttpError(404, 'Sala no encontrada');
    }

    return updatedRoom;
}));

const fetchRoom = errorHandler(async (req, res) => {
    const { roomNumber } = req.params;

    const room = await Room.findOne({ roomNumber }).exec();

    if (!room) {
        throw new HttpError(404, 'Sala no encontrada');
    }

    return room;
});

const addPlayerToRoom = errorHandler(withTransaction(async (req, res, session) => {
    const { roomNumber } = req.body;
    const roomDoc = await Room.findOne({ roomNumber });

    if (!roomDoc) {
        throw new HttpError(401, 'Sala no encontrada');
    }

    const playerDoc = new Player({
        firstName: req.body.firstName || null,
        surName: req.body.surName || null,
        secondSurName: req.body.secondSurName || null,
        email: req.body.email,
        age: req.body.age || null,
        uniqueAccessCode: await argon2.hash(req.body.uniqueAccessCode)
    });

    roomDoc.players.push(playerDoc);
    // TODO: Agregar el token a la base de datos y encriptado con AES-GCM para que sea más seguro
    await playerDoc.save({ session });
    await roomDoc.save({ session });

    return roomDoc;
}));

const joinRoom = errorHandler(withTransaction(async (req, res, session) => {
    const { roomNumber, uniqueAccessCode } = req.body;
    const roomDoc = await Room.findOne({ roomNumber }).populate('players').exec();

    if (!roomDoc) {
        throw new HttpError(401, 'Sala no encontrada');
    }

    const playerDoc = await verifyAccessCode(roomDoc.players, uniqueAccessCode);

    if (!playerDoc) {
        throw new HttpError(401, 'Contraseña de acceso no válida');
    }

    const refreshTokenDoc = new RefreshToken({
        owner: playerDoc.id,
        ownerModel: 'Player',
    });

    await refreshTokenDoc.save({ session });

    const refreshToken = createRefreshToken(playerDoc.id, refreshTokenDoc.id);
    const accessToken = createAccessToken(playerDoc.id);

    const { firstName, surName, secondSurName, email, age } = playerDoc;

    return {
        roomNumber,
        player: { firstName, surName, secondSurName, email, age },
        accessToken,
        refreshToken
    };
}));

async function verifyAccessCode(players, codeToVerify) {
    for (const player of players) {
        if (/*!player.accessCodeUsed &&*/ await argon2.verify(player.uniqueAccessCode, codeToVerify)) {
            player.accessCodeUsed = true;
            await player.save();
            return player;
        }
    }
    return false;
}

module.exports = {
    createRoom,
    listRooms,
    addPlayerToRoom,
    joinRoom,
    deleteRoom,
    updateRoom,
    fetchRoom,
};
