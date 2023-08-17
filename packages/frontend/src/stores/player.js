import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';
import { api } from '@/api'

export const usePlayer = defineStore('player', {
    state: () => ({
        token: JSON.parse(localStorage.getItem('token')) || null,
        playerData: useStorage('playerData', {}),
    }),

    actions: {
        async listPlayers() {
            try {
                const response = await api.get('/players', {
                    headers: {
                        Authorization: `Bearer ${this.token.accessToken}`
                    }
                });

                if (response.status === 200) {
                    const players = response.data;
                    // ... tu código para manejar la lista de jugadores ...
                } else {
                    console.error('Error al obtener la lista de jugadores:', response.statusText);
                }
            } catch (error) {
                console.error('Error al obtener la lista de jugadores:', error);
            }
        },

        async createPlayer(formData) {
            try {
                const response = await api.post('/players', formData, {
                    headers: {
                        Authorization: `Bearer ${this.token.accessToken}`
                    }
                });

                if (response.status === 201) {
                    // ... tu código para manejar la creación exitosa ...
                } else {
                    console.error('Error al crear un jugador:', response.statusText);
                }
            } catch (error) {
                console.error('Error al crear un jugador:', error);
            }
        },

        async updatePlayer(playerId, formData) {
            try {
                const response = await api.patch(`/players/${playerId}`, formData, {
                    headers: {
                        Authorization: `Bearer ${this.token.accessToken}`
                    }
                });

                if (response.status === 200) {
                    // ... tu código para manejar la actualización exitosa ...
                } else {
                    console.error('Error al actualizar el jugador:', response.statusText);
                }
            } catch (error) {
                console.error('Error al actualizar el jugador:', error);
            }
        },

        async deletePlayer(playerId) {
            try {
                const response = await api.delete(`/players/${playerId}`, {
                    headers: {
                        Authorization: `Bearer ${this.token.accessToken}`
                    }
                });

                if (response.status === 204) {
                    // ... tu código para manejar la eliminación exitosa ...
                } else {
                    console.error('Error al eliminar el jugador:', response.statusText);
                }
            } catch (error) {
                console.error('Error al eliminar el jugador:', error);
            }
        },

        // ... otras acciones ...
    },
});
