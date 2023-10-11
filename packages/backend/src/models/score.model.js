const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const scoreSchema = new Schema({
    date: { type: Date, default: Date.now() },
    time: { type: Number },
    distance: { type: Number, default: 0 },
    distancePerSection: [Number],
    transitions: [Object],
    patterns: [[Object]],
    fullPattern: [Object],
    enteredBalls: { type: Number, default: 0 },
    score: { type: Number, default: 0 },
});

const Score = model('Score', scoreSchema);

module.exports = Score;