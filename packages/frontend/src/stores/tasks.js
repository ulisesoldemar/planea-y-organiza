import { defineStore } from 'pinia';
import { useAdmins } from './admin';
import { api } from "@/api";

export const useTasks = defineStore('task', {
    state: () => ({
        adminStore: useAdmins(),
        tasks: [],
        currentTask: [],
    }),
    actions: {
        async handleError(actionName, error) {
            console.error(`Error in ${actionName}:`, error);
            // Puedes implementar aquí la lógica para mostrar mensajes de error en la interfaz de usuario si lo deseas.
        },

        async listTasks() {
            try{
                const headers = {
                    Authorization: `Bearer ${this.adminStore.accessToken}`
                };

                const tasksDataResponse = await api.get('/api/admin/tasks/', { headers });

                if(tasksDataResponse.status >= 200){
                    this.tasks = tasksDataResponse.data;
                } else {
                    throw new Error('Error al obtener los datos de las tareas');
                }

            } catch (error) {
                await this.handleError('listTasks', error);
            }
        },

        async createTask(taskData) {
            try {
                const headers = {
                    Authorization: `Bearer ${this.adminStore.accessToken}`,
                };

                taskData.admin = this.adminStore.id;

                const response = await api.post('/api/admin/tasks/', taskData, { headers });

                if(response.status >= 200 && response.status < 300){
                    this.tasks.push(response.data);
                } else {
                    throw new Error(`Error al crear la tarea: ${response.statusText}`);
                }

            } catch (error) {
                await this.handleError('createTask', error);
            }
        },

        async deleteTaks(taskId, adminId) {
            try {
                const headers = {
                    Authorization: `Bearer ${this.adminStore.accessToken}`,
                };

                const response = await api.delete(`/api/admin/tasks/${taskId}?admin=${this.adminStore.id}`, { headers });

                if (response.status >= 200 && response.status < 300) {
                    console.log('tarea eliminada con éxito');
                } else {
                    throw new Error(`Error al eliminar la tarea: ${response.statusText}`);
                }
            } catch (error) {
                await this.handleError('deteleTask', error);
            }
        },

        async updateTask(updatedTask) {
            try {
                const headers = {
                    Authorization: `Bearer ${this.adminStore.accessToken}`,
                };

                const data = {
                    ...updatedTask,
                    admin: this.adminStore.id,
                }

                const response = await api.put(`/api/admin/tasks/${updatedTask.id}`, data, { headers });

                if (response.status >= 200 && response.status < 300) {
                    //await this.listTasks();
                } else {
                    throw new Error(`Error al actualizar la tarea: ${response.statusText}`);
                }
            } catch (error) {
                await this.handleError('updateTask', error);
            }
        },

        async fetchTaskData(taskId) {
            try {
                const headers = {
                    Authorization: `Bearer ${this.adminStore.accessToken}`,
                };

                const response = await api.get(`/api/admin/tasks/${taskId}`, { headers });

                if (response.status >= 200 && response.status < 300) {
                    this.currentTask = response.data;
                } else {
                    throw new Error(`Error al obtener los datos de la tarea: ${response.statusText}`);
                }
            } catch (error) {
                await this.handleError('fetchTaskData', error);
            }
        },


    }
})