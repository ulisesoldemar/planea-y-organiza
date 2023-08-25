const { errorHandler } = require("../util");
const { Player, Room, Score } = require("../models/");
const { HttpError } = require("../error");
const mongoose = require("mongoose");
const argon2 = require('argon2');

// Obtener una lista de todos los jugadores
const listPlayers = errorHandler(async (req, res) => {
    const adminId = req.userId;
    const players = await Player
        .find({ admin: adminId })
        .exec();
    return players;
});

// Crear un nuevo jugador
const createPlayer = errorHandler(async (req, res) => {
    const playerData = req.body;

    const adminDoc = req.adminDoc;

    const newPlayer = new Player({
        firstName: playerData.firstName || null,
        surName: playerData.surName || null,
        secondSurName: playerData.secondSurName || null,
        email: playerData.email || null,
        phone: playerData.phone || null,
        age: playerData.age || null,
        admin: adminDoc,
    });

    await newPlayer.save();
    return newPlayer;
});

// Obtener datos de un jugador específico
const getPlayer = errorHandler(async (req, res) => {
    const playerId = req.params.playerId;
    const player = await Player.findById(playerId).exec();
    if (!player) {
        throw new HttpError(404, 'Player not found');
    }
    return player;
});

// Actualizar los datos de un jugador
const updatePlayer = errorHandler(async (req, res) => {
    const playerId = req.params.playerId;
    const updates = req.body;

    // Uso de transacción para actualizar los datos del jugador
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const player = await Player.findByIdAndUpdate(playerId, updates, { new: true, session }).exec();

        if (!player) {
            throw new HttpError(404, 'Player not found');
        }

        await session.commitTransaction();
        session.endSession();

        return player;
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
});

// Eliminar un jugador
const deletePlayer = errorHandler(async (req, res) => {
    const playerId = req.params.playerId;

    // Uso de transacción para eliminar un jugador y sus puntajes asociados
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const player = await Player.findByIdAndDelete(playerId, { session }).exec();

        if (!player) {
            throw new HttpError(404, 'Player not found');
        }

        // Eliminar los puntajes del jugador, si existen
        if (player.scores.length > 0) {
            await Score.deleteMany({ _id: { $in: player.scores } }).exec();
        }

        // Actualizar la sala para eliminar la referencia al jugador
        await Room.updateMany(
            { players: player._id },
            { $pull: { players: player._id } },
            { session }
        ).exec();

        await session.commitTransaction();
        session.endSession();

        return { message: 'Player and associated scores deleted successfully' };
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
});

module.exports = {
    listPlayers,
    createPlayer,
    getPlayer,
    updatePlayer,
    deletePlayer
};
