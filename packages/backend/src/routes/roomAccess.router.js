const express = require('express');
const router = express.Router();
const controllers = require('../controllers');

router.post('/join-room', controllers.rooms.joinRoom);

module.exports = router;