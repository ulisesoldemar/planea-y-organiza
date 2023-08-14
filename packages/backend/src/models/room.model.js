const mongoose = require('mongoose');
const { Schema } = mongoose;

const roomSchema = new Schema({
    roomNumber: { type: Number, required: true, unique: true }, // Número de la sala, debe ser único
    roomName: { type: String, default: null }, // Número de la sala, debe ser único
    createdAt: { type: Date, default: Date.now }, // Fecha de creación de la sala
    expiration: { type: Date, default: null }, // Fecha de caducidad de la sala (opcional)
    accessPasswords: [{ type: Schema.Types.ObjectId, ref: 'AccessPassword' }], // Registro de los jugadores que se unieron a la sala
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
