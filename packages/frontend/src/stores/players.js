import { defineStore } from 'pinia';
import { useAdmins } from './admin';
import { api } from '@/api'

export const usePlayers = defineStore('players', {
    state: () => ({
        adminStore: useAdmins(),
        players: [],
    }),

    actions: {
        async handleError(actionName, error) {
            console.error(`Error in ${actionName}:`, error);
            // Puedes implementar aquí la lógica para mostrar mensajes de error en la interfaz de usuario si lo deseas.
        },

        async listPlayers() {
            try {
                const response = await api.get('/players', {
                    headers: {
                        Authorization: `Bearer ${this.adminStore.accessToken}`
                    }
                });

                if (response.status === 200) {
                    const players = response.data;
                    // ... tu código para manejar la lista de jugadores ...
                } else {
                    throw new Error(`Error al obtener la lista de jugadores: ${response.statusText}`);
                }
            } catch (error) {
                await this.handleError('listPlayers', error);
            }
        },

        async createPlayer(formData) {
            try {
                const response = await api.post('/players', formData, {
                    headers: {
                        Authorization: `Bearer ${this.adminStore.accessToken}`
                    }
                });

                if (response.status === 201) {
                    // ... tu código para manejar la creación exitosa ...
                } else {
                    throw new Error(`Error al crear un jugador: ${response.statusText}`);
                }
            } catch (error) {
                await this.handleError('createPlayer', error);
            }
        },

        async updatePlayer(playerId, formData) {
            try {
                const response = await api.patch(`/players/${playerId}`, formData, {
                    headers: {
                        Authorization: `Bearer ${this.adminStore.accessToken}`
                    }
                });

                if (response.status === 200) {
                    // ... tu código para manejar la actualización exitosa ...
                } else {
                    throw new Error(`Error al actualizar el jugador: ${response.statusText}`);
                }
            } catch (error) {
                await this.handleError('updatePlayer', error);
            }
        },

        async deletePlayer(playerId) {
            try {
                const response = await api.delete(`/players/${playerId}`, {
                    headers: {
                        Authorization: `Bearer ${this.adminStore.accessToken}`
                    }
                });

                if (response.status === 204) {
                    // ... tu código para manejar la eliminación exitosa ...
                } else {
                    throw new Error(`Error al eliminar el jugador: ${response.statusText}`);
                }
            } catch (error) {
                await this.handleError('deletePlayer', error);
            }
        },

        // ... otras acciones ...
    },
});
