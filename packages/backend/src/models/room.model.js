const mongoose = require('mongoose');
const { Schema } = mongoose;

const roomSchema = new Schema({
    roomNumber: { type: Number, required: true, unique: true }, // Número de la sala, debe ser único
    password: { type: String, required: true }, // Contraseña de la sala
    createdAt: { type: Date, default: Date.now }, // Fecha de creación de la sala
    expiration: { type: Date, default: null }, // Fecha de caducidad de la sala (opcional)
    players: [{ type: Schema.Types.ObjectId, ref: 'Player' }], // Registro de los jugadores que se unieron a la sala
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
