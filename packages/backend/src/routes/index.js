const router = require('express').Router();
const authRouter = require('./auth.router');
const adminsRouter = require('./admin.router');

router.use('/auth', authRouter);
router.use('/admin', adminsRouter);

module.exports = router;