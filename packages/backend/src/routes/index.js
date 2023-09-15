const router = require('express').Router();
const authRouter = require('./auth.router');
const adminsRouter = require('./admin.router');
const gameRouter = require('./game.router');

router.use('/auth', authRouter);
router.use('/admin', adminsRouter);
router.use('/game', gameRouter);

module.exports = router;