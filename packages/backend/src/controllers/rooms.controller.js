const argon2 = require('argon2');
const { Room, RefreshToken, Player, UserAdmin } = require('../models');
const { HttpError } = require('../error');
const { errorHandler, withTransaction, createAccessToken, createRefreshToken, verifyPassword } = require("../util");

const listRooms = errorHandler(async (req, res) => {
    const adminId = req.userId; // Usamos el ID del admin del token
    const rooms = await Room
        .find({ admin: adminId }) // Filtrar por el ID del admin creador
        .exec();

    return rooms;
});

const createRoom = errorHandler(withTransaction(async (req, res, session) => {
    const { roomNumber, roomName, password, expiration } = req.body;

    const adminDoc = req.adminDoc;

    const hashedPassword = await argon2.hash(password);

    const roomDoc = new Room({
        roomNumber,
        roomName: roomName || null,
        password: hashedPassword,
        expiration: expiration || null,
        admin: adminDoc,
    });

    await roomDoc.save({ session });

    return roomDoc;
}));

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

    const room = await Room.findOne({ roomNumber, admin: req.userId }).exec();

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

module.exports = {
    createRoom,
    listRooms,
    addPlayerToRoom,
    joinRoom,
    deleteRoom,
    updateRoom,
    fetchRoom,
};
