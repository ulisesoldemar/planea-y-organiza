<template>
    <v-dialog v-model="dialog">
        <v-card>
            <v-card-title>
                <span class="text-h5">Agregar sala</span>
            </v-card-title>
            <v-card-text>
                <v-container>
                    <v-row>
                        <v-col cols="8" sm="6" md="4">
                            <v-text-field v-model="roomData.roomName" label="Nombre de la sala"></v-text-field>
                        </v-col>
                        <v-col cols="8" sm="6" md="4">
                            <v-text-field v-model="roomData.roomNumber" label="Número de sala*"
                                hint="example of helper text only on focus"></v-text-field>
                        </v-col>
                        <v-col cols="8" sm="6" md="8">
                            <v-text-field v-model="roomData.password" label="Contraseña*" type="password"
                                required></v-text-field>
                        </v-col>
                        <v-col cols="8" sm="6" md="8">
                            <v-text-field v-model="roomData.expiration" label="Fecha de caducidad"
                                type="date"></v-text-field>
                        </v-col>
                        <v-col cols="8" sm="6" md="8">
                            <v-checkbox v-model="roomData.quickStart" label="Inicio rápido"></v-checkbox>
                        </v-col>
                    </v-row>
                </v-container>
                <small>*Indica campos requeridos</small>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue-darken-1" variant="text" @click="dialog = false">
                    Cancelar
                </v-btn>
                <v-btn color="blue-darken-1" variant="text" @click="createRoom">
                    Crear
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
  
<script setup>
import { useRooms } from '@/stores/rooms';
import { ref, defineProps } from 'vue';

const roomStore = useRooms();

const props = defineProps({
    dialog: Boolean,
})

const roomData = ref({
    roomNumber: null,
    roomName: null,
    password: null,
    expiration: null,
    players: [],
    quickStart: false,
});

async function createRoom() {
    await roomStore.createRoom(roomData.value);
    closeDialog();
}

</script>
  