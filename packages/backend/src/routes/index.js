const router = require('express').Router();
const authRouter = require('./auth');
const adminsRouter = require('./admins');
const roomsRouter = require('./rooms');

router.use('/auth', authRouter);
router.use('/admins', adminsRouter);
router.use('/rooms', roomsRouter);

module.exports = router;