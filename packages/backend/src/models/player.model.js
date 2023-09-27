const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const playerSchema = new Schema({
    firstName: { type: String },
    surName: { type: String },
    secondSurName: { type: String },
    email: { type: String, unique: true },
    phone: { type: String, unique: true, },
    age: { type: Number },
    addedAt: { type: Date, default: Date.now() }, // La primera vez que se registra el sujeto
    firstPlayedAt: { type: Date }, // Última vez que se hizo la prueba
    lastPlayedAt: { type: Date }, // Última vez que se hizo la prueba
    canPlay: { type: Boolean, default: true },
    admin: { type: Schema.Types.ObjectId, ref: 'UserAdmin' },
    scores: [{ type: Schema.Types.ObjectId, ref: 'Score', default: null }],
});

const Player = model('Player', playerSchema);

module.exports = Player;
