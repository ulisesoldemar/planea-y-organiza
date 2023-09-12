<template>
    <div class="justify-center h-screen d-flex align-center">
        <div class="mb-4 text-center">
            <h1 class="mb-6 text-h1">
                {{ isTimeOver ? '¡Tu tiempo ha terminado!' : '¡Buen trabajo! Has ingresado todas las pelotas' }}
            </h1>
            <h2 class="mb-1 text-h2">
                ¡Muchas gracias por participar!
            </h2>
            <router-link to="/player-signup">
                <v-btn class="mt-15" color="primary">Regresar al inicio</v-btn>
            </router-link>

        </div>
    </div>
</template>
  
<script setup>
defineProps({
    isTimeOver: Boolean,
});
</script>
  

  