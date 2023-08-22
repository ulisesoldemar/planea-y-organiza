const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const playerSchema = new Schema({
    firstName: { type: String },
    surName: { type: String },
    secondSurName: { type: String },
    email: { type: String, unique: true },
    phone: { type: String, unique: true, },
    age: { type: Number },
    room: { type: Schema.Types.ObjectId, ref: 'Room' },
    addedAt: { type: Date, default: Date.now() }, // La primera vez que se registra el sujeto
    firstDistance: { type: Number, default: 0 },
    lastDistance: { type: Number, default: 0 },
    firstScore: { type: Number, default: 0 },
    lastScore: { type: Number, default: 0 },
    transitions: [{ type: Number }],
    firstPlayedAt: { type: Date }, // Última vez que se hizo la prueba
    lastPlayedAt: { type: Date }, // Última vez que se hizo la prueba
    admin: { type: Schema.Types.ObjectId, ref: 'UserAdmin' },
});

const Player = model('Player', playerSchema);

module.exports = Player;
