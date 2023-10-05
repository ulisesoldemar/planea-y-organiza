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

                        <v-list-item class="rounded mb-3 py-2" style="border: solid rgb(217, 217, 217) 1px;" title="Número de sala" :subtitle="currentRoom.roomNumber"
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
                                <v-list-item  title="Fecha de expiración">
                                    <v-list-item-subtitle :style="isExpired ? 'color: #B71C1C' : ''">
                                        {{ expiredAt }}
                                        <span v-if="isExpired"> - Expirado </span>
                                    </v-list-item-subtitle>
                                </v-list-item>
                            </v-col>
                        </v-row>
                        <v-list-item title="Tiempo maximo de la prueba:"
                            :subtitle="currentRoom.maxTime + ' minutos'"></v-list-item>
                        <v-list-item title="Inicio rápido"
                                :subtitle="currentRoom.quickStart ? 'Activado' : 'Desactivado'"></v-list-item>
                        <v-list-item title="Estado de la sala" :subtitle="currentRoom.status === 'Open' ? 'Abierta' : 'Cerrada'"></v-list-item>
                        
                        <div class="pa-2 my-1"></div>
                        
                        <div class="d-flex flex-row-reverse">
                            <v-list-item title="Iniciar tarea" class="text-center">
                                <v-btn size="small"
                                    :color="currentRoom.status === 'Open' ? 'primary' : 'surface-variant'"
                                    :disabled="currentRoom.status === 'Closed'" @click="roomStore.startGame(currentRoom.roomNumber)"
                                    variant="outlined" icon="mdi-play">
                                </v-btn>
                            </v-list-item>
                        </div>

                        <h3 class="pa-2 my-2"> Sujetos </h3>
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
                        <h3 class="mb-5"> Notificaciones </h3>
                        <div class="list-notifications">
                            <div class="d-flex flex-column align-end justify-end">
                                <v-row v-for="notification in notifications">

                                        <v-card color="indigo" variant="tonal" class="mb-2 text-end rounded-lg rounded-be-0">
                                            <v-card-item style="padding: 8px 5px 5px 8px;">
                                                <div class="text-body-2" style="line-height: 1.2 !important;">
                                                    {{notification.text}}
                                                </div>
                                                <div class="text-caption" style="line-height: 1 !important; font-size: 0.68rem !important;">
                                                    {{ notification.time }}
                                                </div>
                                            </v-card-item>
                                        </v-card>

                                </v-row>
                            </div>
                        </div>
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
const notifications = computed(() => roomStore.currentRoom.notifications);

console.log(currentRoom.value);

const status = ref(null);

const expiredAt = ref('');
const isExpired = ref(null);

onMounted(async () => {
    if (route.params.roomNumber) {
        await roomStore.fetchRoomData(route.params.roomNumber);

        if(currentRoom.value.expiration){
            expiredAt.value = roomStore.formatDate(currentRoom.value.expiration);
            isExpired.value = new Date() > new Date(currentRoom.value.expiration);
        } else {
            expiredAt.value = "No expira";
            isExpired.value = false;
        }
        
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

  .list-notifications {
    height: calc(100vh - 200px);
    overflow-y: auto;
    padding-right: 20px;
    padding-top: 20px;
    /* overflow-x: hidden; */
  }

</style>