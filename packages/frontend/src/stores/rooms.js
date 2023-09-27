import { defineStore } from "pinia";
import { useAdmins } from "./admin";
import { api, socket } from "@/api"

export const useRooms = defineStore('room', {
    state: () => ({
        adminStore: useAdmins(),
        rooms: [],
        currentPlayers: [],
        currentRoom: {},
    }),
    getters: {
        formatDate: state => date => {
            return new Date(date).toLocaleDateString('es-MX', { timeZone: 'UTC' }).substring(0, 10);
        },
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
                    this.currentRoom = roomData;
                    this.currentRoom.players = this.currentRoom.players.map(player => ({
                        _id: player._id,
                        fullName: `${player.firstName} ${player.surName}`
                    }));
                    console.log(this.currentRoom);
                    this.joinRoom(roomNumber);
                } else {
                    throw new Error(`Error al obtener los datos de la sala: ${response.statusText}`);
                }
            } catch (error) {
                await this.handleError('fetchRoomData', error);
            }
        },

        async addPlayerToRoom(roomNumber, playerId) {
            try {
                const headers = {
                    Authorization: `Bearer ${this.adminStore.accessToken}`,
                };
                await api.post('/api/admin/rooms/add-player-to-room', { roomNumber, playerId }, { headers })
            } catch (error) {
                await this.handleError(this.addPlayerToRoom, error);
            }
        },

        async addPlayersToRoom(roomNumber, playerIds) {
            try {
                const headers = {
                    Authorization: `Bearer ${this.adminStore.accessToken}`,
                };
                await api.post('/api/admin/rooms/add-players-to-room', { roomNumber, playerIds }, { headers })
            } catch (error) {
                await this.handleError(this.addPlayersToRoom, error);
            }
        },

        async removePlayerFromRoom(roomNumber, playerId) {
            try {
                const headers = {
                    Authorization: `Bearer ${this.adminStore.accessToken}`,
                };
                await api.post('/api/admin/rooms/remove-player-from-room', { roomNumber, playerId }, { headers })
            } catch (error) {
                await this.handleError(this.removePlayerFromRoom, error);
            }
        },

        async removePlayersFromRoom(roomNumber, playerIds) {
            console.log(playerIds)
            try {
                const headers = {
                    Authorization: `Bearer ${this.adminStore.accessToken}`,
                };
                await api.post('/api/admin/rooms/remove-players-from-room', { roomNumber, playerIds }, { headers })
            } catch (error) {
                await this.handleError(this.removePlayersFromRoom, error);
            }
        },

        async fetchRoomPlayers(roomNumber) {
            try {
                const headers = {
                    Authorization: `Bearer ${this.adminStore.accessToken}`,
                };

                const response = await api.get(`/api/admin/rooms/${roomNumber}/players`, { headers });

                if (response.status >= 200 && response.status < 300) {
                    const players = response.data;
                    this.currentPlayers = players;
                } else {
                    throw new Error(`Error al obtener los datos de la sala: ${response.statusText}`);
                }
            } catch (error) {
                await this.handleError('fetchRoomPlayers', error);
            }
        },

        startGame(roomNumber) {
            if (!socket.connected) {
                // Se agrega el query de auth
                socket.io.opts.query = { token: this.adminStore.accessToken };
                socket.connect();
            }
            socket.emit('startGame', roomNumber.toString());
        },

        joinRoom(roomNumber) {
            if (!socket.connected) {
                socket.io.opts.query = { token: this.adminStore.accessToken };
                socket.connect();
            }
            const joinData = {
                roomNumber: roomNumber,
                adminName: this.adminStore.fullName,
            };
            socket.emit('adminJoined', joinData);
            socket.on('updateUsersList', (data) => {
                console.log(data);
                if (data) {
                    this.currentRoom.usersInRoom = data.map(user => user.name);
                } else {
                    data = [];
                }
            });
        }
    },
});
