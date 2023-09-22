import { defineStore } from 'pinia';
import { useAdmins } from './admin';
import { api } from '@/api'

export const usePlayers = defineStore('players', {
    state: () => ({
        adminStore: useAdmins(),
        players: [],
    }),
    getters: {
        fullName: state => index => {
            const player = state.players[index];
            console.log(state.players);
            if (player) {
                return `${player.firstName} ${player.surName} ${player.secondSurName || ''}`;
            }
            return '';
        },
        addedAt: state => index => { return new Date(state.players[index].addedAt).toLocaleDateString('es-MX', { timeZone: 'UTC' }) },
    },
    actions: {
        async handleError(caller, error) {
            this.adminStore.handleError(caller, error)
        },

        async listPlayers() {
            try {
                const response = await api.get('/api/admin/players', {
                    headers: {
                        Authorization: `Bearer ${this.adminStore.accessToken}`
                    }
                });

                if (response.status === 200) {
                    this.players = response.data;
                    // ... tu código para manejar la lista de jugadores ...
                } else {
                    throw new Error(`Error al obtener la lista de jugadores: ${response.statusText}`);
                }
            } catch (error) {
                await this.handleError(this.listPlayers, error);
            }
        },

        async createPlayer(formData) {
            try {
                const response = await api.post('/api/admin/players', formData, {
                    headers: {
                        Authorization: `Bearer ${this.adminStore.accessToken}`
                    }
                });

                if (response.status === 200) {
                    this.players.push(response.data);

                } else {
                    throw new Error(`Error al crear un jugador: ${response.statusText}`);
                }
            } catch (error) {
                await this.handleError(this.listPlayers, error);
            }
        },

        async updatePlayer(formData) {
            try {
                const response = await api.patch(`/api/admin/players/${formData._id}`, formData, {
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
                await this.handleError(this.listPlayers, error);
            }
        },

        async deletePlayer(playerId) {
            try {
                const response = await api.delete(`/api/admin/players/${playerId}`, {
                    headers: {
                        Authorization: `Bearer ${this.adminStore.accessToken}`
                    }
                });

                if (response.status === 200) {
                    // ... tu código para manejar la eliminación exitosa ...
                    console.log(response.data);
                } else {
                    throw new Error(`Error al eliminar el jugador: ${response.statusText}`);
                }
            } catch (error) {
                await this.handleError(this.listPlayers, error);
            }
        },

        // ... otras acciones ...
    },
});
