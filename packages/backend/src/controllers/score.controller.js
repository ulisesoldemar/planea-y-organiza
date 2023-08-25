const { Score, Player } = require('../models');
const { HttpError } = require('../error');
const { errorHandler, withTransaction } = require("../util");

const listScores = errorHandler(async (req, res) => {
    const adminId = req.userId; // Usamos el ID del admin del token
    const rooms = await Score
        .find() // Filtrar por el ID del admin creador
        .exec();

    return rooms;
});

const uploadScore = errorHandler(withTransaction(async (req, res, session) => {
    const { playerId } = req.params;

    const playerDoc = await Player.findOne({ _id: playerId });

    if (!playerDoc) {
        throw new HttpError(404, 'User not found');
    }

    const newScore = new Score(req.body);
    await newScore.save({ session });
    playerDoc.scores.push(newScore);
    await playerDoc.save({ session });

}));

const fetchScore = errorHandler(async (req, res) => {
    const { playerId } = req.params;

    const score = await score.findOne({ player: playerId }).exec();

    if (!room) {
        throw new HttpError(404, 'Score no encontrada');
    }

    return room;
});

module.exports = {
    uploadScore,
    listScores,
    fetchScore,
};
