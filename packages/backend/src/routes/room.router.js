const express = require('express');
const controllers = require("../controllers");
const middlewares = require("../middlewares");
const router = express.Router();

router.get('/', middlewares.verifyAccessToken, controllers.rooms.listRooms);
router.post('/', middlewares.verifyAccessToken, controllers.rooms.createRoom);
router.get('/:roomNumber', middlewares.verifyAccessToken, controllers.rooms.fetchRoom);
router.put('/:roomNumber', middlewares.verifyAccessToken, controllers.rooms.updateRoom);
router.delete('/:roomNumber', middlewares.verifyAccessToken, controllers.rooms.deleteRoom);
router.post('/add-player-to-room', middlewares.verifyAccessToken, controllers.rooms.addPlayerToRoom);

module.exports = router;
