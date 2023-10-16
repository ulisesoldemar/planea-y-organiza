<template>
    <div class="justify-center h-screen d-flex align-center">
        <v-card class="pb-8 mx-auto pa-12" elevation="8" width="630" max-width="630" rounded="lg">
            <v-card-title>
                Verifica tus datos
            </v-card-title>
            <small class="d-flex flex-row-reverse">* Indica campos requeridos</small>
            <v-form ref="formFunction" @submit.prevent="">
                <v-text-field v-model="formData.firstName" class="mt-5" label="* Nombre(s)" :rules="nameRules" required></v-text-field>
                <v-row>
                    <v-col cols="12" md="6">
                        <v-text-field v-model="formData.surName" label="* Primer Apellido" :rules="nameRules"
                            required></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field v-model="formData.secondSurName" label="Segundo Apellido" :rules="SecSurnameRules"></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" md="12">
                        <v-text-field v-model="formData.email" label="* Correo Electrónico" :rules="emailRules"
                            required></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" md="6">
                        <v-text-field v-model="formData.age" label="* Edad" type="number" :rules="ageRules"></v-text-field>
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
    v => /^[^0-9_!¡?÷?¿\/\\+=@#$%ˆ&*(){}|~<>;:[\]]*$/.test(v) || 'Ingrese un nombre valido',
];

const SecSurnameRules = [
    v => /^[^0-9_!¡?÷?¿\/\\+=@#$%ˆ&*(){}|~<>;:[\]]*$/.test(v) || 'Ingrese un nombre valido',
];

const emailRules = [
    v => !!v || 'Este campo es obligatorio',
    v => /.+@.+\..+/.test(v) || 'Ingrese una dirección de correo electrónico válida',
];

const phoneRules = [
    (v) => {
        if (!v) {
            return true;
        } else {
            return /^\d{10}$/.test(v) || 'Ingrese un número de teléfono válido';
        }
}];

const ageRules = [
    v => !!v || 'Este campo es obligatorio',
    v => (v >= 1 && v <= 140) ? true : 'Ingrese una edad válida',
];

const submitForm = async () => {

    const { valid } = await formFunction.value.validate();

    if (valid) {
        loading.value = true;
        await gameStore.updatePlayer(formData.value).then(loading.value = false).then(submited.value = true);
    }

}
</script>
  