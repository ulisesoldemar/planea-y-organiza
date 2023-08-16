<template>
    <v-layout class="rounded">
        <Navbar />
        <v-main class="justify-center d-flex align-center" style="min-height: 300px;">
            <slot></slot>
        </v-main>
    </v-layout>
</template>
  
<script setup>
import Navbar from '@/components/Admin/Navbar.vue';
import { useAdmins } from '@/stores/admin';
import { onMounted, onUnmounted } from 'vue';

const adminStore = useAdmins();

onMounted(() => {
    adminStore.connect();
    adminStore.startTokenRefreshTimer();
});

onUnmounted(() => {
    adminStore.disconnect();
});

</script>