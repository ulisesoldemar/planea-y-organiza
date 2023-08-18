<template>
    <v-navigation-drawer expand-on-hover rail permanent>

        <v-list>
            <v-list-item :title="adminStore.userName" :subtitle="adminStore.userData.email"></v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list density="compact" nav>
            <v-list-item prepend-icon="mdi-home" title="Inicio" value="home" to="/"></v-list-item>
            <v-list-item prepend-icon="mdi-account" title="Sujetos" value="players" to="/players"></v-list-item>
            <v-list-item prepend-icon="mdi-account-group" title="Salas de tarea" value="rooms" to="/rooms"></v-list-item>
            <v-list-item prepend-icon="mdi-list-status" title="Resultados" value="results" to="/results"></v-list-item>
        </v-list>

        <template v-slot:append>
            <v-divider></v-divider>
            <v-list density="compact">
                <v-list-item prepend-icon="mdi-logout" title="Cerrar sesión" @click="adminStore.logout"></v-list-item>
            </v-list>
        </template>

    </v-navigation-drawer>
</template>
  
<script setup>
import { useAdmins } from '@/stores/admin';
import { onMounted } from 'vue';

const adminStore = useAdmins();

onMounted(() => {
    adminStore.fetchUserData();
});

</script>
  
<style scoped>
/* Style for unvisited links */
.v-list-item__action {
    text-decoration: none;
    /* Remove underline for links */
    color: #424242;
}

a.active-link {
    color: #01579B;
}
</style>