<template>
    <v-navigation-drawer expand-on-hover rail permanent>
        <v-list>
            
            <v-list-item to="/account-settings" :title="adminStore.fullName" :subtitle="adminStore.userData.email">
                <template v-slot:prepend>
                    <v-avatar :color="adminStore.avatar.bkColor" size="39" style="margin-left: -8px;">
                        <span class="text-h6" :style="{color : adminStore.avatar.textColor}">{{ adminStore.initials }}</span>
                    </v-avatar>
                </template>
            </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list density="compact" nav>
            <v-list-item color="secondary" prepend-icon="mdi-home" title="Inicio" value="home" to="/"></v-list-item>
            <v-divider></v-divider>
            <v-list-item color="secondary" prepend-icon="mdi-account" title="Sujetos" value="players" to="/players"></v-list-item>
            <v-list-item color="secondary" prepend-icon="mdi-account-group" title="Salas de tarea" value="rooms" to="/rooms"></v-list-item>
            <!-- <v-list-item color="secondary" prepend-icon="mdi-list-status" title="Resultados" value="results" to="/results"></v-list-item> -->
            <v-list-item color="secondary" v-if="adminStore.userData.superAdmin" prepend-icon="mdi-account-tie" title="Administradores"
                value="admins" to="/admins"></v-list-item>
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
import { useAdmins } from "@/stores/admin";

const adminStore = useAdmins();

</script>