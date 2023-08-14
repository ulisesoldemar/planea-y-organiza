const express = require('express');
const middlewares = require('../middlewares');
const router = express.Router()
const { Player } = require('../models');
const { errorHandler, withTransaction } = require("../util");

const signup = errorHandler(withTransaction(async (req, res, session) => {
    const playerDoc = new Player({
        firstName: req.body.firstName,
        surName: req.body.surName,
        secondSurName: req.body.secondSurName,
        email: req.body.email,
        age: req.body.age,
    });

    return playerDoc;
}));

router.post('/signup', middlewares.verifyAccessToken, signup);

module.exports = router;