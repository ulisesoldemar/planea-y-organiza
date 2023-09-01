const express = require('express');
const routes = require('./routes');
const cors = require('cors')
const connectToDatabase = require('./database');
const logger = require('./logger');

const http = require('http');
const socketIo = require('socket.io');

const app = express();
const port = process.env.PORT || 3000
const corsOptions = {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());

app.use('/api', routes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.statusCode || 500)
        .send({ error: err.message });
});

const server = http.createServer(app);

// Configura Socket.io para utilizar el servidor http
const io = socketIo(server, {
    cors: {
        origin: process.env.CORS_ORIGIN, // Configura el origen permitido
        // methods: ["GET", "POST"], // Métodos permitidos
        credentials: true // Habilita el envío de cookies en las solicitudes CORS
    }
});

// Configura eventos de Socket.io y manejo de conexiones aquí
io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado:', socket.id);

    // Ejemplo: Escucha un evento personalizado y reenvía datos a todos los clientes
    socket.on('updateData', (data) => {
        console.log(data);
        // Envia el evento a todos los clientes conectados
        io.emit('updateData', data);
    });

    socket.on('startGame', () => {
        io.emit('gameStarted');
    });

    // Manejar otros eventos aquí...
});

async function startServer() {
    await connectToDatabase();

    server.listen(port, () => {
        logger.info(`Server listening at http://localhost:${port}`);
    });
}

module.exports = startServer;