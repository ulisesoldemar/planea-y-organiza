<template>

   <div class="justify-center h-screen d-flex align-center">
    <div class="mb-4 text-center">
        <h1 class="text-h1">
            {{ props.errorCode }}
        </h1>
        <h5 class="mb-1 text-h5">
            {{ props.errorTitle }} ⚠️
        </h5>
        <p class="text-sm">
            {{ props.errorDescription }}
        </p>

        <router-link :to="errorRoute">
          <v-btn class="mt-15" color="primary">Regresar</v-btn>
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
  errorRoute: {
    type: String,
    required: true,
  }
})
</script>
