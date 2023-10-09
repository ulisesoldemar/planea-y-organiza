<template>
    <v-data-table :headers="headers" :items="players" :sort-by="[{ key: 'addedAt', order: 'asc' }]"
        :items-length="players.length" class="pb-3 rounded elevation-1">
        <template v-slot:top>
            <v-toolbar flat class="rounded-t">
                <v-toolbar-title>Sujetos</v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-spacer></v-spacer>
                <v-dialog v-model="dialog" max-width="800px">
                    <template v-slot:activator="{ props }">
                        <v-btn color="primary" variant="outlined" dark class="mr-4" @click="loadFileDialog()">
                            Agregar con archivo
                        </v-btn>
                        <v-btn color="primary" dark class="mr-4" v-bind="props" variant="outlined">
                            Agregar nuevo
                        </v-btn>
                        <v-btn v-if="enabledCheckbox" color="primary" dark class="mr-4" @click="addPlayersToRoom"
                            variant="outlined">
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
                                            <v-text-field color="primary" v-model="editedPlayer.surName"
                                                label="Primer apellido" :rules="nameRules"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field color="primary" v-model="editedPlayer.secondSurName"
                                                :rules="SecSurnameRules" label="Segundo apellido"></v-text-field>
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
                                            <v-text-field color="primary" v-model="editedPlayer.age" label="Edad"
                                                type="number" :rules="ageRules" min="18"></v-text-field>
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
                <v-dialog v-model="dialogDelete" width="auto">
                    <v-card class="pa-2">
                        <v-card-title class="text-h5">¿Seguro que quieres eliminar al sujeto?</v-card-title>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="primary" variant="text" @click="closeDelete">Cancelar</v-btn>
                            <v-btn color="primary" variant="text" @click="deletePlayerConfirm">OK</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <!-- DIALOG PARA CARGAR SUJETOS CON ARCHIVO DE EXCEL -->
                <v-dialog v-model="dialogFile" width="auto" >
                    <v-card class="pa-4">
                        <v-card-title class="text-h5">Agregar sujetos con archivo</v-card-title>
                        <v-card-subtitle class="mb-7">Sube el archivo de Excel con los correos de los sujetos. Ordenalos por fila (uno debajo de otro) como se muestra en la imagen</v-card-subtitle>
                        <v-row>
                            <v-col cols="5">
                                <v-img :src="excelInstructions" alt="Excel Instructions" style="margin-left: auto; margin-right: auto; width: 60%;"></v-img>
                            </v-col>
                            <v-col class=" d-flex align-center" cols="7">
                                <v-file-input
                                color="primary"
                                class="mx-5"
                                clearable
                                accept=".xls, .xlsx"
                                label="clic para subir el archivo"
                                variant="outlined"
                                prepend-icon="mdi-microsoft-excel"
                                v-model="fileInput"
                                @change="handleFileUpload"
                                ></v-file-input>
                            </v-col>
                        </v-row>

                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="primary" variant="text" @click="closeFile">Cancelar</v-btn>
                            <v-btn color="primary" variant="text" @click="saveEmails">OK</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-toolbar>
        </template>
        <template v-slot:item.actions="{ item }">
            <v-container v-if="!enabledCheckbox" class="text-center">
                <!-- <v-icon size="small" class="me-2" @click="editPlayer(item.raw)">mdi-pencil</v-icon> -->
                <!-- <v-icon size="small" class="me-2" @click="deletePlayer(item.raw, item.index)">mdi-delete</v-icon> -->
                <v-tooltip location="bottom center" origin="auto">
                    <template v-slot:activator="{ props }">
                        <v-btn v-bind="props" variant="flat" density="comfortable" class="me-2" icon="mdi-pencil"
                            size="small" @click="editPlayer(item.raw)"><v-icon color="primary"></v-icon>
                        </v-btn>
                    </template>
                    <span>Editar sujeto</span>
                </v-tooltip>
                <v-tooltip location="bottom center" origin="auto">
                    <template v-slot:activator="{ props }">
                        <v-btn v-bind="props" variant="flat" density="comfortable" class="me-2" icon="mdi-delete"
                            size="small" @click="deletePlayer(item.raw, item.index)"><v-icon
                                color="primary"></v-icon></v-btn>
                    </template>
                    <span>Eliminar sujeto</span>
                </v-tooltip>
                <!-- <v-checkbox :label="item.raw.id" value="John"></v-checkbox> -->
                <v-btn :to="{
                    name: 'ResultView',
                    params: { id: item.raw._id },
                }" density="comfortable" class="text-none" prepend-icon="mdi-archive-search" variant="flat">
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
import { ref, watch, computed, onMounted, nextTick } from 'vue';
import { read, utils } from 'xlsx';
import excelInstructions from '@/assets/images/excelInstructions.png';

const playerStore = usePlayers();
const roomStore = useRooms();

const formFunc = ref(null);

const props = defineProps({
    enabledCheckbox: Boolean,
    roomNumber: String,
});

const emit = defineEmits(['close'])

const selected = ref([]);

async function addPlayersToRoom() {
    await roomStore.addPlayersToRoom(props.roomNumber, selected.value).then(emit('close'));
}

onMounted(async () => {
    await playerStore.listPlayers();
});

const dialog = ref(false);
const dialogDelete = ref(false);
const dialogFile = ref(false);
const fileInput = ref(null);
const fileEmails = ref([]);

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
});

watch(dialogFile, (val) => {
    if (!val) {
        closeFile();
    }
});

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

const closeFile = () => {
    dialogFile.value = false;
    nextTick(() => {
        fileInput.value = null;
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
        close();
    }
};

const handleFileUpload = async () => {
    const file = fileInput.value[0];
    if (file) {
        const ab = await readFileAsArrayBuffer(file);
        const wb = read(ab);
        fileEmails.value = utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 1 });
        //Limpiar los correos vacios
        fileEmails.value = fileEmails.value.filter((row) => row.length > 0);
    }
};

async function readFileAsArrayBuffer(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target.result);
    };
    reader.readAsArrayBuffer(file);
  });
}

const saveEmails = async () => {
    if(fileInput.value){
        //Once the file is Uploaded and the user press the Ok buttom insert in database
        await playerStore.createPlayersByFile(fileEmails.value).catch(e => console.error(e));
        closeFile();
    }
};

const loadFileDialog = () => {
    dialogFile.value = true;
};


const nameRules = [
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
    if(!v){
        return true;
    } else {
        return /^\d{10}$/.test(v) || 'Ingrese un número de teléfono válido';
    }
}];

const ageRules = [
(v) => {
    if(!v){
        return true;
    } else {
       return (v >= 1 && v <= 140) ? true : 'Ingrese una edad válida';
    }
}];
</script>
