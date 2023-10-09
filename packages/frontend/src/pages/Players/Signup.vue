<template>
    <div class="justify-center h-screen d-flex align-center">
        <v-card class="pb-8 mx-auto pa-12" elevation="8" width="630" max-width="630" rounded="lg">
            <v-card-title>
                Verifica tus datos
            </v-card-title>
            <v-form v-model="formFunction" @submit.prevent="">
                <v-text-field v-model="formData.firstName" label="Nombre(s)" :rules="nameRules" required></v-text-field>
                <v-row>
                    <v-col cols="12" md="6">
                        <v-text-field v-model="formData.surName" label="Primer Apellido" :rules="nameRules"
                            required></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field v-model="formData.secondSurName" label="Segundo Apellido"></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" md="12">
                        <v-text-field v-model="formData.email" label="Correo Electrónico" :rules="emailRules"
                            required></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" md="6">
                        <v-text-field v-model="formData.age" label="Edad" type="number" :rules="ageRules"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field v-model="formData.phone" label="Teléfono" :rules="phoneRules"></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12">
                        <v-btn type="submit" block color="primary" @click="submitForm" :disabled="!formFunction"
                            :loading="loading">Enviar</v-btn>
                    </v-col>
                </v-row>
            </v-form>
            <v-dialog v-model="submited">
                <Message message="Gracias" message-description="En seguida se mostraran las instrucciones"
                    route="/instructions"></Message>
            </v-dialog>
        </v-card>
    </div>
</template>
  
<script setup>
import Message from '@/components/Message.vue';
import { useGame } from '@/stores/game';
import { ref } from 'vue';

const gameStore = useGame();
const formFunction = ref(false);
const formData = ref(gameStore.playerData);
const loading = ref(false);
const submited = ref(false);

const nameRules = [
    v => !!v || 'Este campo es obligatorio',
    v => (v && v.length >= 2) || 'Ingrese al menos 2 caracteres',
];

const emailRules = [
    v => !!v || 'Este campo es obligatorio',
    v => /.+@.+\..+/.test(v) || 'Ingrese una dirección de correo electrónico válida',
];

const phoneRules = [
    v => /^\d{10}$/.test(v) || 'Ingrese un número de teléfono válido',
];

const ageRules = [
    v => (v >= 0 && v <= 150) || 'Ingrese una edad válida',
];

const submitForm = async () => {
    loading.value = true;
    await gameStore.updatePlayer(formData.value).then(loading.value = false).then(submited.value = true);
}
</script>
  