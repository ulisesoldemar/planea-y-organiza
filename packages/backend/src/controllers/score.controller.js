const { Score, Player } = require('../models');
const { HttpError } = require('../error');
const { errorHandler, withTransaction } = require("../util");

const listScores = errorHandler(async (req, res) => {
    const adminId = req.userId; // Usamos el ID del admin del token
    const scores = await Score
        .find() // Filtrar por el ID del admin creador
        .exec();

    return scores;
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

    const player = await Player.findById(playerId).populate('scores').exec();

    if (!player) {
        throw new HttpError(404, 'Score no encontrada');
    }

    return player.scores;
});

module.exports = {
    uploadScore,
    listScores,
    fetchScore,
};
