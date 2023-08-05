import { createRouter, createWebHistory } from "vue-router";
import Login from '@/components/Login.vue'
import RoomAccess from '@/components/RoomAccess.vue'
import Game from '@/components/Game.vue'

const routes = [
    {
        path: '/login',
        name: 'login',
        component: Login
    },
    {
        path: '/room-access',
        name: 'room-access',
        component: RoomAccess
    },
    {
        path: '/room/:token',
        name: 'room',
        component: Game,
        meta: {
            title: 'Game',
            guard: 'auth',
        }
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router