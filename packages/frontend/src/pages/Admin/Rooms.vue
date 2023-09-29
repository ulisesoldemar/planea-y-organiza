<template>
    <AdminLayout title="Salas">
        <v-row dense>
            <v-col cols="12" sm="6" md="4" lg="3" v-for="(room, index) in rooms" :key="room.roomNumber">
                <v-card preppend>
                    <v-btn :to="{
                            name: 'RoomView',
                            params: { roomNumber: room.roomNumber }
                        }"
                        variant="text"
                        color="primary"
                        class="ma-2"
                        prepend-icon="mdi-link-variant"
                        density="comfortable"
                        size="large"
                    >
                    {{room.roomName || room.roomNumber}}
                    </v-btn>
                    <v-card-subtitle class="surface-variant"
                        v-text="`Sala creada el: ${roomStore.formatDate(room.createdAt)}`"></v-card-subtitle>
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
                                        {{ room.expiration ? roomStore.formatDate(room.expiration) :
                                            "No expira" }}
                                    </v-list-item-subtitle>
                                </v-list-item>
                                <v-list-item title="Tiempo de la tarea" :subtitle="`${room.maxTime} minutos`"></v-list-item>
                                <v-list-item title="Estado" :subtitle="room.status"></v-list-item>
                                <v-list-item title="Inicio rápido"
                                    :subtitle="room.quickStart ? 'Activado' : 'Desactivado'"></v-list-item>
                                <!-- <v-list-item title="Sujetos en la sala">
                                    <v-list-item-subtitle>
                                        <v-row>
                                            <v-col  cols="auto">
                                                <v-chip v-for="item in usersJoined" class="ma-1" color="indigo" text-color="white" prepend-icon="mdi-account-circle">
                                                    {{ item }}
                                                </v-chip>
                                            </v-col>
                                        </v-row>
                                    </v-list-item-subtitle>
                                </v-list-item> -->

                            </v-list>
                        </div>
                    </v-expand-transition>

                    <v-divider></v-divider>

                    <v-card-actions>
                        <v-tooltip location="bottom center" origin="auto">
                            <template v-slot:activator="{ props }">
                                <v-btn v-bind="props" @click="toggleExpansion(index)"
                                    :icon="expandedRooms[index] ? 'mdi-information-off' : 'mdi-information'"
                                    color="surface-variant">
                                </v-btn>
                            </template>
                            <span>Información</span>
                        </v-tooltip>
                        <v-spacer></v-spacer>

                        <!-- <v-btn size="small" :color="room.status === 'Running' ? 'success' : 'surface-variant'"
                            @click="roomStore.startGame(room.roomNumber)" variant="text" icon="mdi-play"></v-btn> -->

                        <v-tooltip location="bottom center" origin="auto">
                            <template v-slot:activator="{ props }">
                                <v-btn v-bind="props" size="small"
                                    :color="room.status === 'Running' ? 'success' : 'surface-variant'"
                                    :disabled="room.status === 'Closed'" @click="roomStore.startGame(room.roomNumber)"
                                    variant="text" icon="mdi-play">
                                </v-btn>
                            </template>
                            <span>Iniciar Tarea</span>
                        </v-tooltip>

                        <v-tooltip location="bottom center" origin="auto">
                            <template v-slot:activator="{ props }">
                                <v-btn v-bind="props" size="small" color="surface-variant" variant="text"
                                    icon="mdi-account-plus"
                                    @click="playerDialog = true; currentRoomNumber = room.roomNumber"
                                    :disabled="room.status === 'Closed'"></v-btn>
                            </template>
                            <span>Invitar sujetos</span>
                        </v-tooltip>

                        <v-tooltip location="bottom center" origin="auto">
                            <template v-slot:activator="{ props }">
                                <v-btn v-bind="props" size="small" color="surface-variant" variant="text"
                                    icon="mdi-account-minus"
                                    @click="removePlayerDialog = true; currentRoomNumber = room.roomNumber"
                                    :disabled="room.status === 'Closed'"></v-btn>
                            </template>
                            <span>Eliminar sujetos de la sala</span>
                        </v-tooltip>

                        <v-tooltip location="bottom center" origin="auto">
                            <template v-slot:activator="{ props }">
                                <v-btn v-bind="props" size="small" color="surface-variant" variant="text" icon="mdi-pencil"
                                    @click="editRoom(room, index)"></v-btn>
                            </template>
                            <span>Editar sala</span>
                        </v-tooltip>

                        <v-tooltip location="bottom center" origin="auto">
                            <template v-slot:activator="{ props }">
                                <v-btn v-bind="props" size="small" color="surface-variant" variant="text" icon="mdi-delete"
                                    @click="deleteRoom(room, index)" :disabled="room.status === 'Running'"></v-btn>
                            </template>
                            <span>Eliminar sala</span>
                        </v-tooltip>
                    </v-card-actions>
                </v-card>
            </v-col>
            <v-col cols="12" sm="6" md="4" lg="3">
                <v-card class="d-flex flex-column align-center" height="134" @click="createRoom()">
                    <v-row align="center" justify="center">
                        <v-icon color="grey
                        " icon="mdi-plus-circle-outline" size="64"></v-icon>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>
        <v-dialog v-model="roomDialog" width="auto" max-width="700">
            <v-form ref="form" @submit.prevent="">
                <v-card class="pa-2">
                    <v-card-title>
                        <span class="text-h5">{{ formTitle }}</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                            <v-row>
                                <v-col cols="12" sm="6" md="12">
                                    <v-text-field color="primary" v-model="editedRoom.roomName" label="Nombre de la sala"
                                        :rules="nameRules"></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6" md="12">
                                    <v-text-field color="primary" v-model="editedRoom.password" :label="`${passwordLabel}`"
                                        :append-inner-icon="passwordVisible ? 'mdi-eye-off' : 'mdi-eye'"
                                        :type="passwordVisible ? 'text' : 'password'"
                                        @click:append-inner="passwordVisible = !passwordVisible"
                                        :rules="editedIndex < 0 ? createPasswordRules : editPasswordRules"
                                        required></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6" md="12">
                                    <v-text-field color="primary" v-model="editedRoom.expiration" label="Fecha de caducidad"
                                        type="date" :rules="expirationRules" :value="expirationDate"
                                        :min="new Date().toISOString().substring(0, 10)"></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6" md="12">
                                    <v-slider v-model="editedRoom.maxTime" class="align-center" max="60" min="2"
                                        label="Tiempo de la tarea" hide-details>
                                        <template v-slot:append>
                                            <v-text-field v-model="editedRoom.maxTime" hide-details single-line
                                                density="compact" type="number" style="width: 70px" max="60"
                                                min="2"></v-text-field>
                                        </template>
                                    </v-slider>
                                </v-col>
                                <v-col cols="6" sm="6" md="6">
                                    <v-select color="primary" v-model="editedRoom.status" label="Estado"
                                        :items="['Open', 'Closed']"></v-select>
                                </v-col>
                                <v-col cols="6" sm="6" md="4">
                                    <v-checkbox color="primary" v-model="editedRoom.quickStart"
                                        label="Inicio rápido"></v-checkbox>
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
        <v-dialog v-model="playerDialog" max-width="auto">
            <PlayerCrud :enabled-checkbox="true" :room-number="currentRoomNumber" :external-dialog="playerDialog"
                @close="playerDialog = false" />
        </v-dialog>
        <v-dialog v-model="removePlayerDialog" max-width="auto">
            <RemovePlayers :room-number="currentRoomNumber" :external-dialog="removePlayerDialog"
                @close="removePlayerDialog = false" />
        </v-dialog>
        <v-dialog v-model="deleteDialog" maxWidth="500px">
            <v-card>
                <v-card-title class="text-h5">¿Estás seguro de eliminar esta sala?</v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" variant="text" @click="closeDelete">Cancelar</v-btn>
                    <v-btn color="primary" variant="text" @click="deleteRoomConfirm">OK</v-btn>
                    <v-spacer></v-spacer>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-snackbar v-model="copySnackbar" timeout="2000">
            Número de sala copiado
            <template v-slot:actions>
                <v-btn color="blue" variant="text" @click="copySnackbar = false">
                    Cerrar
                </v-btn>
            </template>
        </v-snackbar>
    </AdminLayout>
