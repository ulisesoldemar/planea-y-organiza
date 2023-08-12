// store/socketStore.js
import { defineStore } from 'pinia';
import { io } from 'socket.io-client';

const socketServerUrl = process.env.VUE_APP_BACKEND_URL;

export const useSockets = defineStore('socket', {
    state: () => ({
        socket: null,
    }),

    actions: {
        connectSocket() {
            // Establece la conexión con el servidor de WebSocket
            this.socket = io(socketServerUrl);

            // Configura los eventos y manejadores aquí...
        },

        disconnectSocket() {
            // Cierra la conexión con el servidor de WebSocket
            if (this.socket) {
                this.socket.disconnect();
            }
        },

        sendData(data) {
            if (this.socket) {
                this.socket.emit('enviarDatos', data);
            }
        },

        setupEventListeners() {
            if (this.socket) {
                this.socket.on('datosRecibidos', (data) => {
                    console.log('Datos recibidos desde el servidor:', data);
                });

                // Configura otros manejadores de eventos aquí...
            }
        },
    },
});
