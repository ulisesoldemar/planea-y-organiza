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

const usersByRoom = {};
const admins = {};

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

        //Registrar la sala si no existe
        if (!usersByRoom[roomNumber]) {
            usersByRoom[roomNumber] = [];
        }

        //Registrar al usuario en la sala si no esta en ella
        //Buscar al usuario
        const index = usersByRoom[roomNumber].findIndex(user => user.id === socket.id);

        if( index == -1){
            usersByRoom[roomNumber].push({
                id: socket.id,
                name: data.playerName
            });
        }

        //const usersInRoom = Array.from(io.sockets.adapter.rooms.get(roomNumber) || []);

        io.to(roomNumber).emit('updateUsersList', usersByRoom[roomNumber]);
        logger.info(`${data.playerName} se unio a ${roomNumber}`);
        logger.info(`Jugador ${data.playerName} se unio a ${data.roomNumber.toString()}`);
    });

    socket.on('adminJoined', (data) => {
        const roomNumber = data.roomNumber.toString();
        socket.join(roomNumber);
        
        //Registrar la sala si no existe
        if (!usersByRoom[roomNumber]) {
            usersByRoom[roomNumber] = [];
        }
        
        //Registrar al usuario en la sala si no esta en ella
        const index = usersByRoom[roomNumber].findIndex(user => user.id === socket.id);

        if( index == -1){
            usersByRoom[roomNumber].push({
                id: socket.id,
                name: data.adminName
            });
        }
        //const usersInRoom = Array.from(io.sockets.adapter.rooms.get(roomNumber) || []);

        io.to(roomNumber).emit('updateUsersList', usersByRoom[roomNumber]);
        logger.info(`Administrador ${data.adminName} se unio a ${data.roomNumber.toString()}`);
    });

    socket.on('startGame', (roomNumber) => {
        io.to(roomNumber).emit('gameStarted');
    });

    socket.on('disconnecting', () => {
        // Accede a la sala a la que estaba unido el usuario
        const roomNumber = Array.from(socket.rooms)[1];

        // // Abandonar la sala
        // socket.leave(roomNumber);
    
        // // Actualiza la lista de usuarios en la sala
        // const usersInRoom = Array.from(io.sockets.adapter.rooms.get(roomNumber) || []);
        // io.to(roomNumber).emit('updateUsersList', usersInRoom);
    
        // logger.info(`Usuario desconectado de la sala ${roomNumber}`);

        //Buscar al usuario 
        const index = usersByRoom[roomNumber].findIndex(user => user.id === socket.id);

        //Si lo encuentra lo elimina de la lista
        if(index != -1){
            usersByRoom[roomNumber].splice(index, 1);

            console.log('Usuario desconectado con el ID:', socket.id);
            console.log('Se desconecto del room', roomNumber);
            //Actualizar los usuarios
            io.to(roomNumber).emit('updateUsersList', usersByRoom[roomNumber]);

            //Eliminar la sala si ya no hay usuarios en ella
            if(usersByRoom[roomNumber].length == 0){
                console.log('No hay usuarios en la sala, se eliminara');
                delete usersByRoom[roomNumber];
            }
        }

    });

    socket.on("disconnect", () => {
        // socket.rooms.size === 0
    });

    // socket.on('room:username', (data) => {
    //     logger.info(data);
    //     io.emit('room:userJoined', data);
    // });
});

module.exports = server;
