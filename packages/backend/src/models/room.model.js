const mongoose = require('mongoose');
const { Schema } = mongoose;

const roomSchema = new Schema({
    roomNumber: { type: String, required: true, unique: true }, // Número de la sala, debe ser único
    roomName: { type: String, default: null }, // Número de la sala, debe ser único
    password: { type: String, required: true, minLength: 6 },
    createdAt: { type: Date, default: Date.now }, // Fecha de creación de la sala
    expiration: { type: Date, default: null }, // Fecha de caducidad de la sala (opcional)
    players: [{ type: Schema.Types.ObjectId, ref: 'Player' }], // Registro de los jugadores que se unieron a la sala
    quickStart: { type: Boolean, default: false }, // Con este campo, se permite iniciar la partida inmediatamente sin necesidad de que el admin la inicie
    status: { type: String, default: 'Open', enum: ['Open', 'Closed', 'Running'] }, // Estado de la partida
    admin: { type: Schema.Types.ObjectId, ref: 'UserAdmin', required: true }, // Que admin creo el room
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
