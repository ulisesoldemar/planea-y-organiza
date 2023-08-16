<template>
    <AdminLayout>
        <v-card class="mx-auto">
            <v-container fluid>
                <v-row dense>
                    <v-col v-for="room in rooms" :key="room.roomNumber" cols="12">
                        <v-card>
                            <v-card-title class="surface-variant" v-text="room.roomName || room.roomNumber"></v-card-title>
                            <v-card-subtitle class="surface-variant" v-text="`Sala: ${room.roomNumber}`"></v-card-subtitle>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn size="small" color="surface-variant" variant="text" icon="mdi-heart"></v-btn>
                                <v-btn size="small" color="surface-variant" variant="text" icon="mdi-bookmark"></v-btn>
                                <v-btn size="small" color="surface-variant" variant="text" icon="mdi-share-variant"></v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </v-card>
    </AdminLayout>
</template>
  
<script setup>
import AdminLayout from '@/layouts/AdminLayout.vue';
import { useRooms } from '@/stores/room';
import { computed } from 'vue';
import { onMounted } from 'vue';

const roomStore = useRooms();
const rooms = computed(() => roomStore.rooms)

onMounted(() => {
    roomStore.listRooms();
})
</script>
  