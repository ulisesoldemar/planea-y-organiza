<template>
  <v-card width="auto">
    <div class="justify-center h-screen d-flex align-center">
      <div class="mb-5 text-center">
        <h5 class="mb-1 text-h5">
          {{ props.message }}
        </h5>
        <p class="text-sm">
          {{ props.messageDescription }}
        </p>
  
        <router-link :to="props.route">
          <v-btn icon="mdi-play" size="x-large" color="primary" class="mt-10"></v-btn>
        </router-link>
  
      </div>
    </div>
  </v-card>
</template>
 
<script setup>
const props = defineProps({
  message: {
    type: String,
    required: true,
  },
  messageDescription: {
    type: String,
    required: false,
  },
  route: {
    type: String,
    required: true,
  }
})
</script>
 