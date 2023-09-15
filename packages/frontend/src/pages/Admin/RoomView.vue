<template>
    <AdminLayout>
        <v-card>
            {{ currentRoom }}
        </v-card>
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

</script>