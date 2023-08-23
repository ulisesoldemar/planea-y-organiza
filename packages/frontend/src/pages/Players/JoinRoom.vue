<template>
    <div class="justify-center h-screen d-flex align-center" style="background-color: #f5f5f5;">
        <v-card class="px-12 py-8 mx-auto" elevation="8" width="550" max-width="550" rounded="lg">
            <v-card-title class="mb-4 text-center">
                Acceder al juego
            </v-card-title>
            <v-form v-model="formFunction" @submit.prevent="">

                <div class="text-subtitle-1 text-medium-emphasis">Número de sala</div>
                <v-text-field v-model="formData.roomNumber" :rules="roomNumberRules" :error-messages="roomNumberErrors"
                    placeholder="Sala" prepend-inner-icon="mdi-account-group" variant="outlined"
                    color="primary"></v-text-field>

                <div class="text-subtitle-1 text-medium-emphasis">Correo electrónico</div>
                <v-text-field v-model="formData.email" :rules="emailRules" :error-messages="emailErrors" variant="outlined"
                    placeholder="Correo" prepend-inner-icon="mdi-email" color="primary"></v-text-field>

                <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
                    Contraseña de la sala
                </div>
                <v-text-field v-model="formData.password" :rules="passwordRules" :error-messages="passwordErrors"
                    :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" :type="visible ? 'text' : 'password'"
                    placeholder="Ingresa la contraseña de la sala" prepend-inner-icon="mdi-lock-outline" variant="outlined"
                    @click:append-inner="visible = !visible" @keyup.enter="handleJoin" color="primary"></v-text-field>

                <p v-if="errorMessage" class="text-center text-red">{{ errorMessage }}</p>
                <v-btn color="primary" block class="mt-4 mb-8" size="large" variant="elevated" @click="handleJoin"
                    :disabled="!formFunction" :loading="loading">
                    Ingresar
                </v-btn>
            </v-form>
        </v-card>
    </div>
</template>

<script setup>
import { useGame } from "@/stores/game";
import { ref, watch } from "vue";

const formFunction = ref(false);
const loading = ref(false);

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
    if (roomNumberErrors.value.length === 0 && emailErrors.value.length === 0 && passwordErrors.value.length === 0) {
        loading.value = true;
        gameStore.joinRoom(formData.value)
            .then(loading.value = false)
            .catch(error => errorMessage.value = error.message)
    }

}
</script>
