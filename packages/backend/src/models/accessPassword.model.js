const mongoose = require('mongoose');
const { Schema } = mongoose;

const accessTokenSchema = new Schema({
    password: { type: String, required: true, unique: true },
    roomNumber: { type: Number, default: null },
    player: { type: Schema.Types.ObjectId, ref: 'Player' },
    idUsed: { type: Boolean, required: true, default: false },
});

const AccessToken = mongoose.model('AccessToken', accessTokenSchema);

module.exports = AccessToken;
