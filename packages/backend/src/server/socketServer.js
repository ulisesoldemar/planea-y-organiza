const http = require('http');
const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const { app } = require('./expressServer'); // Importa el módulo del servidor Express
const { HttpError } = require('../error');
const logger = require('../logger');

const server = http.createServer(app);

const io = socketIo(server, {
    cors: {
        origin: process.env.CORS_ORIGIN.split(','),
        credentials: true,
    }
});

const users = new Map();
const rooms = new Map();
const admins = new Map();

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

        if (users[roomNumber]) {
            users[roomNumber].push({
                id: socket.id,
                name: data.playerName
            });
        } else {
            users[roomNumber] = [{
                id: socket.id,
                name: data.playerName
            }];
        }

        io.to(roomNumber).emit('updateUsersList', users[roomNumber]);
        logger.info(`Jugador ${data.playerName} se unio a ${roomNumber}`);
    });

    socket.on('adminJoined', (data) => {
        const roomNumber = data.roomNumber.toString();
        socket.join(roomNumber);
        io.to(roomNumber).emit('updateUsersList', users[roomNumber]);
        logger.info(`Administrador ${data.adminName} se unio a ${data.roomNumber.toString()}`);
    });

    socket.on('startGame', (roomNumber) => {
        io.to(roomNumber).emit('gameStarted');
    });

    socket.on('disconnect', () => {
        logger.info(`Cliente desconectado: ${socket.id}`);
        for (const [roomNumber, userList] of Object.entries(users)) {
            const index = userList.findIndex(user => user.id === socket.id);
            if (index !== -1) {
                userList.splice(index, 1);
                io.to(roomNumber).emit('updateUsersList', userList);
                logger.info(`Jugador desconectado de la sala ${roomNumber}`);
                break;
            }
        }
    });
    
});

module.exports = server;
