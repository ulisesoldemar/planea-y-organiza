const express = require('express');
const controllers = require("../controllers");
const middlewares = require("../middlewares");
const router = express.Router();

router.get('/me', middlewares.verifyAccessToken, controllers.admins.me);
router.get('/rooms', middlewares.verifyAccessToken, controllers.rooms.listRooms);
router.post('/create-room', middlewares.verifyAccessToken, controllers.rooms.createRoom);
router.post('/add-password', middlewares.verifyAccessToken, controllers.rooms.addAccessPassword);

module.exports = router;