</template>
  
<script setup>
import AdminLayout from '@/layouts/AdminLayout.vue';
import PlayerCrud from '@/components/Admin/PlayerCrud.vue';
import RemovePlayers from '@/components/Admin/RemovePlayers.vue';
import { useRooms } from '@/stores/rooms';
import { ref, watch, computed, onMounted, nextTick } from 'vue';

const roomStore = useRooms();

onMounted(async () => {
    await roomStore.listRooms();
});

const nameRules = [
    (v) => v && v.length <= 50 || 'El nombre de la sala debe tener 50 caracteres o menos',
];

const createPasswordRules = [
    (v) => !!v || 'La contraseña es requerida',
    (v) => v && v.length >= 6 || 'La contraseña debe tener al menos 6 caracteres',
];

const editPasswordRules = [
    (v) => !v || v.length >= 6 || 'La contraseña debe tener al menos 6 caracteres',
];

const expirationRules = [
    (v) => !v || new Date(v) >= new Date() || 'La fecha de caducidad debe ser en el futuro',
];

const passwordVisible = ref(false);

const form = ref(null); // Crear referencia al formulario
const roomDialog = ref(false);
const deleteDialog = ref(false);
const playerDialog = ref(false);
const removePlayerDialog = ref(false);
const copySnackbar = ref(false);

