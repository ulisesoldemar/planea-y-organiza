<template>
<AdminLayout>
Hola
</AdminLayout>
</template>
  
<script setup>
import AdminLayout from '@/layouts/AdminLayout.vue';
import { useAdmins } from '@/stores/admin';

const adminStore = useAdmins();

</script>
  