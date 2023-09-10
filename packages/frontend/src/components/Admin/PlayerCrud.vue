<template>
    <v-data-table :headers="headers" :items="players" :sort-by="[{ key: 'addedAt', order: 'asc' }]"
        :items-length="players.length" class="pb-3 rounded elevation-1">
        <template v-slot:top>
            <v-toolbar flat class="rounded">
                <v-toolbar-title>Sujetos</v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-spacer></v-spacer>
                <v-dialog v-model="dialog" max-width="800px">
                    <template v-slot:activator="{ props }">
                        <v-btn color="primary" dark class="mr-4" v-bind="props" variant="outlined">
                            Agregar sujeto
                        </v-btn>
                        <v-btn v-if="enabledCheckbox" color="primary" dark class="mb-2" @click="addPlayersToRoom">
                            Aceptar
                        </v-btn>
                    </template>
                    <v-card class="pa-2">
                        <v-form ref="formFunc" @submit.prevent="">
                            <v-card-title>
                                <span class="text-h5">{{ formTitle }}</span>
                            </v-card-title>

                            <v-card-text>
                                <v-container>
                                    <v-row>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field color="primary" v-model="editedPlayer.firstName" label="Nombre(s)"
                                                :rules="nameRules"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field color="primary" v-model="editedPlayer.surName" label="Primer apellido"
                                                :rules="nameRules"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field color="primary" v-model="editedPlayer.secondSurName" :rules="SecSurnameRules"
                                                label="Segundo apellido"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field color="primary" v-model="editedPlayer.email" label="Email"
                                                :rules="emailRules"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field color="primary" v-model="editedPlayer.phone" label="Teléfono"
                                                :rules="phoneRules"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field color="primary" v-model="editedPlayer.age" label="Edad" type="number"
                                                :rules="ageRules" min="18"></v-text-field>
                                        </v-col>
                                    </v-row>

                                </v-container>
                            </v-card-text>

                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="primary" variant="text" @click="close">Cancelar</v-btn>
                                <v-btn color="primary" variant="text" @click="save">Aceptar</v-btn>
                            </v-card-actions>
                        </v-form>
                    </v-card>
                </v-dialog>
                <v-dialog v-model="dialogDelete" max-width="500px">
                    <v-card class="pa-2">
                        <v-card-title class="text-h5">¿Seguro que quieres eliminar al sujeto?</v-card-title>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="primary" variant="text" @click="closeDelete">Cancelar</v-btn>
                            <v-btn color="primary" variant="text" @click="deletePlayerConfirm">OK</v-btn>
                            <v-spacer></v-spacer>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-toolbar>
        </template>
        <template v-slot:item.actions="{ item }">
            <v-container v-if="!enabledCheckbox" class="text-center">
                <!-- <v-icon size="small" class="me-2" @click="editPlayer(item.raw)">mdi-pencil</v-icon> -->
                <!-- <v-icon size="small" class="me-2" @click="deletePlayer(item.raw, item.index)">mdi-delete</v-icon> -->
                <v-btn variant="flat" density="comfortable" class="me-2" icon="mdi-pencil" size="small" @click="editPlayer(item.raw)"><v-icon color="primary"></v-icon>
                </v-btn>
                <v-btn variant="flat" density="comfortable" class="me-2" icon="mdi-delete" size="small" @click="deletePlayer(item.raw, item.index)"><v-icon color="primary"></v-icon></v-btn>
                <!-- <v-checkbox :label="item.raw.id" value="John"></v-checkbox> -->
                <v-btn
                    :to="{
                        name: 'ResultView',
                        params: { id: item.raw._id },
                    }"
                    density="comfortable"
                    class="text-none"
                    prepend-icon="mdi-archive-search"
                    variant="flat"
                    >
                    <template v-slot:prepend>
                        <v-icon color="primary"></v-icon>
                    </template>
                    Resultados
                </v-btn>
                <!-- <v-icon size="small" @click="console.log(item.raw._id)">mdi-account-multiple-plus</v-icon> -->
            </v-container>
            <v-container v-else>
                <v-checkbox v-model="selected" :value="item.raw._id"
                    @click:append="selected.push(item.raw._id)"></v-checkbox>
            </v-container>
        </template>
    </v-data-table>
</template>
  
<script setup>
import { usePlayers } from '@/stores/players';
import { useRooms } from '@/stores/rooms';
import { ref, watch, computed, defineProps, onMounted, nextTick } from 'vue';

const playerStore = usePlayers();
const roomStore = useRooms();

const formFunc = ref(null)

const props = defineProps({
    enabledCheckbox: Boolean,
    roomNumber: String,
});

const selected = ref([]);

async function addPlayersToRoom() {
    await roomStore.addPlayersToRoom(props.roomNumber, selected.value);
}

onMounted(async () => {
    await playerStore.listPlayers();
});

const dialog = ref(false);
const dialogDelete = ref(false);

const headers = [
    { title: 'Nombre(s)', align: 'start', key: 'firstName' },
    { title: 'Primer apellido', key: 'surName' },
    { title: 'Segundo apellido', key: 'secondSurName' },
    { title: 'Email', key: 'email' },
    { title: 'Teléfono', key: 'phone' },
    { title: 'Edad', key: 'age' },
    { title: 'Agregado el', key: 'addedAt' },
    { title: 'Acciones', key: 'actions', align: 'center' },
];

const players = computed(() => playerStore.players);

const editedIndex = ref(-1);

const editedPlayer = ref({
    id: null,
    firstName: '',
    surName: '',
    secondSurName: '',
    email: '',
    phone: '',
    age: null,
    addedAt: null,
});

const defaultPlayer = {
    id: null,
    firstName: '',
    surName: '',
    secondSurName: '',
    email: '',
    phone: '',
    age: null,
    distance: null, // number
    score: null,    // number
    addedAt: null,
};

const formTitle = computed(() => {
    return editedIndex.value === -1 ? 'Nuevo Sujeto' : 'Editar Sujeto';
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
})

// Methods
const editPlayer = (player) => {
    console.log(player)
    editedIndex.value = 1;
    editedPlayer.value = { ...player };
    dialog.value = true;
};

const deletePlayer = (player) => {
    editedIndex.value = players.value.indexOf(player);
    editedPlayer.value = { ...player };
    dialogDelete.value = true;
};

const deletePlayerConfirm = async () => {
    await playerStore.deletePlayer(editedPlayer.value._id);
    players.value.splice(editedIndex.value, 1);
    closeDelete();
};

const close = () => {
    dialog.value = false;
    nextTick(() => {
        editedPlayer.value = { ...defaultPlayer };
        editedIndex.value = -1;
    });
};

const closeDelete = () => {
    dialogDelete.value = false;
    nextTick(() => {
        editedPlayer.value = { ...defaultPlayer };
        editedIndex.value = -1;
    });
};

const save = async () => {
    const { valid } = await formFunc.value.validate();

    if (valid) {
        if (editedIndex.value > -1) {
            await playerStore.updatePlayer(editedPlayer.value);
        } else {
            await playerStore.createPlayer(editedPlayer.value).catch(e => console.error(e));
        }
        await playerStore.listPlayers();
        close();
    }
};

const nameRules = [
    v => !!v || 'Este campo es obligatorio',
    v => (v && v.length >= 2) || 'Ingrese al menos 2 caracteres',
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
    v => !!v || 'Este campo es obligatorio',
    v => /^\d{10}$/.test(v) || 'Ingrese un número de teléfono válido',
];

const ageRules = [
    v => !!v || 'Este campo es obligatorio',
    v => (v >= 1 && v <= 140) || 'Ingrese una edad válida',
];
</script>
  