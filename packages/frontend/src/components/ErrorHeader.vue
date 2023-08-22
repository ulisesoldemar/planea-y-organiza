<template>

   <div class="h-screen d-flex justify-center align-center">
    <div class="text-center mb-4">
        <h1 class="text-h1">
            {{ props.errorCode }}
        </h1>
        <h5 class="text-h5 mb-1">
            {{ props.errorTitle }}
        </h5>
        <p class="text-sm">
            {{ props.errorDescription }}
        </p>

        <router-link to="/">
          <v-btn class="mt-15" color="primary">Regresar al inicio</v-btn>
        </router-link>

    </div>
   </div> 
  
</template>

<script setup>
const props = defineProps({
  errorCode: {
    type: String,
    required: true,
  },
  errorTitle: {
    type: String,
    required: true,
  },
  errorDescription: {
    type: String,
    required: true,
  },
})
</script>
