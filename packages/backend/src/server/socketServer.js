const http = require('http');
const socketIo = require('socket.io');
const { app } = require('./expressServer'); // Importa el módulo del servidor Express
const logger = require('../logger');

const server = http.createServer(app);

const io = socketIo(server, {
    cors: {
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    }
});

io.on('connection', (socket) => {
    logger.info(`Nuevo cliente conectado: ${socket.id}`);

    socket.on('joinRoom', (data) => {
        socket.join(data.roomNumber.toString());
        logger.info(`${data.playerName} se unio a ${data.roomNumber.toString()}`)
    });

    socket.on('startGame', (roomNumber) => {
        io.to(roomNumber).emit('gameStarted');
    });

    // socket.on('room:username', (data) => {
    //     logger.info(data);
    //     io.emit('room:userJoined', data);
    // });
});

module.exports = server;
