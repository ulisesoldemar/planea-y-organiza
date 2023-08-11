<template>
    <Navbar />
    <v-main>
        <v-slot></v-slot>
    </v-main>
</template>
  
<script>
import Navbar from '@/components/Navbar.vue';

export default {
    components: {
        Navbar
    },
};
</script>
  