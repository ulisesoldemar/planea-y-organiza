import { defineStore } from 'pinia';

export const useGame = defineStore('game', {
    state: () => ({
        isTimeOver: false,
        isGameComplete: false
    }),
    actions: {
        setTimeOver(completed) {
            this.isTimeOver = completed;
        },
        setGameComplete(completed) {
            this.isGameComplete = completed;
        },
    },
});