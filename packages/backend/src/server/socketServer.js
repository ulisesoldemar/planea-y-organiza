const http = require('http');
const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const { app } = require('./expressServer'); // Importa el módulo del servidor Express
const { HttpError } = require('../error');
const logger = require('../logger');

const server = http.createServer(app);

const io = socketIo(server, {
    cors: {
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    }
});


io.use((socket, next) => {
    // Validacion de credenciales
    if (socket.handshake.query && socket.handshake.query.token) {
        jwt.verify(socket.handshake.query.token, process.env.JWT_SECRET_KEY, (err, decoded) => {
            if (err) {
                throw new HttpError(401, 'Authentication Error');
            }
            socket.decoded = decoded;
            next();
        })
    } else {
        throw new HttpError(401, 'Authentication Error');
    }
}).on('connection', (socket) => {
    logger.info(`Nuevo cliente conectado: ${socket.id}`);

    socket.on('joinRoom', (data) => {
        const roomNumber = data.roomNumber.toString();
        socket.join(roomNumber);
        const usersInRoom = Array.from(io.sockets.adapter.rooms.get(roomNumber) || []);
        io.to(roomNumber).emit('updateUsersList', usersInRoom);
        logger.info(`${data.playerName} se unio a ${roomNumber}`);
    });

    socket.on('adminJoined', (data) => {
        const roomNumber = data.roomNumber.toString();
        socket.join(roomNumber);
        const usersInRoom = Array.from(io.sockets.adapter.rooms.get(roomNumber) || []);
        io.to(roomNumber).emit('updateUsersList', usersInRoom);
        logger.info(`Administrador ${data.adminName} se unio a ${data.roomNumber.toString()}`);
    });

    socket.on('startGame', (roomNumber) => {
        io.to(roomNumber).emit('gameStarted');
    });

    socket.on('disconnecting', () => {
        // Accede a la sala a la que estaba unido el usuario
        console.log(socket.rooms)
        // const roomNumber = socket.rooms.values().next().value;
    
        // // Abandonar la sala
        // socket.leave(roomNumber);
    
        // // Actualiza la lista de usuarios en la sala
        // const usersInRoom = Array.from(io.sockets.adapter.rooms.get(roomNumber) || []);
        // io.to(roomNumber).emit('updateUsersList', usersInRoom);
    
        // logger.info(`Usuario desconectado de la sala ${roomNumber}`);
    });

    // socket.on('room:username', (data) => {
    //     logger.info(data);
    //     io.emit('room:userJoined', data);
    // });
});

module.exports = server;
