import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';
import { api, socket } from '@/api'

export const useGame = defineStore('game', {
    state: () => ({
        isTimeOver: false,
        isGameComplete: false,
        connected: useStorage('connected', false),
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
                const response = await api.post('/api/room/join-room/', formData);

                if (response.status >= 200 && response.status < 300) {
                    const { accessToken, refreshToken, player } = response.data;

                    this.token = { accessToken, refreshToken };
                    this.playerData = player;
                    localStorage.setItem('token', JSON.stringify({ accessToken, refreshToken }));
                    this.connected = true;
                    console.log(this.token);
                    this.router.push('test');
                }

            } catch (error) {
                console.error('Error al intentar unirse a la sala:', error);

            }
        },
    },
});