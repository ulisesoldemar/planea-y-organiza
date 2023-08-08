const express = require('express');
const controllers = require("../controllers");
const middlewares = require("../middlewares");
const router = express.Router();

router.get('/room', middlewares.verifyAccessToken, controllers.users.me);
router.post('/create-room', controllers.rooms.createRoom);

module.exports = router;