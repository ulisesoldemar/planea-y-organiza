<template>
    <div style="background-color: #f2f2f2;">
        <v-container class="h-screen d-flex justify-center align-center">
            <v-card class="pa-10" width="inherit">
                <v-row>
                    <v-col cols="12" md="4">
                        <v-text-field v-model="formData.firstName" label="Nombre" :rules="nameRules" required></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-text-field v-model="formData.surName" label="Primer Apellido" :rules="nameRules" required></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-text-field v-model="formData.secondSurName" label="Segundo Apellido"></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" md="6">
                        <v-text-field v-model="formData.email" label="Correo Electrónico" :rules="emailRules"
                            required></v-text-field>
                    </v-col>
                    <v-col cols="12" md="3">
                        <v-text-field v-model="formData.phone" label="Teléfono" :rules="phoneRules" required></v-text-field>
                    </v-col>
                    <v-col cols="12" md="3">
                        <v-text-field v-model="formData.age" label="Edad" type="number" :rules="ageRules"></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12">
                        <v-btn type="submit" color="primary" @click="submitForm">Enviar</v-btn>
                    </v-col>
                </v-row>
            </v-card>
    
        </v-container>
    </div>
</template>
  
<script setup>
import { usePlayers } from '@/stores/players';
import { ref } from 'vue';

const playerStore = usePlayers();

const formData = ref(playerStore.playerData);

const nameRules = [
    v => !!v || 'Este campo es obligatorio',
    v => (v && v.length >= 2) || 'Ingrese al menos 2 caracteres',
];

const emailRules = [
    v => !!v || 'Este campo es obligatorio',
    v => /.+@.+\..+/.test(v) || 'Ingrese una dirección de correo electrónico válida',
];

const phoneRules = [
    v => !!v || 'Este campo es obligatorio',
    v => /^\d{10}$/.test(v) || 'Ingrese un número de teléfono válido',
];

const ageRules = [
    v => !!v || 'Este campo es obligatorio',
    v => (v >= 0 && v <= 150) || 'Ingrese una edad válida',
];

const submitForm = async () => {
    await playerStore.updatePlayer(formData);
};
</script>
  