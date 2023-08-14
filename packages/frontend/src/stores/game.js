import { defineStore } from 'pinia';
import { api, socket } from '@/api'

export const useGame = defineStore('game', {
    state: () => ({
        connected: false,
        isTimeOver: false,
        isGameComplete: false,
    }),

    actions: {
        connect() {
            socket.connect();
            this.connected = true;
        },

        disconnect() {
            socket.disconnect(),
                this.connected = false;
        },

        updateData(data) {
            socket.emit('updateData', data);
        },

        setTimeOver(completed) {
            this.isTimeOver = completed;
        },

        setGameComplete(completed) {
            this.isGameComplete = completed;
        },

        async joinRoom(formData) {
            try {
                const response = await api.post('/api/rooms/join-room/', formData);

            } catch (error) {
                console.error('Error al intentar unirse a la sala:', error);
                
            }
        }
    },
});