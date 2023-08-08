const mongoose = require('mongoose');
const { Schema } = mongoose;

const playerSchema = new Schema({
    firstName: { type: String, required: true },
    firstLastName: { type: String, required: true },
    secondLastName: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    age: { type: Number, required: true },
    roomId: { type: Number, default: null }, // Almacena el número de sala a la que el jugador tiene acceso
    score: { type: Number, default: 0 },
});

const Player = mongoose.model('Player', playerSchema);

module.exports = Player;
