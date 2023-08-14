<template>
    <v-card class="mx-auto">
        <Navbar />
        <v-container fluid>
            <v-row dense>
                <v-col v-for="room in rooms" :key="room.roomNumber" :cols="6">
                    <v-card>
                        <!-- <v-img :src="card.src" class="align-end" gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                            height="200px" cover>
                            <v-card-title class="text-white" v-text="card.roomRumber"></v-card-title>
                        </v-img> -->
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
</template>

<script setup>
import Navbar from '@/components/Navbar.vue';
import { useAdmins } from '@/stores/admin';
import { computed } from 'vue';
import { onMounted } from 'vue';

const adminStore = useAdmins();
const rooms = computed(() => adminStore.rooms)

onMounted(() => {
    adminStore.fetchRoomsData();
})

</script>