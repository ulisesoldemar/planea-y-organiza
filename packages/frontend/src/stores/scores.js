import { defineStore } from 'pinia';
import { useAdmins } from './admin';
import { api } from '@/api';

export const useScores = defineStore('scores', {
    state: () => ({
        adminStore: useAdmins(),
        playerName: '',
        localScores: [],
        loading: false,
    }),

    getters: {
        formatedScores: (state) => {
            return state.localScores.map((score) => {
                return {
                    ...score, date: new Date(score.date).toLocaleDateString('es-MX', { timeZone: 'UTC' }).toString(),
                    distancePerSection: score.distancePerSection.map((section, index) => {
                        return `Sección ${index + 1}: ${section.toFixed(3)}, \n`;
                    })
                };
            });
        },
        scores: (state) => {
            return state.localScores;
        },
    },

    actions: {
        async listResults() {
            await api.get('/api/admin/scores', {
                headers: {
                    Authorization: `Bearer ${this.adminStore.accessToken}`
                }
            })
                .then((res) => {
                    this.localScores = res.data;
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
                    this.localScores = res.data.scores;
                    return res;
                })
                .catch((err) => {
                    console.log(err);
                    // throw err;
                })
        }
    }
});