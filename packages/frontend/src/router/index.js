import { createRouter, createWebHistory } from "vue-router";
import { useAdmins } from "@/stores/admin";
import Login from '@/pages/Login.vue';
import Dashboard from '@/pages/Dashboard.vue'
import Rooms from '@/pages/Rooms.vue';
import Players from '@/pages/Players.vue';

const routes = [
    {
        path: '/',
        name: 'dashboard',
        component: Dashboard,
        meta: {
            title: 'Dashboard',
            requiresAuth: true, // Indica que esta ruta requiere autenticación
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
            requiresAuth: false,
        },
    },
    {
        path: '/rooms',
        name: 'rooms',
        component: Rooms,
        meta: {
            title: 'Salas',
            requiresAuth: true, // Indica que esta ruta requiere autenticación
        }
    },
    {
        path: '/players',
        name: 'players',
        component: Players,
        meta: {
            title: 'Sujetos',
            requiresAuth: true, // Indica que esta ruta requiere autenticación
        }
    },
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