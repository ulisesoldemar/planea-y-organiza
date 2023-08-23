<template>
<AdminLayout>
    <v-card width="100%">
        <v-card-title>Bienvenido a P&O</v-card-title>
    </v-card>
    <!-- <CookiesBanner /> -->
</AdminLayout>
</template>
  
<script setup>
import AdminLayout from '@/layouts/AdminLayout.vue';
import CookiesBanner from '@/components/Admin/CookiesBanner.vue';
import { useAdmins } from '@/stores/admin';

const adminStore = useAdmins();

</script>
  