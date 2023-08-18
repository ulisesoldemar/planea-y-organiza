<template>
    <div class="justify-center h-screen d-flex align-center">
        <v-card class="pb-8 mx-auto pa-12" elevation="8" width="448" max-width="448" rounded="lg">
            <v-card-title>
                Acceder al juego
            </v-card-title>
            <div class="text-subtitle-1 text-medium-emphasis">Número de sala</div>
            <v-text-field v-model="formData.roomNumber" :rules="roomNumberRules" :error-messages="roomNumberErrors"
                density="compact" placeholder="Sala" prepend-inner-icon="mdi-account-group"
                variant="outlined"></v-text-field>
            <div class="text-subtitle-1 text-medium-emphasis">Correo electrónico</div>
            <v-text-field v-model="formData.email" :rules="emailRules" :error-messages="emailErrors" density="compact"
                placeholder="Correo" prepend-inner-icon="mdi-email" variant="outlined"></v-text-field>
            <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
                Contraseña de la sala
            </div>

            <v-text-field v-model="formData.password" :rules="passwordRules" :error-messages="passwordErrors"
                :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" :type="visible ? 'text' : 'password'"
                density="compact" placeholder="Ingresa la contraseña de la sala" prepend-inner-icon="mdi-lock-outline"
                variant="outlined" @click:append-inner="visible = !visible" @keyup.enter="handleJoin"></v-text-field>

            <p v-if="errorMessage" class="text-center text-red">{{ errorMessage }}</p>
            <v-btn block class="mb-8" color="blue" size="large" variant="tonal" @click="handleJoin">
                Ingresar
            </v-btn>
        </v-card>
    </div>
</template>

<script setup>
import { useGame } from "@/stores/game";
import { ref, watch } from "vue";

const gameStore = useGame();

const formData = ref({
    roomNumber: null,
    email: null,
    password: null
});
const visible = ref(false);

const roomNumberRules = [
    value => !!value || 'Este campo es obligatorio',
];

const emailRules = [
    value => !!value || 'Este campo es obligatorio',
    value => /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value) || 'Correo electrónico inválido'
];

const passwordRules = [
    value => !!value || 'Este campo es obligatorio',
];

const roomNumberErrors = ref([]);
const emailErrors = ref([]);
const passwordErrors = ref([]);
const errorMessage = ref(""); // Initialize error message as empty

watch(formData, () => {
    roomNumberErrors.value = roomNumberRules.map(rule => rule(formData.roomNumber)).filter(error => !!error);
    emailErrors.value = emailRules.map(rule => rule(formData.email)).filter(error => !!error);
    passwordErrors.value = passwordRules.map(rule => rule(formData.password)).filter(error => !!error);
});

async function handleJoin() {
    try {
        if (roomNumberErrors.value.length === 0 && emailErrors.value.length === 0 && passwordErrors.value.length === 0) {
            await gameStore.joinRoom(formData.value);
        }
    } catch (error) {
        errorMessage.value = error.message;
    }
}
</script>
