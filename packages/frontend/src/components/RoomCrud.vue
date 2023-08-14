<template>
    <v-container>
        <v-card>
            <v-card-title class="headline">Crear Sala</v-card-title>
            <v-card-text>
                <v-form ref="form" @submit.prevent="createRoom">
                    <v-text-field v-model="formData.roomNumber" label="Número de sala" type="number"></v-text-field>
                    <v-text-field v-model="formData.roomName" label="Nombre de la sala"></v-text-field>
                    <v-text-field v-model="formData.expiration" label="Fecha de expiración" type="date"></v-text-field>
                    <v-btn type="submit" color="primary">Crear Sala</v-btn>
                </v-form>
            </v-card-text>
        </v-card>
    </v-container>
</template>
  
<script setup>
import { useAdmins } from '@/stores/admin';
import { ref } from 'vue';

const adminStore = useAdmins();

const formData = ref({
    roomNumber: null,
    roomName: null,
    expiration: null,
});

function createRoom() {
    adminStore.createRoom(formData.value);
}

</script>
  