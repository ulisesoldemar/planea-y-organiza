<template>
    <v-layout class="rounded">
        <Navbar />
        <v-container fluid>
            <v-main class="justify-center d-flex align-center" style="min-height: 300px;">
                <slot></slot>
            </v-main>
        </v-container>
    </v-layout>
</template>
  
<script setup>
import Navbar from '@/components/Admin/Navbar.vue';
import { useAdmins } from '@/stores/admin';
import { onMounted } from 'vue';

const adminStore = useAdmins();

onMounted(() => {
    adminStore.fetchUserData();
});

</script>