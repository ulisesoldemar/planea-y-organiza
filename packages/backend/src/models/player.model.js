const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const playerSchema = new Schema({
    firstName: { type: String },
    surName: { type: String },
    secondSurName: { type: String },
    email: { type: String, unique: true },
    phone: { type: String },
    age: { type: Number },
    uniqueAccessCode: { type: Schema.Types.ObjectId, ref: 'AccessCode' },
    roomNumber: { type: Number },
    score: { type: Number, default: 0 },
    distance: { type: Number, default: 0 },
    transitions: [{ type: Number }],
});

const Player = model('Player', playerSchema);

module.exports = Player;
