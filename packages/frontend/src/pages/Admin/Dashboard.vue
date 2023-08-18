<template>
<AdminLayout>
    <v-card class="pa-5" width="400">
        Hola
    </v-card>
    <CookiesBanner />
</AdminLayout>
</template>
  
<script setup>
import AdminLayout from '@/layouts/AdminLayout.vue';
import CookiesBanner from '@/components/Admin/CookiesBanner.vue';
import { useAdmins } from '@/stores/admin';

const adminStore = useAdmins();

</script>
  