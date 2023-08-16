<template>
    <v-data-table :headers="headers" :items="users" :sort-by="[{ key: 'age', order: 'asc' }]" class="elevation-1">
        <template v-slot:top>
            <v-toolbar flat>
                <v-toolbar-title>Sujetos</v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-spacer></v-spacer>
                <v-dialog v-model="dialog" max-width="500px">
                    <template v-slot:activator="{ props }">
                        <v-btn color="primary" dark class="mb-2" v-bind="props">
                            Agregar sujeto
                        </v-btn>
                    </template>
                    <v-card>
                        <v-card-title>
                            <span class="text-h5">{{ formTitle }}</span>
                        </v-card-title>

                        <v-card-text>
                            <v-container>
                                <v-row>
                                    <v-col cols="12" sm="6" md="4">
                                        <v-text-field v-model="editedUser.firstName" label="Nombre(s)"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="4">
                                        <v-text-field v-model="editedUser.surName" label="Primer apellido"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="4">
                                        <v-text-field v-model="editedUser.secondSurName"
                                            label="Segundo apellido"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="4">
                                        <v-text-field v-model="editedUser.email" label="Email"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="4">
                                        <v-text-field v-model="editedUser.phone" label="Teléfono"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="4">
                                        <v-text-field v-model="editedUser.age" label="Edad"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="4">
                                        <v-text-field v-model="editedUser.uniqueAccessCode"
                                            label="Código de acceso único"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="4">
                                        <v-menu v-model="menu" :close-on-content-click="false" offset-y>
                                            <template v-slot:activator="{ on }">
                                                <v-text-field v-model="editedUser.accessCodeExpiration"
                                                    label="Caducidad" prepend-icon="mdi-calendar" readonly
                                                    v-on="on"></v-text-field>
                                            </template>
                                            <v-date-picker v-model="editedUser.accessCodeExpiration" no-title scrollable>
                                                <v-spacer></v-spacer>
                                                <v-btn text color="primary" @click="menu = false">Cancelar</v-btn>
                                                <v-btn text color="primary" @click="menu = false; save">OK</v-btn>
                                            </v-date-picker>
                                        </v-menu>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-card-text>

                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue-darken-1" variant="text" @click=" close ">Cancel</v-btn>
                            <v-btn color="blue-darken-1" variant="text" @click=" save ">Save</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <v-dialog v-model=" dialogDelete " max-width="500px">
                    <v-card>
                        <v-card-title class="text-h5">Are you sure you want to delete this user?</v-card-title>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue-darken-1" variant="text" @click=" closeDelete ">Cancel</v-btn>
                            <v-btn color="blue-darken-1" variant="text" @click=" deleteUserConfirm ">OK</v-btn>
                            <v-spacer></v-spacer>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-toolbar>
        </template>
        <template v-slot:item.actions=" { item } ">
            <v-icon size="small" class="me-2" @click="editUser(item.raw)">mdi-pencil</v-icon>
            <v-icon size="small" @click="deleteUser(item.raw)">mdi-delete</v-icon>
        </template>
    </v-data-table>
</template>
  
<script setup>
import { ref, computed } from 'vue';
import { usePlayer } from '@/stores/player';

const playerStore = usePlayer();

const dialog = ref(false);
const dialogDelete = ref(false);
const menu = ref(false);
const headers = [
    { title: 'Nombre(s)', align: 'start', sortable: false, key: 'firstName' },
    { title: 'Primer apellido', key: 'surName' },
    { title: 'Segundo apellido', key: 'secondSurName' },
    { title: 'Email', key: 'email' },
    { title: 'Teléfono', key: 'phone' },
    { title: 'Edad', key: 'age' },
    { title: 'Código de acceso', key: 'uniqueAccessCode' },
    { title: 'Caducidad del código', key: 'accessCodeExpiration' },
    { title: 'Acciones', key: 'actions', sortable: false },
];

const users = ref([]);

const editedIndex = ref(-1);
const editedUser = ref({
    firstName: '',
    surName: '',
    secondSurName: '',
    email: '',
    phone: '',
    age: 0,
    uniqueAccessCode: '',
    accessCodeExpiration: null,
});
const defaultUser = {
    firstName: '',
    surName: '',
    secondSurName: '',
    email: '',
    phone: '',
    age: 0,
    uniqueAccessCode: '',
    accessCodeExpiration: null,
};

const formTitle = computed(() => {
    return editedIndex.value === -1 ? 'Nuevo Sujeto' : 'Editar Sujeto';
});

// Methods
const editUser = (user) => {
    editedIndex.value = users.value.indexOf(user);
    editedUser.value = { ...user };
    dialog.value = true;
};

const deleteUser = (user) => {
    editedIndex.value = users.value.indexOf(user);
    editedUser.value = { ...user };
    dialogDelete.value = true;
};

const deleteUserConfirm = () => {
    users.value.splice(editedIndex.value, 1);
    closeDelete();
};

const close = () => {
    dialog.value = false;
    menu.value = false;
    editedUser.value = { ...defaultUser };
    editedIndex.value = -1;
};

const closeDelete = () => {
    dialogDelete.value = false;
    editedUser.value = { ...defaultUser };
    editedIndex.value = -1;
};

const save = () => {
    if (editedIndex.value > -1) {
        Object.assign(users.value[editedIndex.value], editedUser.value);
    } else {
        users.value.push(editedUser.value);
    }
    close();
};
</script>
  