const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const accessCodeSchema = new Schema({
    code: { type: String, required: true, unique: true },
    used: { type: Boolean, default: false },
    expiration: { type: Date, default: null },
});

const AccessCode = model('AccessCode', accessCodeSchema);

module.exports = AccessCode;