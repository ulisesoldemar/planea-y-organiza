<template>
    <v-layout style="margin-left: 70px;" class="mt-4 mr-4">
        <v-card class="w-100">
            <!-- <p>Ancho: {{ screenWidth }}</p>
            <p>Alto: {{ screenHeight }}</p> -->
            <v-card-title class="headline">Crear Sala</v-card-title>
            <v-card-text>
                <v-form ref="form" @submit.prevent="createRoom">

                    <v-row>
                        <v-col cols="6">
                            <v-text-field v-model="roomData.roomNumber" label="Número de sala" type="number"></v-text-field>
                        </v-col>
                        <v-col cols="6">
                            <v-text-field v-model="roomData.roomName" label="Nombre de la sala"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-text-field v-model="roomData.password" label="Contraseña" type="password"></v-text-field>
                    <v-text-field v-model="roomData.expiration" label="Fecha de expiración" type="date"></v-text-field>
                    <v-btn type="submit" color="primary">Crear Sala</v-btn>
                </v-form>
            </v-card-text>
        </v-card>
    </v-layout>
</template>
  
<script setup>
import { useRooms } from '@/stores/room';
import { onMounted } from 'vue';
import { ref } from 'vue';

const roomStore = useRooms();

const screenWidth = ref(window.innerWidth - (window.innerWidth * 0.2));
const screenHeight = ref(window.innerHeight - (window.innerHeight * 0.1));

const updateScreenSize = () => {
    screenWidth.value = window.innerWidth;
    screenHeight.value = window.innerHeight - (window.innerHeight * 0.1);
};

onMounted(() => {
    window.addEventListener('resize', updateScreenSize);
});

const roomData = ref({
    roomNumber: null,
    roomName: null,
    password: null,
    expiration: null,
});

function createRoom() {
    roomStore.createRoom(roomData.value);
}

</script>
  