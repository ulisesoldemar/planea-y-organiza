const router = require('express').Router();
const authRouter = require('./auth');
const adminsRouter = require('./admins');
const roomsRouter = require('./rooms');
const playersRouter = require('./player');

router.use('/auth', authRouter);
router.use('/admin', adminsRouter);
router.use('/room', roomsRouter);
router.use('/player', playersRouter);

module.exports = router;