import { createRouter, createWebHistory } from "vue-router";
import { useAdmins } from "@/stores/admin";
import Login from '@/components/Login.vue'
import RoomAccess from '@/components/RoomAccess.vue'
import Game from '@/components/Game.vue'
import Dashboard from '@/components/Dashboard.vue'

const routes = [
    {
        path: '/',
        name: 'dashboard',
        component: Dashboard,
        meta: {
            requiresAuth: true // Indica que esta ruta requiere autenticación
        }
    },
    {
        path: '/login',
        name: 'login',
        component: Login,
        query: {
            reset: 'reset',
        },
        meta: {
            title: 'Log in',
            guard: 'guest',
        },
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

// Verificar el estado de autenticación antes de cada navegación
router.beforeEach((to, from, next) => {
    const adminStore = useAdmins(); // Accede al store de usuarios
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

    // Si la ruta requiere autenticación y el usuario no está autenticado, redirige al inicio de sesión
    if (requiresAuth && !adminStore.isAuthenticated) {
        next({ name: 'login' });
    } else {
        next();
    }
});

export default router