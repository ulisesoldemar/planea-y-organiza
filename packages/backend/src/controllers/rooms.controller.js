const argon2 = require('argon2');
const { v4: uuidv4 } = require('uuid');
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
    const { roomName, password, expiration, maxTime, status, quickStart } = req.body;

    if (!password) {
        throw new HttpError(422, 'No password');
    }

    const adminDoc = req.adminDoc;

    const hashedPassword = await argon2.hash(password);

    const roomDoc = new Room({
        roomNumber: uuidv4(),
        roomName: roomName || null,
        password: hashedPassword,
        expiration: expiration || null,
        maxTime: maxTime,
        quickStart: quickStart || false,
        status: status || 'Open',
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
    let updatedRoom;

    if (!req.body.password) {
        const { roomName, expiration, maxTime, quickStart, status } = req.body;
        updatedRoom = await Room.findOneAndUpdate(
            { roomNumber },
            {
                $set: {
                    roomName,
                    expiration,
                    maxTime,
                    quickStart,
                    status,
                }
            },
            { new: true }
        ).session(session).exec();
    } else {
        req.body.password = await argon2.hash(req.body.password);
        updatedRoom = await Room.findOneAndUpdate(
            { roomNumber },
            { $set: req.body },
            { new: true }
        ).session(session).exec();
    }

    if (!updatedRoom) {
        throw new HttpError(404, 'Room not found');
    }
    return updatedRoom;
}));

const fetchRoom = errorHandler(async (req, res) => {
    const { roomNumber } = req.params;

    const room = await Room.findOne({ roomNumber, admin: req.userId })
    .populate('players', '_id firstName surName email')
    .exec();

    if (!room) {
        throw new HttpError(404, 'Room not found');
    }

    return room;
});

const fetchRoomPlayers = errorHandler(async (req, res) => {
    const { roomNumber } = req.params;
    const roomDoc = await Room.findOne({ roomNumber });

    if (!roomDoc) {
        throw new HttpError(404, 'Sala no encontrada');
    }

    const players = await Player.find({ _id: { $in: roomDoc.players } });

    return players;
});

