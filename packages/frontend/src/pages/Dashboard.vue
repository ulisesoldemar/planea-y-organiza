<template>
    <Navbar />
    <RoomCrud />
</template>
  
<script setup>
import RoomCrud from '@/components/RoomCrud.vue'
import PlayerCrud from '@/components/PlayerCrud.vue'
import Navbar from '@/components/Navbar.vue';
import { useAdmins } from '@/stores/admin';
import { onMounted } from 'vue';
import { onUnmounted } from 'vue';

const adminStore = useAdmins();
onMounted(() => {
    adminStore.connect();
    adminStore.startTokenRefreshTimer();
});

onUnmounted(() => {
    adminStore.disconnect();
});

// export default {
//     components: {
//         RoomCrud,
//         PlayerCrud,
//         Navbar
//     },
// };
</script>
  