import { defineStore } from "pinia";
import { useAdmins } from './admin';
import { api } from '@/api';

export const useAdminUsers = defineStore('adminUsers', {
    state: () => ({
        adminStore: useAdmins(),
        adminUsers: [],
    }),
    getters: {
        addedAt: state => index => {
            const fullDate = new Date(state.adminUsers[index].addedAt);
            const day = String(fullDate.getDate()).padStart(2, '0');
            const month = String(fullDate.getMonth() + 1).padStart(2, '0');
            const year =  String(fullDate.getFullYear());
            return `${day}/${month}/${year}`;
        },
    },
    actions: {
        async handleError(caller, error) {
            console.log(error);
        },

        async listAdminUsers() {
            try {
                const response = await api.get('api/admin/', {
                    headers: {
                        Authorization: `Bearer ${this.adminStore.accessToken}`
                    }
                });

                if (response.status === 200) {
                    this.adminUsers = response.data;
                } else {
                    throw new Error(`Error al obtener la lista de administradores: ${response.statusText}`)
                }

            } catch (error) {
                await this.handleError(this.listAdminUsers, error);
            }

        },

        async createAdminUser(formData) {
            try {
                const response = await api.post('api/admin/', formData, {
                    headers: {
                        Authorization: `Bearer ${this.adminStore.accessToken}`
                    }
                });

                if (response.status === 200) {
                    this.adminUsers.push(response.data);
                } else {
                    throw new Error(`Error al obtener la lista de administradores: ${response.statusText}`)
                }

            } catch (error) {
                if (error.response.status === 409) {
                    throw new Error('Dato ya usado');
                }
                await this.handleError(this.listAdminUsers, error);
            }
        },

        async updateAdminUser(formData) {
            try {
                const response = await api.patch(`/api/admin/${formData._id}`, formData, {
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
                if (error.response.status === 409) {
                    throw new Error('Dato ya usado');
                }
                await this.handleError(this.listAdminUsers, error);
            }
        },

        async deleteAdminUser(adminUserId) {
            try {
                const response = await api.delete(`/api/admin/${adminUserId}`, {
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
                await this.handleError(this.listAdminUsers, error);
            }
        }
    }
})