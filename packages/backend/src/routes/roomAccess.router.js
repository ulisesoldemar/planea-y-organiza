const express = require('express');
const router = express.Router();
const controllers = require('../controllers');
const middlewares = require('../middlewares');

router.post('/join-room', controllers.rooms.joinRoom);
router.patch('/update-player/:playerId', middlewares.verifyAccessToken, controllers.players.updatePlayer);

module.exports = router;