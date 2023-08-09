const express = require('express');
const controllers = require("../controllers");
const router = express.Router();

router.post('/join-room', controllers.rooms.joinRoom);

module.exports = router;