const addPlayerToRoom = errorHandler(withTransaction(async (req, res, session) => {

    const { roomNumber, playerId } = req.body;
    const roomDoc = await Room.findOne({ roomNumber });

    if (!roomDoc) {
        throw new HttpError(404, 'Sala no encontrada');
    }

    const playerDoc = await Player.findOne({ _id: playerId });

    if (!playerDoc) {
        throw new HttpError(404, `Jugador ${playerId} no existe`);
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

const addPlayersToRoom = errorHandler(withTransaction(async (req, res, session) => {
    const { roomNumber, playerIds } = req.body;

    const roomDoc = await Room.findOne({ roomNumber });

    if (!roomDoc) {
        throw new HttpError(404, 'Sala no encontrada');
    }

    // Buscar los jugadores por sus IDs
    const playersToAdd = await Player.find({ _id: { $in: playerIds } });

    // Validar si todos los jugadores existen
    if (playersToAdd.length !== playerIds.length) {
        throw new HttpError(422, 'Algunos jugadores no existen');
    }

    const existingPlayerIds = roomDoc.players.map(player => player._id.toString());

    // Filtrar jugadores que ya están en la sala
    const newPlayerIds = playerIds.filter(playerId => !existingPlayerIds.includes(playerId));

    // Actualizar jugadores con la sala y guardar en la transacción
    for (const playerId of newPlayerIds) {
        const playerDoc = playersToAdd.find(player => player._id.toString() === playerId);

        if (playerDoc.roomNumber === roomNumber) {
            throw new HttpError(422, `Jugador ${playerId} ya está en la sala`);
        } else {
            playerDoc.roomNumber = roomNumber;
            await playerDoc.save({ session });
        }

        roomDoc.players.push(playerDoc);
    }

    await roomDoc.save({ session });

    return roomDoc;
}));

const removePlayerFromRoom = errorHandler(withTransaction(async (req, res, session) => {
    const { roomNumber, playerId } = req.body;
    const roomDoc = await Room.findOne({ roomNumber });

    if (!roomDoc) {
        throw new HttpError(404, 'Sala no encontrada');
    }

    const playerDoc = await Player.findById(playerId);

    if (!playerDoc) {
        throw new HttpError(404, 'Jugador no encontrado');
    }

    if (playerDoc.roomNumber !== roomNumber) {
        throw new HttpError(422, 'Jugador no está en la sala');
    } else {
        playerDoc.roomNumber = null;
        await playerDoc.save({ session });
    }

    roomDoc.players.pull(playerDoc);
    await roomDoc.save({ session });

    return roomDoc;
}));

const removePlayersFromRoom = errorHandler(withTransaction(async (req, res, session) => {
    const { roomNumber, playerIds } = req.body;

    const roomDoc = await Room.findOne({ roomNumber });

    if (!roomDoc) {
        throw new HttpError(404, 'Sala no encontrada');
    }

    const existingPlayerIds = roomDoc.players.map(player => player.toString());

    // Filtrar jugadores que están en la sala y que se pueden eliminar
    const playersToDeleteIds = playerIds.filter(playerId => existingPlayerIds.includes(playerId));

    if (playersToDeleteIds.length === 0) {
        throw new HttpError(422, 'Ningún jugador para eliminar encontrado en la sala');
    }

    // Actualizar el arreglo 'players' en el documento de Room
    roomDoc.players = roomDoc.players.filter(playerId => !playersToDeleteIds.includes(playerId.toString()));

    await roomDoc.save({ session });

    return roomDoc;
}));


const joinRoom = errorHandler(withTransaction(async (req, res, session) => {
    const { roomNumber, email, password } = req.body;
    const roomDoc = await Room.findOne({ roomNumber });

    if (!roomDoc) {
        throw new HttpError(404, 'Sala no encontrada');
    }

    const admin = roomDoc.admin;

    const playerDoc = await Player.findOne({ email, admin });
    await verifyPassword(roomDoc.password, password, 'Usuario o contraseña no válidos');

    if (!playerDoc || !roomDoc.players.includes(playerDoc._id)) {
        throw new HttpError(401, 'Usuario o contraseña no válidos');
    }

    if (Date.now() > Date.parse(roomDoc.expiration) || roomDoc.status === 'Closed') {
        throw new HttpError(403, 'Esta sala no permite el acceso');
    }

    const refreshTokenDoc = new RefreshToken({
        owner: playerDoc.id,
        ownerModel: 'Player',
    });

    await refreshTokenDoc.save({ session });

    const refreshToken = createRefreshToken(playerDoc.id, refreshTokenDoc.id);
    const accessToken = createAccessToken(playerDoc.id);

    const { id, firstName, surName, secondSurName, age, phone } = playerDoc;
    const { maxTime, status, expiration, quickStart } = roomDoc;
    const roomId = roomDoc._id;

    return {
        roomId,
        roomNumber,
        maxTime,
        status,
        expiration,
        quickStart,
        player: { id, firstName, surName, secondSurName, email, age, phone },
        accessToken,
        refreshToken
    };
}));

const leaveRoom = errorHandler(withTransaction(async (req, res, session) => {
    const {roomNumber, playerId} = req.body;
    if (!roomNumber) {
        throw new HttpError(422, 'No room number');
    }

    const roomDoc = await Room.findOne({ roomNumber });
    if (!roomDoc) {
        throw new HttpError(404, 'Sala no encontrada');
    }

    const playerDoc = await Player.findById(playerId);
    if (!playerDoc || !roomDoc.players.includes(playerDoc._id)) {
        throw new HttpError(401, 'Usuario no encontrado');
    }

    roomDoc.players.pull(playerDoc._id);
    await roomDoc.save({ session });

    return { message: 'El jugador ha salido de la sala' };
}));

module.exports = {
    createRoom,
    listRooms,
    fetchRoomPlayers,
    addPlayerToRoom,
    addPlayersToRoom,
    removePlayerFromRoom,
    removePlayersFromRoom,
    joinRoom,
    leaveRoom,
    deleteRoom,
    updateRoom,
    fetchRoom,
};
