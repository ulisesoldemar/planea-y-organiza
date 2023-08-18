import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';
import { api, socket } from '@/api'

export const useGame = defineStore('game', {
    state: () => ({
        isTimeOver: false,
        isGameComplete: false,
        quickStart: false,
        gameStarted: false,
        connectionStatus: useStorage('connectionStatus', []),
        playerData: useStorage('playerData', []),
        token: JSON.parse(localStorage.getItem('token')) || null,
    }),

    getters: {
        connected: state => state.connectionStatus >= 200 && state.connectionStatus < 300,
        started: state => state.quickStart || state.gameStarted
    },

    actions: {
        async joinRoom(formData) {
            try {
                const response = await api.post('/api/access/join-room/', formData);

                if (response.status >= 200 && response.status < 300) {
                    const { roomNumber, quickStart, player, accessToken, refreshToken } = response.data;
                    this.token = { accessToken, refreshToken };
                    this.playerData = player;
                    localStorage.setItem('token', JSON.stringify({ accessToken, refreshToken }));
                    this.connectionStatus = response.status;
                    this.quickStart = quickStart;
                    socket.connect();
                    socket.on('gameStarted', () => {
                        this.connectionStatus = true;
                    });
                    this.router.push('player-signup');
                }
            } catch (error) {
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    throw new Error('Credenciales de acceso no válidas');
                } else {
                    throw new Error('Error en el inicio de sesión. Inténtalo de nuevo más tarde');
                }
            }
        },

        async updatePlayer(formData) {
            try {
                const response = await api.patch(`/api/access/update-player/${this.playerData.id}`, formData, {
                    headers: {
                        Authorization: `Bearer ${this.token.accessToken}`
                    }
                });
                if (response.status >= 200 && response.status < 300) {
                    // if (this.quickStart) {
                        this.router.push('instructions');
                    // }
                } else {
                    throw new Error('Error al actualizar los datos. Inténtalo de nuevo más tarde');
                }
            } catch (error) {
                throw new Error('Error al actualizar los datos. Inténtalo de nuevo más tarde');
            }

        }
    },
});