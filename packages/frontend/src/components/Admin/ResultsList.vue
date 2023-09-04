<template>
    <v-data-table-server :headers="headers" :items="results" :sort-by="[{ key: 'firstName', order: 'asc' }]" 
        class="elevation-1 rounded pb-3">
        <template v-slot:top>
            <v-toolbar flat class="rounded">
                <v-toolbar-title>Resultados</v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-spacer></v-spacer>
                <v-dialog v-model="dialog" max-width="700px">
                    <v-card>
                        <v-card-title>
                            <span class="text-h5">{{ formTitle }}</span>
                        </v-card-title>

                        <v-card-text>
                            <v-container>
                                <v-row>
                                    <v-col cols="12" sm="6" md="4">
                                        <v-text-field v-model="seenResults.firstName" label="Nombre(s)"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="4">
                                        <v-text-field v-model="seenResults.surName" label="Primer apellido"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="4">
                                        <v-text-field v-model="seenResults.secondSurName" label="Segundo apellido"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="4">
                                        <v-text-field v-model="seenResults.email" label="Email"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="4">
                                        <v-text-field v-model="seenResults.results" label="Resultados"></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-card-text>

                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue-darken-1" variant="text" @click=" close ">Cancelar</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <v-dialog v-model=" dialogDelete " max-width="500px">
                    <v-card>
                        <v-card-title class="text-h5">Estas seguro de que deseas eliminar este resultado?</v-card-title>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue-darken-1" variant="text" @click=" closeDelete ">Cancelar</v-btn>
                            <v-btn color="blue-darken-1" variant="text" @click=" deleteUserConfirm ">OK</v-btn>
                            <v-spacer></v-spacer>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-toolbar>
        </template>
        <template v-slot:item.actions=" { item } ">
            <v-icon size="small" class="me-2" @click="showResults(item.raw)">mdi-eye</v-icon>
            <v-icon size="small" @click="deleteUser(item.raw)">mdi-delete</v-icon>
        </template>
    </v-data-table-server>
    
</template>
  
<script setup>
import { ref, computed} from 'vue';
//import { useResults } from '@/stores/player';
import AdminLayout from '@/layouts/AdminLayout.vue';

//const resultsStore = useResults();

import { useDisplay } from 'vuetify/lib/framework.mjs';


const dialog = ref(false);
const dialogDelete = ref(false);
const menu = ref(false);
const headers = [
    { title: 'Nombre(s)', align: 'start', key: 'firstName' },
    { title: 'Primer apellido', key: 'surName' },
    { title: 'Segundo apellido', key: 'secondSurName' },
    { title: 'Email', key: 'email' },
    { title: 'Resultados', key: 'results' },
    { title: 'Acciones', key: 'actions', sortable: false },
];

const results = ref([]);
const seenIndex = ref(0);

const seenResults = ref({
    firstName: '',
    surName: '',
    secondSurName: '',
    email: '',
    results: '',
});
const defaultResult = {
    firstName: '',
    surName: '',
    secondSurName: '',
    email: '',
    results: '',
};

// Methods
const showResults = (user) => {
    seenIndex.value = results.value.indexOf(user);
    seenResults.value = { ...user };
    dialog.value = true;
};

const deleteUser = (user) => {
    seenIndex.value = results.value.indexOf(user);
    seenResults.value = { ...user };
    dialogDelete.value = true;
};

const deleteUserConfirm = () => {
    results.value.splice(editedIndex.value, 1);
    closeDelete();
};

const close = () => {
    dialog.value = false;
    menu.value = false;
    seenResults.value = { ...defaultResult };
    editedIndex.value = -1;
};

const closeDelete = () => {
    dialogDelete.value = false;
    seenResults.value = { ...defaultResult };
    editedIndex.value = -1;
};

const { name } = useDisplay();

const widthScreen = computed(() => {
    // name is reactive and
    // must use .value
    switch (name.value) {
        case 'xs': return 300
        case 'sm': return 500
        case 'md': return 700
        case 'lg': return 800
        case 'xl': return 1000
        case 'xxl': return 1400
    }

    return undefined
});

</script>
  