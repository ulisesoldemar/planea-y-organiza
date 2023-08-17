const router = require('express').Router();
const authRouter = require('./auth.router');
const adminsRouter = require('./admin.router');
const accessRouter = require('./roomAccess.router');

router.use('/auth', authRouter);
router.use('/admin', adminsRouter);
router.use('/access/', accessRouter);

module.exports = router;