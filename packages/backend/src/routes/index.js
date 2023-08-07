const router = require('express').Router();
const authRouter = require('./auth');
const usersRouter = require('./users');
const roomsRouter = require('./rooms');

router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/rooms', roomsRouter);

module.exports = router;