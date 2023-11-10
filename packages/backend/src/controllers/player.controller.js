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

    if (await Player.exists({ email: playerData.email, admin: adminDoc })) {
        const errMessage = `Ocurrio un error: El correo electrónico "${playerData.email}" ya existe`;
        throw new HttpError(400, errMessage);
    }

    const newPlayer = new Player({
        firstName: playerData.firstName || null,
        surName: playerData.surName || null,
        secondSurName: playerData.secondSurName || null,
        email: playerData.email || null,
        phone: playerData.phone || null,
        age: playerData.age || null,
        admin: adminDoc,
    });

    try {
        await newPlayer.save();
        return newPlayer;
    } catch (error) {
        //Error de Duplicated key
        if (error.code === 11000 || error.code === 11001) {
            const emailMatch = error.errmsg.match(/email: "([^"]+)"/); // Buscar el valor de email en el mensaje

            if (emailMatch) {
                const errMessage = `Ocurrio un error: El correo electrónico "${emailMatch[1]}" ya existe`;
                throw new HttpError(400, errMessage);
            }

        } else {
            console.error('Error desconocido al crear el jugador:', error);
        }
    }

});

// Crear nuevos jugadores a partir de un archivo de Excel
const createPlayersByFile = errorHandler(async (req, res) => {
    const playersData = req.body;

    const adminDoc = req.adminDoc;

    const playersObject = playersData.map((row) => ({
        firstName: null,
        surName: null,
        secondSurName: null,
        email: row[0] || null,
        phone: null,
        age: null,
        admin: adminDoc,
    }));

    try {
        const savedPlayers = await Player.insertMany(playersObject);
        return savedPlayers;
    } catch (error) {
        //Error de Duplicated key
        if (error.code === 11000 || error.code === 11001) {
            const emailMatch = error.errmsg.match(/email: "([^"]+)"/); // Buscar el valor de email en el mensaje

            if (emailMatch) {
                const errMessage = `Ocurrio un error: El correo electrónico "${emailMatch[1]}" ya existe`;
                throw new HttpError(400, errMessage);
            }

        } else {
            console.error('Error desconocido al crear jugadores:', error);
        }
    }
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

    const formatDateToISO = (date) => {
        const parts = date.split('/');
        const year = parts[2];
        const month = parts[1];
        const day = parts[0];
        return `${year}-${month}-${day}`;
    }

    const playerId = req.params.playerId;

    // Uso de transacción para actualizar los datos del jugador
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const player = await Player.findById(playerId);
        if (!player) {
            throw new HttpError(404, 'Player not found');
        }

        let updates = req.body;
        let addedAt = updates.addedAt;
        if (!Date.parse(addedAt)) {
            addedAt = formatDateToISO(addedAt);
        }

        updates = { ...updates, addedAt };

        if (await Player.exists({ email: updates.email, admin: player.admin })) {
            if (player.email !== updates.email) {
                const errMessage = `Ocurrio un error: El correo electrónico "${updates.email}" ya existe`;
                throw new HttpError(400, errMessage);
            }
        }

        const updatedPlayer = await Player.findByIdAndUpdate(playerId, updates, { new: true, session }).exec();

        await session.commitTransaction();
        session.endSession();

        return updatedPlayer;
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
    deletePlayer,
    createPlayersByFile
};
