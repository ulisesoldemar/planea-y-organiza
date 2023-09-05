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
    },

    actions: {
        async handleError(caller, error) {
            if (error && error.response) {
                switch (error.response.status) {
                    case 419: {
                        this.fetchNewAccessToken();
                        caller();
                        break
                    }
                    case 401:
                        this.router.push('401');
                        break;
                    case 403:
                        this.router.push('403');
                        break;
                    case 500:
                        this.router.push('500');
                        break;
                    default:
                        this.router.push('500');
                }
            } else {
                this.router.push('500');
            }
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
                await this.router.push({ name: 'login' });

                this.token = null;
                localStorage.clear();

                this.isAuthenticated = false;
                this.userData = {};

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
                const response = await api.patch(`/api/admin/password/${adminId}`, {password: password}, {
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
                const response = await api.patch(`/api/admin/avatar/${adminId}`, {avatar: colors}, {
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
