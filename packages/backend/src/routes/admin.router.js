const express = require('express');
const roomRoutes = require('./room.router');
const playerRoutes = require('./player.router');
const controllers = require("../controllers");
const middlewares = require("../middlewares");
const router = express.Router();

router.get('/me', middlewares.verifyAccessToken, controllers.admins.me);
router.patch('/me', middlewares.verifyAccessToken, controllers.admins.updateAdminData); // Ruta para actualizar datos de admin
router.use('/rooms', roomRoutes);
router.use('/players', playerRoutes);

module.exports = router;
