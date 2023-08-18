import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';
import { api, socket } from '@/api';

export const useAdmins = defineStore('admin', {
    state: () => ({
        token: JSON.parse(localStorage.getItem('token')) || null,
        isAuthenticated: useStorage('isAuthenticated', false),
        userData: useStorage('userData', {}),
    }),

    // Getters y acciones anteriores...
    getters: {
        userName: (state) => `${state.userData.firstName} ${state.userData.surName} ${state.userData.secondSurName || ''}`,
        refreshToken: state => state.token.refreshToken,
        accessToken: state => state.token.accessToken,
    },

    actions: {
        // Token de refresh nuevo
        async startTokenRefreshTimer() {
            setInterval(async () => {
                try {
                    // Obtener el refreshToken del estado del store
                    const response = await api.post('/api/auth/refreshToken', this.refreshToken);
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
                } catch (error) {
                    console.error('Error al refrescar el token:', error);
                    // Maneja los errores de refresco aquí
                }
            }, 18 * 60 * 1000); // Refresca cada 18 minutos (2 minutos antes de la expiración)
        },
        // Acción para realizar el login
        async login(formData) {
            try {
                const response = await api.post('/api/auth/login', formData);
                localStorage.clear();
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
                }
            } catch (error) {
                if (error.response.status === 401 || error.response.status === 403) {
                    throw new Error('Credenciales de acceso no válidas');
                }
                throw new Error('Error en el inicio de sesión. Inténtalo de nuevo más tarde');
            }
        },

        // Acción para realizar el logout
        async logout() {
            try {
                // Obtener el refreshToken del estado del store
                const refreshToken = this.refreshToken;

                // Enviar la solicitud de logout al backend
                await api.post('/api/auth/logout', { refreshToken });

                // Borrar el token del estado del store y del LocalStorage
                this.token = null;
                localStorage.clear();

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

        // Acción para obtener los datos del usuario usando el token de acceso
        async fetchUserData() {
            try {
                // Configurar los encabezados con el token de acceso
                const headers = {
                    Authorization: `Bearer ${this.accessToken}`,
                };

                // Realizar la solicitud a la ruta '/users/me' con los encabezados configurados
                const userDataResponse = await api.get('/api/admin/me', { headers });

                // Almacenar los datos del usuario en el estado del store
                this.userData = userDataResponse.data;
            } catch (error) {
                if (error.response.status === 401 || error.response.status === 403) {
                    throw new Error('La sesión ha caducado');
                }
            }
        },

        // Obtener los datos de los jugadores
        async fetchPlayersData() {
            try {
                const headers = {
                    Authorization: `Bearer ${this.accessToken}`
                };

                const playersDataResponse = await api.get('/api/admins/players', { headers });
                if (playersDataResponse.status >= 200 && playersDataResponse.status < 300) {
                    this.players = playersDataResponse.data;
                } else {
                    throw new Error('Error al obtener los datos de los jugadores');
                }
            } catch (error) {
                if (error.response.status === 401 || error.response.status === 403) {
                    throw new Error('La sesión ha caducado');
                }
                throw new Error('Error al obtener los datos de los jugadores: ' + error.message);
            }
        },
        // Resto de las acciones...
    },
});

