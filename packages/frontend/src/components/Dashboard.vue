<template>
    <v-app>
        <v-navigation-drawer app v-model="drawer">
            <!-- Agrega aquí los elementos del menú lateral -->
            <v-list>
                <v-list-item>
                    <v-icon>mdi-view-dashboard</v-icon>
                    <v-list-item-title>Dashboard</v-list-item-title>
                </v-list-item>
                <v-list-item>
                    <v-icon>mdi-account</v-icon>
                    <v-list-item-title>Usuarios</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>

        <v-app-bar app>
            <!-- Agrega el botón para controlar la visibilidad del menú lateral -->
            <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
            <v-toolbar-title>My Dashboard</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn color="red" text @click="logout">Logout</v-btn>
        </v-app-bar>

        <v-main>
            <v-container fluid>
                <!-- Agrega aquí el contenido del dashboard -->
                <h1>Welcome to your Dashboard!</h1>

                <!-- Agrega aquí el componente -->
                <PlayerCrud />
            </v-container>
        </v-main>
    </v-app>
</template>
  
<script>
import PlayerCrud from '@/components/PlayerCrud.vue'
import { useAdmins } from '@/stores/admin'

export default {
    components: {
        PlayerCrud
    },
    data() {
        return {
            drawer: true, // El menú lateral estará visible inicialmente
        };
    },
    methods: {
        logout() {
            // Llama al método logout del store userStore
            const adminStore = useAdmins();

            adminStore.logout(); // Asegúrate de que el nombre del método sea el mismo que el definido en tu store
        },
    },
};
</script>
  