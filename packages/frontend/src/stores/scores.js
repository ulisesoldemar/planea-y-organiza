import { defineStore } from 'pinia';
import { useAdmins } from './admin';
import { api } from '@/api';

export const useScores = defineStore('scores', {
    state: () => ({
        adminStore: useAdmins(),
        playerName: '',
        scores: [],
        loading: false,
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
            this.loading = true;
            return api.get(`/api/admin/scores/${playerId}`, {
                headers: {
                    Authorization: `Bearer ${this.adminStore.accessToken}`
                }
            })
            .then((res) => {
                this.loading = false;
                this.playerName = res.data.playerName;
                this.scores = res.data.scores;
                return res;
            })
            .catch((err) => {
                console.log(err);
                // throw err;
            })
        }
    }
});