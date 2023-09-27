const express = require('express');
const controllers = require("../controllers");
const middlewares = require("../middlewares");
const router = express.Router();

router.use(middlewares.verifyAccessToken);
// router.use(middlewares.validateAdmin);

// Obtener una lista de jugadores
router.get('/', controllers.scores.listScores);
router.get('/:playerId', controllers.scores.fetchScore);

module.exports = router;
