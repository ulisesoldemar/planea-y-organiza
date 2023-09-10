<template>
    <v-layout style="margin-left: 70px;" class="mt-4 mr-4"> 
        <v-card class="w-100">
            <v-card-title class="headline">Ingresar a la Sala</v-card-title>
            <v-card-text>
                <v-form ref="form" @submit.prevent="createRoom">
                    <v-row>
                        <v-col cols="12">
                            <v-text-field color="primary" v-model="formData.roomNumber" label="Número de sala" type="number"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12">
                            <v-text-field color="primary" v-model="formData.roomName" label="Código de Acceso"></v-text-field>
                        </v-col>
                    </v-row>
                    
                    <v-btn type="submit" color="primary">Unirme</v-btn>
                </v-form>
            </v-card-text>
        </v-card>
    </v-layout>
    
</template>
  
<script setup>
import { useAdmins } from '@/stores/admin';
import { onMounted } from 'vue';
import { computed } from 'vue';
import { ref } from 'vue';

const adminStore = useAdmins();

const screenWidth = ref(window.innerWidth - (window.innerWidth * 0.2));
const screenHeight = ref(window.innerHeight - (window.innerHeight * 0.1));

const updateScreenSize = () => {
    screenWidth.value = window.innerWidth;
    screenHeight.value = window.innerHeight - (window.innerHeight * 0.1);
};

onMounted(() => {
    window.addEventListener('resize', updateScreenSize);
});

const formData = ref({
    roomNumber: null,
    roomName: null,
    expiration: null,
});

function createRoom() {
    adminStore.createRoom(formData.value);
}

</script>
  