const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { requireAuth } = require('./middlewares/authMiddleware');
const adminRoutes = require('./routes/adminRoutes');
const playerRoutes = require('./routes/playerRoutes');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Configurar Express para manejar datos JSON y habilitar CORS
app.use(express.json());
app.use(cors());

// Configurar conexión a la base de datos MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/planea-y-organiza', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Ruta protegida, aquí obtendríamos las estadísticas del juego en tiempo real
app.get('/dashboard', requireAuth, (req, res) => {
    // Ejemplo de estadísticas del juego (reemplaza esto con tus estadísticas reales)
    const gameStats = {
        playersOnline: 0,
        // Otras estadísticas del juego...
    };

    // Emitir un evento personalizado 'gameStats' a todos los clientes conectados
    io.emit('gameStats', gameStats);

    return res.json({ message: 'Dashboard protegido, solo para administradores' });
});

// Usar las rutas de administrador y jugador
app.use('/admin', adminRoutes);
app.use('/player', playerRoutes);

// Evento de conexión de nuevos clientes
io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado:', socket.id);

    // Evento de desconexión
    socket.on('disconnect', () => {
        console.log('Cliente desconectado:', socket.id);
        // Aquí puedes agregar lógica adicional para manejar la desconexión del cliente, si es necesario.
    });
});

// Puerto para escuchar las solicitudes
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Servidor en funcionamiento en el puerto ${PORT}`);
});
