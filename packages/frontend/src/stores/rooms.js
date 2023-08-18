import { defineStore } from "pinia";
import { useAdmins } from "./admin";
import { api, socket } from "@/api"


export const useRooms = defineStore('room', {
    state: () => ({
        adminStore: useAdmins(),
        rooms: [],
    }),
    getters: {

    },
    actions: {
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
                throw new Error('Error al obtener los datos de las salas: ' + error.message);
            }
        },

        async createRoom(roomData) {
            try {
                // Configurar los encabezados con el token de acceso
                const headers = {
                    Authorization: `Bearer ${this.adminStore.accessToken}`,
                };

                // Realizar la solicitud a la ruta '/admin' con los encabezados configurados y los datos de la sala
                const response = await api.post('/api/admin/rooms/', roomData, { headers });

                // Verificar si la solicitud fue exitosa (código de estado 200-299)
                if (response.status >= 200 && response.status < 300) {
                    // Acceder a los datos enviados por el backend a través de 'response.data'
                    const newRoom = response.data;
                    console.log(newRoom);
                } else {
                    // La solicitud no fue exitosa, mostrar un mensaje de error o manejar el error según corresponda.
                    console.error('Error al crear la sala:', response.statusText);
                }
            } catch (error) {
                console.error('Error al crear la sala:', error);
            }
        },

        async deleteRoom(roomNumber) {
            try {
                const headers = {
                    Authorization: `Bearer ${this.adminStore.accessToken}`,
                };

                const response = await api.delete(`/api/admin/rooms/${roomNumber}`, { headers });

                if (response.status >= 200 && response.status < 300) {
                    console.log('Sala eliminada con éxito');
                    await this.listRooms(); // Actualizar la lista de salas después de la eliminación
                } else {
                    console.error('Error al eliminar la sala:', response.statusText);
                }
            } catch (error) {
                console.error('Error al eliminar la sala:', error);
            }
        },

        async updateRoom({ roomNumber, updatedData }) {
            try {
                const headers = {
                    Authorization: `Bearer ${this.adminStore.accessToken}`,
                };

                const response = await api.put(`/api/admin/rooms/${roomNumber}`, updatedData, { headers });

                if (response.status >= 200 && response.status < 300) {
                    console.log('Sala actualizada con éxito');
                    await this.listRooms(); // Actualizar la lista de salas después de la actualización
                } else {
                    console.error('Error al actualizar la sala:', response.statusText);
                }
            } catch (error) {
                console.error('Error al actualizar la sala:', error);
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
                    console.error('Error al obtener los datos de la sala:', response.statusText);
                }
            } catch (error) {
                console.error('Error al obtener los datos de la sala:', error);
            }
        },
    },
});