<template>
    <AdminLayout>
        <v-card class="pa-2" width="100%">
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

                <v-row>
                    <v-col cols="12" md="7">

                        <v-list-item title="Número de sala" :subtitle="currentRoom.roomNumber"
                            @click="copyText(currentRoom.roomNumber)">
                            <template v-slot:append>
                                <v-icon icon="mdi-content-copy"></v-icon>
                            </template>
                        </v-list-item>

                        <v-row>
                            <v-col cols="12" md="6">
                                <v-list-item title="Fecha de creación" :subtitle="roomStore.formatDate(currentRoom.createdAt)"></v-list-item>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-list-item title="Fecha de expiración" :subtitle="roomStore.formatDate(currentRoom.expiration)"></v-list-item>
                            </v-col>
                        </v-row>
                        <v-list-item title="Tiempo maximo de la prueba:"
                            :subtitle="currentRoom.maxTime + ' min'"></v-list-item>
                        <v-list-item title="Inicio rapido" :subtitle="currentRoom.quickStart"></v-list-item>
                        <v-list-item title="Configuración de la sala" :subtitle="currentRoom.status"></v-list-item>
                        <!--         
                        <div class="text-h6">Tiempo maximo de la prueba:</div>
                        <div class="text-subtitle-1"> {{ currentRoom.maxTime }} min</div> -->

                        <div class="pa-2 my-3"></div>
                        <h3 class="pa-2 my-2"> Jugadores </h3>
                        <v-divider></v-divider>
                        <v-row>
                            <v-col>
                                <v-list-item subtitle="Invitados"></v-list-item>
                                <v-chip prepend-icon="mdi-account-circle" v-for="player in currentRoom.players"
                                    color="grey700" class="ma-2">
                                    {{ player.fullName }}
                                </v-chip>
                            </v-col>
                            <v-divider class="ma-4" inset vertical></v-divider>
                            <v-col>
                                <v-list-item subtitle="En la sala"></v-list-item>
                                <v-chip prepend-icon="mdi-account-circle" v-for="player in currentRoom.usersInRoom"
                                    color="primary" class="ma-2">
                                    {{ player }}
                                </v-chip>
                            </v-col>
                        </v-row>
                    </v-col>
                    <v-divider class="ma-2" inset vertical></v-divider>
                    <v-col>
                        <h3> Notificaciones </h3>
                    </v-col>
                </v-row>

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
});

const copySnackbar = ref(false);

const copyText = (roomNumber) => {
    navigator.clipboard.writeText(roomNumber);
    copySnackbar.value = true;
}

</script>

<style scoped>
.room-title {
    color: #424242;
    /*font-weight: 500 !important;*/
    margin-right: 15px;
}
</style>