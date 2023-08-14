<template>
    <v-card>
        <v-layout>
            <v-navigation-drawer expand-on-hover rail>

                <v-list>
                    <v-list-item :title="adminStore.userName" :subtitle="adminStore.userData.email"></v-list-item>
                </v-list>

                <v-divider></v-divider>

                <v-list density="compact" nav>
                    <router-link to="/">
                        <v-list-item prepend-icon="mdi-home" title="Inicio" value="home"></v-list-item>
                    </router-link>
                    <router-link to="/rooms">
                        <v-list-item prepend-icon="mdi-account-group" title="Salas de tarea" value="rooms"></v-list-item>
                    </router-link>
                    <router-link to="/players">
                        <v-list-item prepend-icon="mdi-account" title="Sujetos" value="players"></v-list-item>
                    </router-link>
                    <v-list-item prepend-icon="mdi-list-status" title="Resultados" value="results"></v-list-item>
                </v-list>

                <template v-slot:append>
                    <v-divider></v-divider>
                    <v-list density="compact">
                        <v-list-item prepend-icon="mdi-logout" title="Cerrar sesión" @click="adminStore.logout"></v-list-item>
                    </v-list>
                </template>

            </v-navigation-drawer>
        </v-layout>
    </v-card>
</template>
  
<script setup>
import { useAdmins } from '@/stores/admin';
import { onMounted } from 'vue';

const adminStore = useAdmins();

onMounted(() => {
    adminStore.fetchUserData();
});

</script>
  