import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';
import { api, socket } from '@/api';

export const useAdmins = defineStore('admin', {
    state: () => ({
        token: JSON.parse(localStorage.getItem('token')) || null,
        isAuthenticated: useStorage('isAuthenticated', false),
        userData: useStorage('userData', {}),
    }),

    getters: {
        fullName: (state) => `${state.userData.firstName} ${state.userData.surName} ${state.userData.secondSurName || ''}`,
        refreshToken: state => state.token.refreshToken,
        accessToken: state => state.token.accessToken,
        id: state => state.userData._id,
    },

    actions: {
        async handleError(actionName, error) {
            console.error(`Error in ${actionName}:`, error);
            // Puedes implementar aquí la lógica para mostrar mensajes de error en la interfaz de usuario si lo deseas.
        },

        async login(formData) {
            try {
                const response = await api.post('/api/auth/login', formData);
                localStorage.clear();
                if (response.status >= 200 && response.status < 300) {
                    const { id, accessToken, refreshToken } = response.data;

                    this.token = { accessToken, refreshToken };
                    localStorage.setItem('token', JSON.stringify({ accessToken, refreshToken }));

                    this.isAuthenticated = true;
                    await this.fetchUserData();

                    this.router.push({ name: 'dashboard' });
                }
            } catch (error) {
                if (error.response.status === 401 || error.response.status === 403) {
                    throw new Error('Credenciales de acceso no válidas');
                }
                throw new Error('Error en el inicio de sesión. Inténtalo de nuevo más tarde');
            }
        },

        async logout() {
            try {
                const refreshToken = this.refreshToken;

                await api.post('/api/auth/logout', { refreshToken });

                this.token = null;
                localStorage.clear();

                this.isAuthenticated = false;
                this.userData = {};

                this.router.push({ name: 'login' });
            } catch (error) {
                await this.handleError('logout', error);
            }
        },

        async fetchUserData() {
            try {
                const headers = {
                    Authorization: `Bearer ${this.accessToken}`,
                };

                const userDataResponse = await api.get('/api/admin/me', { headers });

                if (userDataResponse.status >= 200 && userDataResponse.status < 300) {
                    this.userData = userDataResponse.data;
                } else {
                    throw new Error('Error al obtener los datos del usuario');
                }
            } catch (error) {
                if (error.response.status === 401 || error.response.status === 403) {
                    throw new Error('La sesión ha caducado');
                }
                await this.handleError('fetchUserData', error);
            }
        },

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
                await this.handleError('fetchPlayersData', error);
            }
        },

        async fetchNewAccessToken() {
            try {
                const response = await api.post('/api/auth/accessToken', { refreshToken: this.refreshToken });
                if (response.status >= 200 && response.status < 300) {
                    const { id, accessToken, refreshToken } = response.data;

                    this.token = { accessToken, refreshToken };
                    localStorage.setItem('token', JSON.stringify({ accessToken, refreshToken }));

                    this.isAuthenticated = true;
                }
            } catch (error) {
                await this.handleError('fetchNewAccessToken', error);
            }
        },

        // Resto de las acciones...
    },
});
