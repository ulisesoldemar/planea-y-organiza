const express = require('express');
const controllers = require("../controllers");
const middlewares = require("../middlewares");
const router = express.Router();

// Obtener una lista de jugadores
router.get('/', middlewares.verifyAccessToken, controllers.players.listPlayers);

// Crear un nuevo jugador
router.post('/', middlewares.verifyAccessToken, controllers.players.createPlayer);

// Obtener datos de un jugador específico
router.get('/:playerId', middlewares.verifyAccessToken, controllers.players.getPlayer);

// Actualizar los datos de un jugador
router.patch('/:playerId', middlewares.verifyAccessToken, controllers.players.updatePlayer);

// Eliminar un jugador
router.delete('/:playerId', middlewares.verifyAccessToken, controllers.players.deletePlayer);

module.exports = router;
