const argon2 = require('argon2');
const { Room, RefreshToken, Player } = require('../models');
const { HttpError } = require('../error');
const { errorHandler, withTransaction, createAccessToken, createRefreshToken, verifyPassword } = require("../util");

const createRoom = errorHandler(withTransaction(async (req, res, session) => {
    const roomDoc = new Room({
        roomNumber: req.body.roomNumber,
        roomName: req.body.roomName || null,
        password: await argon2.hash(req.body.password),
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
    const { roomNumber, playerId } = req.body;
    const roomDoc = await Room.findOne({ roomNumber });

    if (!roomDoc) {
        throw new HttpError(401, 'Sala no encontrada');
    }

    const playerDoc = await Player.findOne({ _id: playerId });

    if (!playerDoc) {
        throw new HttpError(422, `Jugador ${playerId} no existe`);
    }

    if (playerDoc.roomNumber === roomNumber) {
        throw new HttpError(422, `Jugador ${playerId} ya está en la sala`);
    } else {
        playerDoc.roomNumber = roomNumber;
        await playerDoc.save({ session });
    }

    roomDoc.players.push(playerDoc);
    await roomDoc.save({ session });

    return roomDoc;
}));

const joinRoom = errorHandler(withTransaction(async (req, res, session) => {
    const { roomNumber, email, password } = req.body;
    const roomDoc = await Room.findOne({ roomNumber });

    if (!roomDoc) {
        throw new HttpError(401, 'Sala no encontrada');
    }

    const playerDoc = await Player.findOne({ email });
    await verifyPassword(roomDoc.password, password, 'Usuario o contraseña no válidos');

    if (!playerDoc || !roomDoc.players.includes(playerDoc._id)) {
        throw new HttpError(401, 'Usuario o contraseña no válidos');
    }

    const refreshTokenDoc = new RefreshToken({
        owner: playerDoc.id,
        ownerModel: 'Player',
    });

    await refreshTokenDoc.save({ session });

    const refreshToken = createRefreshToken(playerDoc.id, refreshTokenDoc.id);
    const accessToken = createAccessToken(playerDoc.id);

    const { id, firstName, surName, secondSurName, age } = playerDoc;
    const { quickStart } = roomDoc;

    return {
        roomNumber,
        quickStart,
        player: { id, firstName, surName, secondSurName, email, age },
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
