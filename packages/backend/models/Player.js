const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    score: {
        type: Number,
        default: 0,
    },
    roomId: { // Nueva propiedad para el ID de la sala a la que se unió el jugador
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
    },
});

const Player = mongoose.model('Player', playerSchema);

module.exports = Player;
