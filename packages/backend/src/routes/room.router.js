const express = require('express');
const controllers = require("../controllers");
const middlewares = require("../middlewares");
const router = express.Router();

router.use(middlewares.verifyAccessToken);

router.get('/', controllers.rooms.listRooms);
router.get('/:roomNumber', controllers.rooms.fetchRoom);

// Estas rutas requiren verificar el administrador
router.post('/', middlewares.validateAdmin, controllers.rooms.createRoom);
router.put('/:roomNumber', middlewares.validateAdmin, controllers.rooms.updateRoom);
router.delete('/:roomNumber', middlewares.validateAdmin, controllers.rooms.deleteRoom);
router.post('/add-player-to-room', middlewares.validateAdmin, controllers.rooms.addPlayerToRoom);
router.post('/add-players-to-room', middlewares.validateAdmin, controllers.rooms.addPlayersToRoom);

module.exports = router;
