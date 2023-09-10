<template>
    <v-dialog v-model="dialog" activator="parent" width="auto">
        <v-form ref="form">
            <v-card>
                <v-card-title>
                    <span class="text-h5">{{ formTitle }}</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="8" sm="6" md="8">
                                <v-text-field color="primary" v-model="editedRoom.roomName" label="Nombre de la sala"
                                    :rules="nameRules"></v-text-field>
                            </v-col>
                            <v-col cols="8" sm="6" md="8">
                                <v-text-field color="primary" v-model="editedRoom.password" :label="`${passwordLabel}`"
                                    :append-inner-icon="passwordVisible ? 'mdi-eye-off' : 'mdi-eye'"
                                    :type="passwordVisible ? 'text' : 'password'"
                                    @click:append-inner="passwordVisible = !passwordVisible" :rules="passwordRules"
                                    required></v-text-field>
                            </v-col>
                            <v-col cols="8" sm="6" md="8">
                                <v-text-field color="primary" v-model="editedRoom.expiration" label="Fecha de caducidad" type="date"
                                    :rules="expirationRules"></v-text-field>
                            </v-col>
                            <v-col cols="8" sm="6" md="8">
                                <v-slider v-model="editedRoom.maxTime" class="align-center" max="60" min="5" hide-details>
                                    <template v-slot:append>
                                        <v-text-field color="primary" v-model="editedRoom.maxTime" hide-details single-line
                                            density="compact" type="number" style="width: 70px" max="60"
                                            min="5"></v-text-field>
                                    </template>
                                </v-slider>
                            </v-col>
                            <v-col cols="6" sm="6" md="6">
                                <v-select color="primary" v-model="editedRoom.status" label="Estado" :items="['Open', 'Closed']"></v-select>
                            </v-col>
                            <v-col cols="6" sm="6" md="4">
                                <v-checkbox color="primary" v-model="editedRoom.quickStart" label="Inicio rápido"></v-checkbox>
                            </v-col>
                        </v-row>
                    </v-container>
                    <small>*Indica campos requeridos</small>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" variant="text" @click="close">
                        Cancelar
                    </v-btn>
                    <v-btn color="primary" variant="text" @click="save">
                        Guardar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-form>
    </v-dialog>
</template>
  
<script setup>
import { useRooms } from '@/stores/rooms';
import { ref, watch, computed, onMounted, nextTick } from 'vue';

const roomStore = useRooms();

const nameRules = [
    (v) => v && v.length <= 50 || 'El nombre de la sala debe tener 50 caracteres o menos',
];

const passwordRules = [
    (v) => !!v || 'La contraseña es requerida',
    (v) => v && v.length >= 6 || 'La contraseña debe tener al menos 6 caracteres',
];

const expirationRules = [
    (v) => !v || new Date(v) >= new Date() || 'La fecha de caducidad debe ser en el futuro',
];

const passwordVisible = ref(false);

const form = ref(null); // Crear referencia al formulario
const dialog = ref(false);
const deleteDialog = ref(false);

const editedIndex = ref(-1);

const editedRoom = ref({
    roomNumber: null,
    roomName: null,
    password: null,
    expiration: null,
    maxTime: 30,
    players: [],
    status: null,
    quickStart: false,
});

const defaultRoom = {
    roomNumber: null,
    roomName: '',
    password: '',
    expiration: null,
    maxTime: 30,
    players: [],
    status: null,
    quickStart: false,
}

watch(dialog, (val) => {
    if (!val) {
        close();
    }
});

watch(deleteDialog, (val) => {
    if (!val) {
        closeDelete();
    }
});

function close() {
    dialog.value = false;
    nextTick(() => {
        editedRoom.value = { ...defaultRoom };
        editedIndex.value = -1;
    });
}

function closeDelete() {
    deleteDialog.value = false;
    nextTick(() => {
        editedRoom.value = { ...defaultRoom };
        editedIndex.value = -1;
    });
}

async function save() {
    const isValid = form.value.validate(); // Validamos todos los campos

    if (isValid) {
        if (editedIndex.value > -1) {
            await roomStore.updateRoom(editedRoom.value);
        } else {
            await roomStore.createRoom(editedRoom.value);
        }
        close();
    }
}

</script>

<style scoped>
.align-center {
    align-items: center;
}
</style>
