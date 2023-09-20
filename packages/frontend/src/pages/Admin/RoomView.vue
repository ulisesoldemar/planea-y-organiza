<template>
    <AdminLayout>
        <v-card class="pa-2">
            <v-card-title class="d-flex justify-space-between">
                <div>
                    <router-link to="/rooms">
                        <v-btn size="small" icon="mdi-arrow-left-bold" color="secondary" variant="tonal"></v-btn>
                    </router-link>
                </div>
                <div class="room-title">Sala: {{ currentRoom.roomName }}</div>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
                <!-- {{ currentRoom }} -->

                <v-list-item title="Número de sala" :subtitle="currentRoom.roomNumber"
                    @click="copyText(currentRoom.roomNumber)">
                    <template v-slot:append>
                        <v-icon icon="mdi-content-copy"></v-icon>
                    </template>
                </v-list-item>

                <v-list-item title="Fecha de creación" :subtitle="currentRoom.createdAt"></v-list-item>
                <v-list-item title="Fecha de expiración" :subtitle="currentRoom.expiration"></v-list-item>
                <v-list-item title="Tiempo maximo de la prueba:" :subtitle="currentRoom.maxTime + ' min'"></v-list-item>
                <v-list-item title="Inicio rapido" :subtitle="currentRoom.quickStart"></v-list-item>
                <v-list-item title="Configuración de la sala" :subtitle="currentRoom.status"></v-list-item>

                <div class="text-h6">Tiempo maximo de la prueba:</div>
                <div class="text-subtitle-1"> {{ currentRoom.maxTime }} min</div>

                <div class="text-h6">Personas en la sala:</div>
                <v-chip prepend-icon="mdi-account" v-for="player in currentRoom.players" color="primary">
                    {{ player }}
                </v-chip>
            </v-card-text>
        </v-card>
        <v-snackbar v-model="copySnackbar" timeout="2000">
            Número de sala copiado
            <template v-slot:actions>
                <v-btn color="blue" variant="text" @click="copySnackbar = false">
                    Cerrar
                </v-btn>
            </template>
        </v-snackbar>
    </AdminLayout>
</template>

<script setup>
import AdminLayout from '@/layouts/AdminLayout.vue';
import { useRoute, useRouter } from 'vue-router';
import { ref, watch, computed, onMounted } from 'vue';
import { useRooms } from '@/stores/rooms';

const roomStore = useRooms();
const route = useRoute();
const router = useRouter();
const currentRoom = computed(() => roomStore.currentRoom);

onMounted(async () => {
    if (route.params.roomNumber) {
        await roomStore.fetchRoomData(route.params.roomNumber);
    }
})

const copySnackbar = ref(false);

const copyText = (roomNumber) => {
    navigator.clipboard.writeText(roomNumber);
    copySnackbar.value = true;
}

</script>

<style scoped>
.room-title{
    color: #424242;
    /*font-weight: 500 !important;*/
    margin-right: 15px;
}
</style>