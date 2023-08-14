import axios from 'axios';
import io from 'socket.io-client';

const backendUrl = process.env.VUE_APP_BACKEND_URL;

const api = axios.create({
    baseURL: backendUrl,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: true,
});

const socket = io(backendUrl, { autoConnect: false });

socket.on('connect', () => {
    console.log('Conexión establecida con el servidor Socket.io');
});

socket.on('disconnect', () => {
    console.log('Desconexión del servidor Socket.io');
});

export { api, socket };