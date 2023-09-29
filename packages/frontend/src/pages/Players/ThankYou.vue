<template>
    <div class="justify-center h-screen d-flex align-center">
        <div class="mb-4 text-center">
            <h1 class="mb-6 text-h3">

                <div v-if="isTimeOver">¡Tu tiempo ha terminado!</div>
                <div v-else>
                    <p class="font-weight-bold mb-10">¡Buen trabajo!</p>
                    Has ingresado todas las pelotas
                </div>
            </h1>
            <h2 class="mb-1 text-h3">
                ¡Muchas gracias por participar!
            </h2>
            <router-link to="/welcome">
                <v-btn class="mt-15" color="primary">Regresar al inicio</v-btn>
            </router-link>

        </div>
    </div>
</template>
  
<script setup>
import { useGame } from '@/stores/game';
import { computed } from 'vue';

const gameStore = useGame();
const isTimeOver = computed(() => gameStore.isTimeOver);

</script>
  

  