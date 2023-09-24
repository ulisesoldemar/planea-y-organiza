const express = require('express');
const controllers = require("../controllers");
const middlewares = require("../middlewares");
const router = express.Router();

router.use(middlewares.verifyAccessToken);

router.get('/', controllers.rooms.listRooms);
router.get('/:roomNumber', controllers.rooms.fetchRoom);
router.get('/:roomNumber/players', controllers.rooms.fetchRoomPlayers);

// Estas rutas requiren verificar el administrador
router.post('/', middlewares.validateAdmin, controllers.rooms.createRoom);
router.put('/:roomNumber', middlewares.validateAdmin, controllers.rooms.updateRoom);
router.delete('/:roomNumber', middlewares.validateAdmin, controllers.rooms.deleteRoom);
router.post('/add-player-to-room', middlewares.validateAdmin, controllers.rooms.addPlayerToRoom);
router.post('/add-players-to-room', middlewares.validateAdmin, controllers.rooms.addPlayersToRoom);
router.post('/remove-player-from-room', middlewares.validateAdmin, controllers.rooms.removePlayerFromRoom);
router.post('/remove-players-from-room', middlewares.validateAdmin, controllers.rooms.removePlayersFromRoom);

module.exports = router;
