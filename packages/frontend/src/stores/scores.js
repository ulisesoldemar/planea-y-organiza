import { defineStore } from 'pinia';
import { useAdmins } from './admin';
import { api } from '@/api';

export const useScores = defineStore('scores', {
    state: () => ({
        adminStore: useAdmins(),
        scores: [],
    }),

    getters: {

    },

    actions: {
        async listResults() {
            await api.get('/api/admin/scores', {
                headers: {
                    Authorization: `Bearer ${this.adminStore.accessToken}`
                }
            })
            .then((res) => {
                this.scores = res.data;
            })
            .catch((err) => {
                console.log(err)
            });
        }
    }
});