<template>
    <AdminLayout title="Salas">
        <v-dialog v-model="dialog" width="50%">
            <template v-slot:activator="{ props }">
                <v-row dense>
                    <v-col cols="12" sm="6" md="4" lg="3" v-for="(room, index) in rooms" :key="room.roomNumber">
                        <v-card>
                            <v-card-title class="surface-variant"
                                v-text="`${room.roomName || room.roomNumber} - ${new Date(room.createdAt).toLocaleDateString('es-MX')}`"></v-card-title>
                            <v-card-subtitle class="surface-variant" v-text="`Sala: ${room.roomNumber}`"></v-card-subtitle>
                            <v-expand-transition>
                                <div v-if="expandedRooms[index]">
                                    <v-list class="bg-transparent">
                                        <v-list-item title="Fecha de caducidad"
                                            :subtitle="room.expiration || 'No expira'"></v-list-item>
                                        <v-list-item title="Sujetos invitados"
                                            :subtitle="room.players.length"></v-list-item>
                                        <v-list-item title="Estado" :subtitle="room.status"></v-list-item>
                                    </v-list>
                                </div>
                            </v-expand-transition>

                            <v-divider></v-divider>

                            <v-card-actions>
                                <v-btn @click="toggleExpansion(index)"
                                    :icon="expandedRooms[index] ? 'mdi-information-off' : 'mdi-information'"
                                    color="surface-variant">
                                </v-btn>
                                <v-spacer></v-spacer>

                                <v-btn size="small" :color="room.status === 'Running' ? 'success' : 'surface-variant'"
                                    variant="text" icon="mdi-play"></v-btn>

                                <v-btn size="small" color="surface-variant" variant="text" icon="mdi-pencil"></v-btn>

                                <v-btn size="small" color="surface-variant" variant="text" icon="mdi-delete"></v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-col>
                    <v-col cols="12" sm="6" md="4" lg="3">
                        <v-card class="d-flex flex-column align-center" height="100%" v-bind="props">
                            <v-row align="center" justify="center">
                                <v-icon color="grey
                        " icon="mdi-plus-circle-outline" size="64"></v-icon>
                            </v-row>
                        </v-card>
                    </v-col>
                </v-row>
            </template>
            <RoomCrud :dialog="dialog" @closeDialog="closeDialog"></RoomCrud>
        </v-dialog>
    </AdminLayout>
</template>
  
<script setup>
import AdminLayout from '@/layouts/AdminLayout.vue';
import RoomCrud from '@/components/Admin/RoomCrud.vue';
import { useRooms } from '@/stores/rooms';
import { ref, computed, onMounted } from 'vue';

const roomStore = useRooms();
const rooms = computed(() => roomStore.rooms);
const expandedRooms = ref([]);

const dialog = ref(false);

const closeDialog = () => {
    dialog.value = false;
};

onMounted(() => {
    roomStore.listRooms();
});

const toggleExpansion = (index) => {
    expandedRooms.value[index] = !expandedRooms.value[index];
};
</script>

<style scoped>
.align-center {
    align-items: center;
}
</style>
