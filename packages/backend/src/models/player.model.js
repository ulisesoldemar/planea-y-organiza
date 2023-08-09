const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const userBaseSchema = require('./user.model'); // Importar el esquema base

const playerSchema = new Schema({
    ...userBaseSchema.obj, // Extender con los campos del esquema base
    age: { type: Number, required: true },
    score: { type: Number, default: 0 },
});

const Player = model('Player', playerSchema);

module.exports = Player;
