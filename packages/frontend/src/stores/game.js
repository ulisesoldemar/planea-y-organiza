import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';
import { api, socket } from '@/api'

export const useGame = defineStore('game', {
    state: () => ({
        isTimeOver: false,
        isGameComplete: false,
        quickStart: false,
        gameStarted: false,
        maxTime: useStorage('maxTime', 0),
        connectionStatus: useStorage('connectionStatus', []),
        playerData: useStorage('playerData', []),
        roomNumber: useStorage('roomNumber', []),
        roomId: useStorage('roomId', []),
        token: JSON.parse(localStorage.getItem('token')) || null,
        currentSession: useStorage('currentSession', []),
    }),

    getters: {
        connected: state => state.connectionStatus >= 200 && state.connectionStatus < 300,
        started: state => state.quickStart || state.gameStarted,
        gameTime: state => state.maxTime,
    },

    actions: {
        async handleError(actionName, error) {
            console.error(`Error in ${actionName}:`, error);
            // Puedes implementar aquí la lógica para mostrar mensajes de error en la interfaz de usuario si lo deseas.
        },

        async joinRoom(formData) {
            try {
                const response = await api.post('/api/game/join-room/', formData);

                if (response.status >= 200 && response.status < 300) {
                    const { roomId, roomNumber, maxTime, status, expiration, quickStart, player, accessToken, refreshToken } = response.data;
                    console.log('Entro status 200')

                    if (status === 'Closed' || Date.now() > Date.parse(expiration)) {
                        return false;
                    }
                    this.token = { accessToken, refreshToken };
                    this.playerData = player;
                    this.roomId = roomId;
                    this.roomNumber = roomNumber;
                    this.maxTime = maxTime;
                    localStorage.setItem('token', JSON.stringify({ accessToken, refreshToken }));
                    this.connectionStatus = response.status;
                    this.quickStart = quickStart;
                    this.currentSession = 1;

                    const joinData = {
                        roomNumber: roomNumber,
                        playerId: this.playerData.id,
                        playerName: `${this.playerData.firstName} ${this.playerData.surName} ${this.playerData.secondSurName || ''}`,
                    };

                    if (!socket.connected) {
                        socket.io.opts.query = { token: this.token.accessToken };
                        socket.connect();
                    }
                    socket.emit('joinRoom', joinData);
                    socket.on('disconnect', () => {
                        console.log('Se desconecto')
                        this.connectionStatus = false;
                    });

                    if (this.quickStart) {
                        this.gameStarted = true;
                        this.router.push('player-signup');
                    } else {
                        socket.on('gameStarted', () => {
                            this.gameStarted = true;
                            this.router.push('player-signup');
                        });
                    }
                }
            } catch (error) {
                if (error.response) {
                    switch (error.response.status) {
                        case 401:
                            throw new Error('Credenciales de acceso no válidas');
                        case 403:
                            throw new Error('Esta sala no permite el acceso');
                    }
                } else {
                    await this.handleError('joinRoom', error);
                }
            }
        },

        async updatePlayer(formData) {
            try {
                const response = await api.patch(`/api/game/update-player/${this.playerData.id}`, formData, {
                    headers: {
                        Authorization: `Bearer ${this.token.accessToken}`
                    }
                });
                if (response.status >= 200 && response.status < 300) {

                } else {
                    throw new Error('Error al actualizar los datos. Inténtalo de nuevo más tarde');
                }
            } catch (error) {
                await this.handleError('updatePlayer', error);
            }
        },

        async uploadScore(data) {
            await api.post(`/api/game/upload-score/${this.playerData.id}`, data, {
                headers: {
                    Authorization: `Bearer ${this.token.accessToken}`
                }
            })
                .catch(async (err) => {
                    await this.handleError('uploadScore', err);
                });
        },

        async gameOver() {
            const playerId = this.playerData.id;
            const roomNumber = this.roomNumber;
            await api.post('/api/game/leave-room', { roomNumber, playerId })
                .then(async (res) => {
                    const refreshToken = this.token.refreshToken;
                    await api.post('/api/game/logout', { refreshToken });
                })
                .then(async (res) => {
                    localStorage.clear();
                    this.router.push('thank-you');
                });
        }
    },
});
