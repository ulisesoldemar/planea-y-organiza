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
        initials: (state) => `${state.userData.firstName[0].toUpperCase()}${state.userData.surName[0].toUpperCase()}`,
        avatar: state => state.userData.avatarColor,
        refreshToken: state => state.token.refreshToken,
        accessToken: state => state.token.accessToken,
        id: state => state.userData._id,
        isAccessTokenExpired: (state) => {
            const now = Date.now() / 1000; // Tiempo actual en segundos
            console.log(state.token.accessToken)
            return state.token.accessToken && state.token.accessToken.exp < now;
        },
    },

    actions: {
        async handleError(caller, error) {
            console.log(caller.name, error);
            if (error.response && error.response.status === 419) {
                this.fetchNewAccessToken();
                caller();
            }
        },

        async login(formData) {
            try {
                localStorage.clear();
                const response = await api.post('/api/auth/login', formData);
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
                await this.router.push({ name: 'login' });

                this.token = null;
                localStorage.clear();

                this.isAuthenticated = false;
                this.userData = {};
                if (socket.connected) {
                    socket.disconnect();
                }

            } catch (error) {
                await this.handleError(this.logout, error);
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
                if (error.response) {
                    if (error.response.status === 401 || error.response.status === 403) {
                        throw new Error('La sesión ha caducado');
                    }
                }
                await this.handleError(this.fetchUserData, error);
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
                } else {
                    throw new Error('Error al intentar obtener un nuevo token.');
                }
            } catch (error) {
                await this.handleError(this.fetchNewAccessToken, error);
            }
        },

        async updateAdmin(formData) {
            try {
                const response = await api.patch(`/api/admin/${formData._id}`, formData, {
                    headers: {
                        Authorization: `Bearer ${this.accessToken}`
                    }
                });

                if (response.status === 200) {
                    // ... tu código para manejar la actualización exitosa ...
                } else {
                    throw new Error(`Error al actualizar el jugador: ${response.statusText}`);
                }
            } catch (error) {
                await this.handleError(this.listAdminUsers, error);
            }
        },

        async updatePassword(adminId, password) {
            try {
                console.log(password);
                const response = await api.patch(`/api/admin/password/${adminId}`, { password: password }, {
                    headers: {
                        Authorization: `Bearer ${this.accessToken}`
                    }
                });

                if (response.status === 200) {
                    // ... tu código para manejar la actualización exitosa ...
                } else {
                    throw new Error(`Error al actualizar el password: ${response.statusText}`);
                }
            } catch (error) {
                await this.handleError(this.listAdminUsers, error);
            }
        },

        async updateColor(adminId, colors) {
            try {
                const response = await api.patch(`/api/admin/avatar/${adminId}`, { avatar: colors }, {
                    headers: {
                        Authorization: `Bearer ${this.accessToken}`
                    }
                });

                if (response.status === 200) {
                    this.userData.avatarColor = colors;
                } else {
                    throw new Error(`Error al actualizar el color: ${response.statusText}`);
                }
            } catch (error) {
                await this.handleError(this.listAdminUsers, error);
            }
        },

        // Resto de las acciones...
    },
});
