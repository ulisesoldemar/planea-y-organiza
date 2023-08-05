const jwt = require('jsonwebtoken');
const Player = require('../models/Player'); // Importar el modelo Player

// Middleware para generar un token personalizado para el jugador
const generatePlayerToken = async (req, res, next) => {
    const { token } = req.body;

    try {
        // Verificar el token proporcionado por el administrador
        const decodedToken = jwt.verify(token, 'your_secret_key_here');

        // Buscar el jugador en la base de datos utilizando la información del token
        const player = await Player.findById(decodedToken.id);
        if (!player) {
            return res.status(401).json({ message: 'Jugador no encontrado' });
        }

        // Generar un nuevo token JWT para el jugador con una duración de expiración
        const playerToken = jwt.sign({ id: player._id }, 'your_player_secret_key_here', {
            expiresIn: '24h', // Personaliza el tiempo de expiración según tus necesidades
        });

        // Agregar el token de jugador al objeto de solicitud para su uso posterior
        req.playerToken = playerToken;

        return next();
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido' });
    }
};

module.exports = {
    generatePlayerToken,
};
