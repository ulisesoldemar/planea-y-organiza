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
const notifications = new Map();  
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

        //Get the current time
        const today = new Date();
        const hours = today.getHours();
        const minutes = today.getMinutes();
        const period = hours < 12 ? 'am' : 'pm';

        if (notifications[roomNumber]) {
            notifications[roomNumber].push({
                text: `${data.playerName} se unio a la sala`,
                time: `${hours % 12}:${minutes < 10 ? '0' : ''}${minutes} ${period}`,
            });
        } else {

            notifications[roomNumber] = [{
                text: `${data.playerName} se unio a la sala`,
                time: `${hours % 12}:${minutes < 10 ? '0' : ''}${minutes} ${period}`,
            }];
        }
        

        io.to(roomNumber).emit('updateUsersList', users[roomNumber]);
        io.to(roomNumber).emit('updateNotificationsList', notifications[roomNumber]);
        logger.info(`Jugador ${data.playerName} se unio a ${roomNumber}`);
    });

    socket.on('adminJoined', (data) => {
        const roomNumber = data.roomNumber.toString();
        socket.join(roomNumber);
        io.to(roomNumber).emit('updateNotificationsList', notifications[roomNumber]);
        io.to(roomNumber).emit('updateUsersList', users[roomNumber]);
        logger.info(`Administrador ${data.adminName} se unio a ${data.roomNumber.toString()}`);
    });

    socket.on('startGame', (roomNumber) => {
        //Get the current time
        const today = new Date();
        const hours = today.getHours();
        const minutes = today.getMinutes();
        const period = hours < 12 ? 'am' : 'pm';

        if (notifications[roomNumber]) {
            notifications[roomNumber].push({
                text: `${data.playerName} se unio a la sala`,
                time: `${hours % 12}:${minutes < 10 ? '0' : ''}${minutes} ${period}`,
            });
        } else {

            notifications[roomNumber] = [{
                text: `${data.playerName} se unio a la sala`,
                time: `${hours % 12}:${minutes < 10 ? '0' : ''}${minutes} ${period}`,
            }];
        }

        io.to(roomNumber).emit('updateNotificationsList', notifications[roomNumber]);
        io.to(roomNumber).emit('gameStarted');
    });

    socket.on('disconnect', () => {
        logger.info(`Cliente desconectado: ${socket.id}`);
        for (const [roomNumber, userList] of Object.entries(users)) {
            const index = userList.findIndex(user => user.id === socket.id);
            if (index !== -1) {
                //If user where founded send notification of disconnect
                const today = new Date();
                const hours = today.getHours();
                const minutes = today.getMinutes();
                const period = hours < 12 ? 'am' : 'pm';

                notifications[roomNumber].push({
                    text: `${userList[index].name} se desconectó de la sala`,
                    time: `${hours % 12}:${minutes < 10 ? '0' : ''}${minutes} ${period}`,
                });

                userList.splice(index, 1);
                io.to(roomNumber).emit('updateNotificationsList', notifications[roomNumber]);
                io.to(roomNumber).emit('updateUsersList', userList);
                logger.info(`Jugador desconectado de la sala ${roomNumber}`);

                //Delete all the notifications if no One is on the room
                if(notifications[roomNumber]){
                    if (userList.length == 0) {
                        logger.info(`Se eliminaron las notificaciones de la sala ${roomNumber}`);
                        // const indexNoti = notifications.findIndex(room => room === roomNumber);
                        // notifications.splice(indexNoti, 1);
                      }
                }

                break;
            }
        }
    });
    
});

module.exports = server;
