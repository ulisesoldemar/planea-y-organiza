import axios from 'axios';
import io from 'socket.io-client';

const backendUrl = process.env.VUE_APP_BACKEND_URL;
const socketsUrl = process.env.VUE_APP_SOCKETS_URL;

const api = axios.create({
    baseURL: backendUrl,
    withCredentials: true,
});

const socket = io(socketsUrl, { autoConnect: false });

socket.on('connect', () => {
    console.log('Conexión establecida con el servidor Socket.io');
});

socket.on('disconnect', () => {
    console.log('Desconexión del servidor Socket.io');
});

export { api, socket };