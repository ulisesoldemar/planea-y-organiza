import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';
import api from '@/api';

export const useAdmins = defineStore('admin', {
    state: () => ({
        token: JSON.parse(localStorage.getItem('token')) || null,
        isAuthenticated: useStorage('isAuthenticated', false),
        userData: useStorage('userData', {}),
    }),

    // Getters y acciones anteriores...

    actions: {
        // Acción para realizar el login
        async login(formData) {
            try {
                const response = await api.post('/auth/login', formData);

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
                const userDataResponse = await api.get('/users/me', { headers });

                // Almacenar los datos del usuario en el estado del store
                this.userData = userDataResponse.data;
            } catch (error) {
                console.error('Error al obtener los datos del usuario:', error);
                // Puedes manejar el error según corresponda.
            }
        },

        // Acción para realizar el logout
        async logout() {
            try {
                // Obtener el refreshToken del estado del store
                const refreshToken = this.token.refreshToken;

                // Enviar la solicitud de logout al backend
                await api.post('/auth/logout', { refreshToken });

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
                console.error('Error al cerrar sesión:', error.response.data.message);
                throw error;
            }
        },

        // Resto de las acciones...
    },
});

