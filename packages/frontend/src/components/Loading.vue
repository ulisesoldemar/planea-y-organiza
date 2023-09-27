<template>
  <div class="loading-page">
    <v-progress-circular
    color="primary"
    indeterminate
    :size="79"
    :width="7"
    ></v-progress-circular>
    <p class="mt-10 mb-10">Esperando a que el administrador inicie la tarea ...</p>
    <div class="center-content">
      <v-chip v-for="item in arrayItems" class="ma-2" color="primary">
        {{ item }}
      </v-chip>
    </div>
  </div>
</template>


<script setup>
import { ref, defineProps } from 'vue';

const { items } = defineProps(['items']);

const arrayItems = [];

arrayItems.push(items);

</script>


<style>
.body{
    padding: 0px;
    margin: 0px;
}

.loading-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100vh;
    background-color: #f5f5f5;
}

.center-content{
    flex-direction: row !important;
}

</style>