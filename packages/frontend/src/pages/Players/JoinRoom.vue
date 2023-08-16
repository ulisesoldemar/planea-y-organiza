<template>
    <div class="justify-center h-screen d-flex align-center">
        <v-card class="pb-8 mx-auto pa-12" elevation="8" width="448" max-width="448" rounded="lg">
            <div class="text-subtitle-1 text-medium-emphasis">Número de sala</div>
            <v-text-field v-model="form.roomNumber" density="compact" placeholder="Sala"
                prepend-inner-icon="mdi-account-key" variant="outlined"></v-text-field>

            <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
                Código de acceso único
            </div>

            <v-text-field v-model="form.uniqueAccessCode" :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                :type="visible ? 'text' : 'password'" density="compact" placeholder="Ingresa tu contraseña"
                prepend-inner-icon="mdi-lock-outline" variant="outlined"
                @click:append-inner="visible = !visible"></v-text-field>

            <!-- Agregar el evento click para iniciar el proceso de login -->
            <v-btn block class="mb-8" color="blue" size="large" variant="tonal" @click="handleJoin">
                Ingresar
            </v-btn>
        </v-card>
    </div>
</template>
  
<script setup>
import { useGame } from "@/stores/game";
import { ref } from "vue";

const gameStore = useGame();

const form = ref({
    roomNumber: null,
    uniqueAccessCode: null
});
const visible = ref(false);

async function handleJoin() {
    gameStore.joinRoom(form.value);
}

</script>
  