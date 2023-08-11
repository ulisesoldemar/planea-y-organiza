<template>
    <v-card>
        <v-layout>
            <v-navigation-drawer expand-on-hover rail>

                <v-list>
                    <v-list-item :title="this.userName" :subtitle="this.userEmail"></v-list-item>
                </v-list>

                <v-divider></v-divider>

                <v-list density="compact" nav>
                    <router-link to="/">
                        <v-list-item prepend-icon="mdi-home" title="Inicio" value="home"></v-list-item>
                    </router-link>
                    <router-link to="/rooms">
                        <v-list-item prepend-icon="mdi-google-classroom" title="Salas de tarea" value="rooms"></v-list-item>
                    </router-link>
                    <router-link to="/players">
                        <v-list-item prepend-icon="mdi-account" title="Sujetos" value="players"></v-list-item>
                    </router-link>
                    <v-list-item prepend-icon="mdi-list-status" title="Resultados" value="results"></v-list-item>
                </v-list>

                <template v-slot:append>
                    <v-divider></v-divider>
                    <v-list density="compact">
                        <v-list-item prepend-icon="mdi-logout" title="Cerrar sesión" @click="logout"></v-list-item>
                    </v-list>
                </template>

            </v-navigation-drawer>
        </v-layout>
    </v-card>
</template>
  
<script>
import { useAdmins } from '@/stores/admin';

export default {
    data() {
        return {
            userAvatar: "",
            userName: "",
            userEmail: "",
        };
    },
    mounted() {
        this.fetchUserData()
    },
    methods: {
        logout() {
            // Llama al método logout del store userStore
            const adminStore = useAdmins();

            adminStore.logout(); // Asegúrate de que el nombre del método sea el mismo que el definido en tu store
        },
        fetchUserData() {
            const adminStore = useAdmins();
            const userData = adminStore.userData;
            this.userName = `${userData.firstName} ${userData.surName} ${userData.secondSurName || ''}`;
            this.email = userData.email;
        },
        fetchRoomsData() {
            const adminStore = useAdmins();

            adminStore.fetchRoomsData();
        },
    },
};
</script>
  