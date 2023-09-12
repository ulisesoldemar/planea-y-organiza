import { createRouter, createWebHistory } from "vue-router";
import { useAdmins } from "@/stores/admin";
import { usePlayers } from "@/stores/players";
import { useGame } from "@/stores/game";

// Admin
import Login from '@/pages/Admin/Login.vue';
import Dashboard from '@/pages/Admin/Dashboard.vue'
import Rooms from '@/pages/Admin/Rooms.vue';
import Room from '@/components/Admin/Room.vue';
import Players from '@/pages/Admin/Players.vue';
import Results from '@/pages/Admin/Results.vue';
import Admins from '@/pages/Admin/Admins.vue';
import AccountSettings from '@/pages/Admin/AccountSettings.vue';

//Players
import Instructions from '@/pages/Players/Instructions.vue';
import JoinRoom from '@/pages/Players/JoinRoom.vue';
import PlayerSignup from '@/pages/Players/Signup.vue';
import Game from "@/components/Game.vue";
import Test from '@/pages/Test.vue';
import ThankYou from '@/pages/Players/ThankYou.vue';

// Results
import ResultView from '@/pages/Admin/ResultView.vue'

//General
import Welcome from '@/pages/Welcome.vue';
import ErrorHeader from '@/components/ErrorHeader.vue';


const adminRoutes = [
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
        path: '/rooms/:roomNumber',
        component: Room,
        meta: {
            title: 'Sala',
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
        path: '/players/:playerId',
        component: Players,
        meta: {
            title: 'Sujeto',
            requiresAuth: true, // Indica que esta ruta requiere autenticación
        }
    },
    {
        path: '/results',
        name: 'results',
        component: Results,
        meta: {
            title: 'Resultados',
            requiresAuth: true, // Indica que esta ruta requiere autenticación
        }
    },
    {
        path: '/results/:id',
        component: ResultView,
        name: 'ResultView',
        meta: {
            title: 'Resultados',
            requiresAuth: true, // Indica que esta ruta requiere autenticación
        }
    },
    {
        path: '/admins',
        name: 'admins',
        component: Admins,
        meta: {
            title: 'Admins',
            requiresAuth: true, // Indica que esta ruta requiere autenticación
        }
    },
    {
        path: '/account-settings',
        name: 'accountSettings',
        component: AccountSettings,
        meta: {
            title: 'accountSettings',
            requiresAuth: true, // Indica que esta ruta requiere autenticación
        }
    },
]

const playerRoutes = [
    {
        path: '/join-room',
        name: 'join-room',
        component: JoinRoom,
        meta: {
            title: 'Ingresar a sala',
        }
    },
    {
        path: '/player-signup',
        name: 'player-signup',
        component: PlayerSignup,
        meta: {
            title: 'Verifica tus datos',
            requiresConnected: true,
        }
    },
    {
        path: '/instructions',
        name: 'instructions',
        component: Instructions,
        meta: {
            title: 'Instrucciones',
            requiresConnected: true,
        }
    },
    {
        path: '/game',
        name: 'game',
        component: Game,
        meta: {
            title: 'Game',
            requiresConnected: false, // Indica que se debe estar conectado
        },
    },
    {
        path: '/thank-you',
        name: 'ThankYou',
        component: ThankYou,
        props: true,
        meta: {
            title: 'Thank You',
            requiresConnected: false,
        }

    }
];

const genericRoutes = [
    {
        path: '/welcome',
        name: 'Welcome',
        component: Welcome,
        meta: {
            title: 'Welcome',
        }
    },
    {
        path: '/test',
        name: 'test',
        component: Test,
        meta: {
            title: 'Test',
        },
    },
    {
        path: '/401',
        name: '401',
        component: ErrorHeader,
        props: { errorCode: '401', errorTitle: 'Unauthorized', errorDescription: 'Acceso denegado.' },
        meta: {
            title: 'Error',
            requiresAuth: false,
        }
    },
    {
        path: '/403',
        name: '403',
        component: ErrorHeader,
        props: { errorCode: '403', errorTitle: 'Forbidden', errorDescription: 'No tienes permiso para acceder a este recurso.' },
        meta: {
            title: 'Error',
            requiresAuth: false,
        }
    },
    {
        path: '/:pathMatch(.*)*',
        name: '404',
        component: ErrorHeader,
        props: { errorCode: '404', errorTitle: 'Page not found', errorDescription: 'No podemos encontrar la página que estabas buscando.' },
        meta: {
            title: 'Error',
            requiresAuth: false,
        }
    },
    {
        path: '/500',
        name: '/500',
        component: ErrorHeader,
        props: { errorCode: '500', errorTitle: 'Internal Server Error', errorDescription: 'Hubo un error, intentalo de nuevo más tarde.' },
        meta: {
            title: 'Error',
            requiresAuth: false,
        }
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes: [
        ...genericRoutes,
        ...adminRoutes,
        ...playerRoutes
    ],
})

// Verificar el estado de autenticación antes de cada navegación
router.beforeEach((to, from, next) => {
    const adminStore = useAdmins(); // Accede al store de usuarios
    const gameStore = useGame();
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    const requiresConnected = to.matched.some(record => record.meta.requiresConnected);
    // Si la ruta requiere autenticación y el usuario no está autenticado, redirige al inicio de sesión
    if (requiresAuth && !adminStore.isAuthenticated) {
        next({ name: 'login' });
    } else if (requiresConnected && !gameStore.connected) {
        next({ name: 'join-room' });
    } else {
        next();
    }
});

export default router