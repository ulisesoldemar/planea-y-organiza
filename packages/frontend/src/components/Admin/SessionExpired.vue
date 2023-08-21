<template>
    <v-card>
        <v-card-title>La sesión ha caducado</v-card-title>
        <v-card-text>
            ¿Sigues ahí?
        </v-card-text>
        <v-card-actions>
            <v-btn @click="refreshSession">
                Sigo aquí
            </v-btn>
            <v-btn @click="">
                Cerrar sesión
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script setup>
import { useAdmins } from '@/stores/admin';

const adminStore = useAdmins();

async function refreshSession() {
    await adminStore.fetchNewAccessToken();
}

async function logout() {
    await adminStore.logout();
}

</script>