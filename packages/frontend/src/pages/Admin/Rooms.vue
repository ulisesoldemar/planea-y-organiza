<template>
    <AdminLayout title="Salas">
        <v-row dense>
            <v-col cols="12" sm="6" md="4" lg="3" v-for="(room, index) in rooms" :key="room.roomNumber">
                <v-card>
                    <v-card-title class="surface-variant" v-text="`${room.roomName || room.roomNumber}`"></v-card-title>
                    <v-card-subtitle class="surface-variant"
                        v-text="`Sala creada el: ${new Date(room.createdAt).toLocaleDateString('es-MX')}`"></v-card-subtitle>
                    <v-expand-transition>
                        <div v-if="expandedRooms[index]">
                            <v-list class="bg-transparent">
                                <v-list-item title="Número de sala" :subtitle="room.roomNumber"
                                    @click="copyText(room.roomNumber)">
                                    <template v-slot:append>
                                        <v-icon icon="mdi-content-copy"></v-icon>
                                    </template>
                                </v-list-item>
                                <v-list-item title="Fecha de caducidad">
                                    <v-list-item-subtitle>
                                        {{ room.expiration ? new Date(room.expiration).toLocaleDateString('es-MX') :
                                            "No expira" }}
                                    </v-list-item-subtitle>
                                </v-list-item>
                                <v-list-item title="Sujetos invitados"
                                    :subtitle="room.players.length.toString()"></v-list-item>
                                <v-list-item title="Estado" :subtitle="room.status"></v-list-item>
                            </v-list>
                        </div>
                    </v-expand-transition>

                    <v-divider></v-divider>

                    <v-card-actions>
                        <v-btn @click="toggleExpansion(index)"
                            :icon="expandedRooms[index] ? 'mdi-information-off' : 'mdi-information'"
                            color="surface-variant">
                        </v-btn>
                        <v-spacer></v-spacer>

                        <v-btn size="small" :color="room.status === 'Running' ? 'success' : 'surface-variant'"
                            variant="text" icon="mdi-play"></v-btn>

                        <v-btn size="small" color="surface-variant" variant="text" icon="mdi-pencil"
                            @click="editRoom(room, index)"></v-btn>

                        <v-btn size="small" color="surface-variant" variant="text" icon="mdi-delete"
                            @click="deleteRoom(room, index)" :disabled="room.status === 'Running'"></v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
            <v-col cols="12" sm="6" md="4" lg="3">
                <v-card class="d-flex flex-column align-center" height="100" @click="defaultRoom = null; dialog = true">
                    <v-row align="center" justify="center">
                        <v-icon color="grey
                        " icon="mdi-plus-circle-outline" size="64"></v-icon>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>
        <v-dialog v-model="dialog" width="auto">
            <v-form ref="form">
                <v-card>
                    <v-card-title>
                        <span class="text-h5">{{ formTitle }}</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                            <v-row>
                                <v-col cols="8" sm="6" md="8">
                                    <v-text-field v-model="editedRoom.roomName" label="Nombre de la sala"
                                        :rules="nameRules"></v-text-field>
                                </v-col>
                                <v-col cols="8" sm="6" md="8">
                                    <v-text-field v-model="editedRoom.password" :label="`${passwordLabel}*`"
                                        :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                                        :type="visible ? 'text' : 'password'" @click:append-inner="visible = !visible" :rules="passwordRules"
                                        required></v-text-field>
                                </v-col>
                                <v-col cols="8" sm="6" md="8">
                                    <v-text-field v-model="editedRoom.expiration" label="Fecha de caducidad" type="date"
                                        :rules="expirationRules"></v-text-field>
                                </v-col>
                                <v-col cols="8" sm="6" md="8">
                                    <v-checkbox v-model="editedRoom.quickStart" label="Inicio rápido"></v-checkbox>
                                </v-col>
                            </v-row>
                        </v-container>
                        <small>*Indica campos requeridos</small>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue-darken-1" variant="text" @click="close">
                            Cancelar
                        </v-btn>
                        <v-btn color="blue-darken-1" variant="text" @click="save">
                            Guardar
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-form>
        </v-dialog>
        <v-dialog v-model="dialogDelete" maxWidth="auto">
            <v-card>
                <v-card-title class="text-h5">¿Estás seguro de eliminar esta sala?</v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue-darken-1" variant="text" @click="closeDelete">Cancelar</v-btn>
                    <v-btn color="blue-darken-1" variant="text" @click="deleteRoomConfirm">OK</v-btn>
                    <v-spacer></v-spacer>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-snackbar v-model="copySnackbar" timeout="2000">
            Número de sala copiado
            <template v-slot:actions>
                <v-btn color="blue" variant="text" @click="snackbar = false">
                    Cerrar
                </v-btn>
            </template>
        </v-snackbar>
    </AdminLayout>
</template>
  
<script setup>
import AdminLayout from '@/layouts/AdminLayout.vue';
import { useRooms } from '@/stores/rooms';
import { nextTick } from 'vue';
import { watch } from 'vue';
import { ref, computed, onMounted } from 'vue';

const roomStore = useRooms();

onMounted(() => {
    roomStore.listRooms();
});

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

const visible = ref(false);

const form = ref(null); // Crear referencia al formulario
const dialog = ref(false);
const dialogDelete = ref(false);
const copySnackbar = ref(false);

const rooms = computed(() => roomStore.rooms);
const expandedRooms = ref([]);

const editedIndex = ref(-1);

const editedRoom = ref({
    roomNumber: null,
    roomName: null,
    password: null,
    expiration: null,
    players: [],
    quickStart: false,
});

const defaultRoom = {
    roomNumber: null,
    roomName: '',
    password: '',
    expiration: null,
    players: [],
    quickStart: false,
}

const formTitle = computed(() => {
    return editedIndex.value === -1 ? 'Agregar sala' : 'Editar sala';
});

const passwordLabel = computed(() => {
    return editedIndex.value === -1 ? 'Contraseña' : 'Nueva contraseña'
});

watch(dialog, (val) => {
    if (!val) {
        close();
    }
});

watch(dialogDelete, (val) => {
    if (!val) {
        closeDelete();
    }
});

function editRoom(room, index) {
    editedIndex.value = index;
    editedRoom.value = { ...room };
    editedRoom.value.password = null;
    dialog.value = true;
}

async function deleteRoom(room, index) {
    editedIndex.value = index;
    editedRoom.value = { ...room };
    dialogDelete.value = true;
}

function deleteRoomConfirm() {
    roomStore.deleteRoom(editedRoom.value.roomNumber);
    rooms.value.splice(editedIndex.value, 1);
    closeDelete();
}

function close() {
    dialog.value = false;
    nextTick(() => {
        editedRoom.value = { ...defaultRoom };
        editedIndex.value = -1;
    });
}

function closeDelete() {
    dialogDelete.value = false;
    nextTick(() => {
        editedRoom.value = { ...defaultRoom };
        editedIndex.value = -1;
    });
}

function save() {
    const isValid = form.value.validate(); // Validamos todos los campos

    if (isValid) {
        if (editedIndex.value > -1) {
            roomStore.updateRoom(editedRoom.value);
        } else {
            roomStore.createRoom(editedRoom.value);
        }
        close();
    }
}

const toggleExpansion = (index) => {
    expandedRooms.value[index] = !expandedRooms.value[index];
};

const copyText = (roomNumber) => {
    navigator.clipboard.writeText(roomNumber);
    copySnackbar.value = true;
}

</script>

<style scoped>
.align-center {
    align-items: center;
}
</style>
