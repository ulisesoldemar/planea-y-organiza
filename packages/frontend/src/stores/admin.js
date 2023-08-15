import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';
import { api, socket } from '@/api';

export const useAdmins = defineStore('admin', {
    state: () => ({
        token: JSON.parse(localStorage.getItem('token')) || null,
        isAuthenticated: useStorage('isAuthenticated', false),
        userData: useStorage('userData', {}),
        rooms: [],
    }),

    // Getters y acciones anteriores...
    getters: {
        userName: (state) => `${state.userData.firstName} ${state.userData.surName} ${state.userData.secondSurName || ''}`
    },

    actions: {

        // Metodos de socket.io
        connect() {
            socket.connect();
        },

        disconnect() {
            socket.disconnect();
        },

        // Token de refresh nuevo
        async startTokenRefreshTimer() {
            this.refreshTokenInterval = setInterval(async () => {
                try {
                    const response = await api.post('/api/auth/refreshToken', this.token, refreshToken);
                    // Verificar si la solicitud fue exitosa (código de estado 200-299)
                    if (response.status >= 200 && response.status < 300) {
                        // Acceder a los datos enviados por el backend a través de 'response.data'
                        const { accessToken, refreshToken } = response.data;

                        // Almacenar los tokens en el estado del store y en el LocalStorage
                        this.token = { accessToken, refreshToken };
                        localStorage.setItem('token', JSON.stringify({ accessToken, refreshToken }));
                    } else {
                        // La solicitud no fue exitosa, mostrar un mensaje de error o manejar el error según corresponda.
                        console.error('Error en el refresh de token:', response.statusText);
                    }
                    console.log('iniciar refresh de token')
                } catch (error) {
                    console.error('Error al refrescar el token:', error);
                    // Maneja los errores de refresco aquí
                }
            }, 8 * 60 * 1000); // Refresca cada 8 minutos (2 minutos antes de la expiración)
        },
        // Acción para realizar el login
        async login(formData) {
            try {
                const response = await api.post('/api/auth/login', formData);

                // Verificar si la solicitud fue exitosa (código de estado 200-299)
                if (response.status >= 200 && response.status < 300) {
                    // Acceder a los datos enviados por el backend a través de 'response.data'
                    const { id, accessToken, refreshToken } = response.data;

                    // Almacenar los tokens en el estado del store y en el LocalStorage
                    this.token = { accessToken, refreshToken };
                    localStorage.setItem('token', JSON.stringify({ accessToken, refreshToken }));

                    // Establecer el estado de autenticación a true
                    this.isAuthenticated = true;

                    // Obtener los datos del usuario y almacenarlos en el estado
                    await this.fetchUserData();

                    // Redirigir al usuario a la página de inicio del panel de control o cualquier otra página que desees
                    this.router.push({ name: 'dashboard' });
                } else {
                    // La solicitud no fue exitosa, mostrar un mensaje de error o manejar el error según corresponda.
                    console.error('Error en el inicio de sesión:', response.statusText);
                }
            } catch (error) {
                console.error('Error en el inicio de sesión:', error);
            }
        },

        // Acción para obtener los datos del usuario usando el token de acceso
        async fetchUserData() {
            try {
                // Obtener el token de acceso del estado del store
                const accessToken = this.token.accessToken;

                // Configurar los encabezados con el token de acceso
                const headers = {
                    Authorization: `Bearer ${accessToken}`,
                };

                // Realizar la solicitud a la ruta '/users/me' con los encabezados configurados
                const userDataResponse = await api.get('/api/admin/me', { headers });

                // Almacenar los datos del usuario en el estado del store
                this.userData = userDataResponse.data;
            } catch (error) {
                console.error('Error al obtener los datos del usuario:', error);
                // Puedes manejar el error según corresponda.
            }
        },

        async fetchRoomsData() {
            try {
                const accessToken = this.token.accessToken;

                const headers = {
                    Authorization: `Bearer ${accessToken}`
                };

                const roomsDataResponse = await api.get('/api/admin/rooms', { headers });
                this.rooms = roomsDataResponse.data;
                console.log(this.rooms);

            } catch (error) {
                console.error('Error al obtener los datos de las salas: ', error);
            }
        },

        //Obtener los datos de los jugadores
        async fetchPlayersData() {
            try {
                const accessToken = this.token.accessToken;

                const headers = {
                    Authorization: `Bearer ${accessToken}`
                };

                const playersDataResponse = await api.get('/api/admins/players', { headers });
                this.players = playersDataResponse.data;
                console.log(this.players);

            } catch (error) {
                console.error('Error al obtener los datos de las salas: ', error);
            }
        },

        // Acción para realizar el logout
        async logout() {
            try {
                // Obtener el refreshToken del estado del store
                const refreshToken = this.token.refreshToken;

                // Enviar la solicitud de logout al backend
                await api.post('/api/auth/logout', { refreshToken });

                // Borrar el token del estado del store y del LocalStorage
                this.token = null;
                localStorage.removeItem('token');

                // Establecer el estado de autenticación a false
                this.isAuthenticated = false;

                // Limpiar los datos del usuario en el estado
                this.userData = {};

                // Redirigir al usuario a la página de inicio de sesión o a otra página que desees
                this.router.push({ name: 'login' });
            } catch (error) {
                console.error('Error al cerrar sesión:', error);
                throw error;
            }
        },

        async createRoom(roomData) {
            try {
                // Obtener el accessToken del estado del store
                const accessToken = this.token.accessToken;

                // Configurar los encabezados con el token de acceso
                const headers = {
                    Authorization: `Bearer ${accessToken}`,
                };

                // Realizar la solicitud a la ruta '/admin' con los encabezados configurados y los datos de la sala
                const response = await api.post('/api/admin/create-room', roomData, { headers });

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
        // Resto de las acciones...
    },
});

