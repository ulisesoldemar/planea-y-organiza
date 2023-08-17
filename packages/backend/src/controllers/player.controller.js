const { errorHandler } = require("../util");
const Player = require("../models/player.model");
const { HttpError } = require("../error");
const mongoose = require("mongoose");
const argon2 = require('argon2');

// Obtener una lista de todos los jugadores
const listPlayers = errorHandler(async (req, res) => {
    const players = await Player.find().exec();
    return players;
});

// Crear un nuevo jugador
const createPlayer = errorHandler(async (req, res) => {
    const playerData = req.body;
    const newPlayer = new Player({
        firstName: playerData.firstName || null,
        surName: playerData.surName || null,
        secondSurName: playerData.secondSurName || null,
        email: playerData.email || null,
        phone: playerData.phone || null,
        age: playerData.age || null,
        uniqueAccessCode: await argon2.hash(playerData.uniqueAccessCode),
        accessCodeExpiration: playerData.accessCodeExpiration
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

    // Uso de transacción para eliminar un jugador
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const player = await Player.findByIdAndDelete(playerId, { session }).exec();

        if (!player) {
            throw new HttpError(404, 'Player not found');
        }

        await session.commitTransaction();
        session.endSession();

        return { message: 'Player deleted successfully' };
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
