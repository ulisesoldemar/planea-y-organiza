const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const playerSchema = new Schema({
    firstName: { type: String },
    surName: { type: String },
    secondSurName: { type: String },
    email: { type: String, unique: true },
    phone: { type: String, unique: true, },
    age: { type: Number },
    score: { type: Number, default: 0 },
    distance: { type: Number, default: 0 },
    transitions: [{ type: Number }],
    room: { type: Schema.Types.ObjectId, ref: 'Room' },
    admin: { type: Schema.Types.ObjectId, ref: 'UserAdmin' },
});

const Player = model('Player', playerSchema);

module.exports = Player;
