<template>
  <Loading :items="itemsArray"/>
</template>

<script setup>
  import Loading from '@/components/Loading.vue';
  import { io } from 'socket.io-client';
  const backendUrl = process.env.VUE_APP_BACKEND_URL;

  const socket = io(backendUrl);

  socket.on('connect', () => {
    console.log('Conectado al servidor');
  });

  const itemsArray = ["Eduardo", "Fabian", "Maria", "Ricardo"];

  console.log(itemsArray);

</script>

