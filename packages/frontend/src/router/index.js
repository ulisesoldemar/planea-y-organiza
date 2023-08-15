import { createRouter, createWebHistory } from "vue-router";
import { useAdmins } from "@/stores/admin";
import Login from '@/pages/Login.vue';
import Dashboard from '@/pages/Dashboard.vue'
import Rooms from '@/pages/Rooms.vue';
import Players from '@/pages/Players.vue';
import Instructions from '@/pages/Instructions.vue';
import JoinRoom from '@/pages/JoinRoom.vue';
import Game from "@/components/Game.vue";
import Test from '@/pages/Test.vue';


import LoadingPage from '@/components/Loading.vue';
import ErrorHeader from '@/components/ErrorHeader.vue';

const routes = [
    {
        path: '/Error',
        name: 'error',
        component: ErrorHeader,
        props: { errorCode: '404', errorTitle: 'Page Not Found ⚠️', errorDescription: 'We couldnt find the page you are looking for.',},
        meta: {
            title: 'Error',
            requiresAuth: false,
        }, 
    },
    {
        path: '/test',
        name: 'test',
        component: Test,
        meta: {
            title: 'Test',
            requiresAuth: false,
        }, 
    },
    {
        path: '/game',
        name: 'game',
        component: Game,
        meta: {
            title: 'Game',
            requiresAuth: false,
        },
    },
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
    {
        path: '/instructions',
        name: 'instructions',
        component: Instructions,
        meta: {
            title: 'Instrucciones',
            requiresAuth: true, // Indica que esta ruta requiere autenticación
        }
    },
    {
        path: '/join-room',
        name: 'join-room',
        component: JoinRoom,
        meta: {
            title: 'Ingresar a sala',
            requiresAuth: true, // Indica que esta ruta requiere autenticación
        }
    },
    {
        path: '/loading', // QUITAR PROBABLEMENTE
        name: 'loading',
        component: LoadingPage,
        meta: {
            title: 'Loading',
            requiresAuth: true, 
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