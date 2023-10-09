const express = require('express');
const controllers = require("../controllers");
const middlewares = require("../middlewares");
const router = express.Router();

router.use(middlewares.verifyAccessToken);

// Obtener una lista de jugadores
router.get('/', controllers.players.listPlayers);
router.get('/:playerId', controllers.players.getPlayer);

// Crear un nuevo jugador
router.post('/', middlewares.validateAdmin, controllers.players.createPlayer);
router.post('/file', middlewares.validateAdmin, controllers.players.createPlayersByFile);
router.patch('/:playerId', middlewares.validateAdmin, controllers.players.updatePlayer);
router.delete('/:playerId', middlewares.validateAdmin, controllers.players.deletePlayer);

module.exports = router;
