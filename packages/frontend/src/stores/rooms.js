import { defineStore } from "pinia";
import { useAdmins } from "./admin";
import { api, socket } from "@/api"

export const useRooms = defineStore('room', {
    state: () => ({
        adminStore: useAdmins(),
        rooms: [],
    }),
    getters: {
        createdAt: state => index => { return new Date(state.rooms[index].createdAt).toLocaleDateString('es-MX') },
        expiresAt: state => index => { return new Date(state.rooms[index].expiration).toLocaleDateString('es-MX') },
    },
    actions: {
        async handleError(actionName, error) {
            console.error(`Error in ${actionName}:`, error);
            // Puedes implementar aquí la lógica para mostrar mensajes de error en la interfaz de usuario si lo deseas.
        },

        async listRooms() {
            try {
                const headers = {
                    Authorization: `Bearer ${this.adminStore.accessToken}`
                };

                const roomsDataResponse = await api.get('/api/admin/rooms/', { headers });
                if (roomsDataResponse.status >= 200 && roomsDataResponse.status < 300) {
                    this.rooms = roomsDataResponse.data;
                } else {
                    throw new Error('Error al obtener los datos de las salas');
                }
            } catch (error) {
                await this.handleError('listRooms', error);
            }
        },

        async createRoom(roomData) {
            try {
                const headers = {
                    Authorization: `Bearer ${this.adminStore.accessToken}`,
                };
                roomData.admin = this.adminStore.id;

                const response = await api.post('/api/admin/rooms/', roomData, { headers });

                if (response.status >= 200 && response.status < 300) {
                    this.rooms.push(response.data);
                } else {
                    throw new Error(`Error al crear la sala: ${response.statusText}`);
                }
            } catch (error) {
                await this.handleError('createRoom', error);
            }
        },

        async deleteRoom(roomNumber, adminId) {
            try {
                const headers = {
                    Authorization: `Bearer ${this.adminStore.accessToken}`,
                };

                const response = await api.delete(`/api/admin/rooms/${roomNumber}?admin=${this.adminStore.id}`, { headers });

                if (response.status >= 200 && response.status < 300) {
                    console.log('Sala eliminada con éxito');
                    await this.listRooms();
                } else {
                    throw new Error(`Error al eliminar la sala: ${response.statusText}`);
                }
            } catch (error) {
                await this.handleError('deleteRoom', error);
            }
        },

        async updateRoom(updatedRoom) {
            try {
                const headers = {
                    Authorization: `Bearer ${this.adminStore.accessToken}`,
                };

                const data = {
                    ...updatedRoom,
                    admin: this.adminStore.id,
                }

                const response = await api.put(`/api/admin/rooms/${updatedRoom.roomNumber}`, data, { headers });

                if (response.status >= 200 && response.status < 300) {
                    console.log('Sala actualizada con éxito');
                    await this.listRooms();
                } else {
                    throw new Error(`Error al actualizar la sala: ${response.statusText}`);
                }
            } catch (error) {
                await this.handleError('updateRoom', error);
            }
        },

        async fetchRoomData(roomNumber) {
            try {
                const headers = {
                    Authorization: `Bearer ${this.adminStore.accessToken}`,
                };

                const response = await api.get(`/api/admin/rooms/${roomNumber}`, { headers });

                if (response.status >= 200 && response.status < 300) {
                    const roomData = response.data;
                    console.log('Datos de la sala:', roomData);
                } else {
                    throw new Error(`Error al obtener los datos de la sala: ${response.statusText}`);
                }
            } catch (error) {
                await this.handleError('fetchRoomData', error);
            }
        },
    },
});
