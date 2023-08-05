// routes/adminRoutes.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { requireAuth } = require('../middlewares/authMiddleware'); // Importar el middleware de autenticación
const Admin = require('../models/Admin');

const router = express.Router();

// Ruta de inicio de sesión del administrador
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(401).json({ message: 'Admin no encontrado' });
        }

        // Comprobar la contraseña utilizando bcrypt
        const isValidPassword = await bcrypt.compare(password, admin.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        // Generar el token JWT
        const token = jwt.sign({ id: admin._id }, 'your_secret_key_here');
        return res.json({ token });
    } catch (error) {
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Ruta protegida para obtener el perfil del administrador autenticado
// Ruta para que el administrador genere un token personalizado para el jugador
router.post('/generate-player-token', requireAuth, async (req, res) => {
    const { playerId } = req.body;

    try {
        // Verificar si el jugador existe en la base de datos
        const player = await Player.findById(playerId);
        if (!player) {
            return res.status(404).json({ message: 'Jugador no encontrado' });
        }

        // Generar un nuevo token JWT para el jugador con una duración de expiración
        const playerToken = jwt.sign({ id: player._id }, 'your_player_secret_key_here', {
            expiresIn: '1h', // Personaliza el tiempo de expiración según tus necesidades
        });

        return res.json({ playerToken });
    } catch (error) {
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
});

module.exports = router;
