// routes/playerRoutes.js
const express = require('express');
const jwt = require('jsonwebtoken');
const Player = require('../models/Player');
const Room = require('../models/Room');

const router = express.Router();

// Ruta para que el jugador se una a una sala específica
router.post('/join-room', async (req, res) => {
    const { roomId, token } = req.body;

    try {
        // Verificar el token proporcionado por el jugador
        const decodedToken = jwt.verify(token, 'your_player_secret_key_here');

        // Buscar al jugador en la base de datos utilizando la información del token
        const player = await Player.findById(decodedToken.id);
        if (!player) {
            return res.status(401).json({ message: 'Jugador no encontrado' });
        }

        // Verificar si la sala existe en la base de datos
        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ message: 'Sala no encontrada' });
        }

        // Asignar la sala al jugador en la base de datos
        player.roomId = roomId;
        await player.save();

        // Aquí podrías realizar alguna acción adicional, si es necesario, antes de enviar la respuesta
        return res.json({ message: 'Jugador unido a la sala exitosamente' });
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido' });
    }
});

module.exports = router;
