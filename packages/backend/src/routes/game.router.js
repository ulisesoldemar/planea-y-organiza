const express = require('express');
const router = express.Router();
const controllers = require('../controllers');
const middlewares = require('../middlewares');

router.post('/join-room', controllers.rooms.joinRoom);
router.patch('/update-player/:playerId', middlewares.verifyAccessToken, controllers.players.updatePlayer);
router.post('/upload-score/:playerId', middlewares.verifyAccessToken, controllers.scores.uploadScore);
router.post('/logout', controllers.auth.logout);

module.exports = router;