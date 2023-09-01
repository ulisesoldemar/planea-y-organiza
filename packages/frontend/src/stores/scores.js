import { defineStore } from 'pinia';
import { useAdmins } from './admin';
import { api } from '@/api';

export const useScores = defineStore('scores', {
    state: () => ({
        adminStore: useAdmins(),
        currentScores: [],
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
        },

        async fetchResult(playerId) {
            await api.get(`/api/admin/scores/${playerId}`, {
                headers: {
                    Authorization: `Bearer ${this.adminStore.accessToken}`
                }
            })
            .then((res) => {
                console.log(res.data);
                this.currentScores = res.data;
            })
            .catch((err) => {
                console.log(err);
            })
        }
    }
});