const rooms = computed(() => roomStore.rooms);
const expandedRooms = ref([]);
const currentRoomNumber = ref('');

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

const formTitle = computed(() => {
    return editedIndex.value === -1 ? 'Agregar sala' : 'Editar sala';
});

const passwordLabel = computed(() => {
    return editedIndex.value === -1 ? 'Contraseña*' : 'Nueva contraseña (dejar en blanco para no cambiarla)'
});

const expirationDate = computed(() => {
    if (editedRoom.value.expiration) {
        return editedRoom.value.expiration.substring(0, 10);
    }
    return '';
})

watch(roomDialog, (val) => {
    if (!val) {
        close();
    }
});

watch(deleteDialog, (val) => {
    if (!val) {
        closeDelete();
    }
});

watch(playerDialog, (val) => {
    if (!val) {
        closePlayerAdd();
    }
});

function editRoom(room, index) {
    editedIndex.value = index;
    editedRoom.value = { ...room };
    editedRoom.value.password = null;
    roomDialog.value = true;
}

function createRoom() {
    editedIndex.value = -1;
    editedRoom.value = { ...defaultRoom };
    roomDialog.value = true;
}

async function deleteRoom(room, index) {
    editedIndex.value = index;
    editedRoom.value = { ...room };
    deleteDialog.value = true;
}

async function deleteRoomConfirm() {
    await roomStore.deleteRoom(editedRoom.value.roomNumber);
    rooms.value.splice(editedIndex.value, 1);
    closeDelete();
}

const close = () => {
    roomDialog.value = false;
    nextTick(() => {
        editedRoom.value = { ...defaultRoom };
        editedIndex.value = -1;
    });
};

function closePlayerAdd() {
    playerDialog.value = false;
    nextTick(() => {
        currentRoomNumber.value = '';
    });
}

function closeDelete() {
    deleteDialog.value = false;
    nextTick(() => {
        editedRoom.value = { ...defaultRoom };
        editedIndex.value = -1;
    });
}

function closeRemovePlayer() {
    removePlayerDialog.value = false;
    nextTick(() => {
        editedIndex.value = -1;
    });
}

async function save() {
    const { valid } = await form.value.validate(); // Validamos todos los campos

    if (valid) {
        if (editedIndex.value > -1) {
            await roomStore.updateRoom(editedRoom.value);
        } else {
            await roomStore.createRoom(editedRoom.value);
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
