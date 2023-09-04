const express = require('express');
const roomRoutes = require('./room.router');
const playerRoutes = require('./player.router');
const scoreRoutes = require('./score.router');
const controllers = require("../controllers");
const middlewares = require("../middlewares");
const router = express.Router();

router.get('/me', middlewares.verifyAccessToken, controllers.admins.me);
router.patch('/me', middlewares.verifyAccessToken, controllers.admins.updateAdminData); // Ruta para actualizar datos de admin
router.use('/rooms', roomRoutes);
router.use('/players', playerRoutes);
router.use('/scores', scoreRoutes);

//Obtener la lista de AdminUsers
router.get('/', controllers.admins.listAdminUsers);
router.get('/:adminUserId', controllers.admins.getAdminUser);

//Crear un nuevo admin User
router.post('/', middlewares.verifyAccessToken, controllers.admins.createAdminUser);
// Update
router.patch('/:adminUserId', middlewares.verifyAccessToken, controllers.admins.updateAdminUser);
// Update password
router.patch('/password/:adminUserId', middlewares.verifyAccessToken, controllers.admins.updatePassword);
// Update Avatar
router.patch('/avatar/:adminUserId', middlewares.verifyAccessToken, controllers.admins.updateAvatar);
// Delete
router.delete('/:adminUserId', middlewares.verifyAccessToken, controllers.admins.deleteAdminUser);

module.exports = router;
