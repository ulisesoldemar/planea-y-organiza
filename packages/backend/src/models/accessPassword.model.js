const mongoose = require('mongoose');
const { Schema } = mongoose;

const accessPasswordSchema = new Schema({
    password: { type: String, required: true, unique: true },
    roomNumber: { type: Number, default: null },
    idUsed: { type: Boolean, default: false },
});

const AccessPassword = mongoose.model('AccessPassword', accessPasswordSchema);

module.exports = AccessPassword;
