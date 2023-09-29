<template>
    <v-data-table :headers="headers" :items="admins" :sort-by="[{ key: 'addedAt', order: 'asc' }]"
        :items-length="admins.length" class="pb-3 rounded elevation-1">
        <template v-slot:top>
            <v-toolbar flat class="rounded-t">
                <v-toolbar-title>Administradores</v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-spacer></v-spacer>
                <v-dialog v-model="dialog" max-width="900">
                    <template v-slot:activator="{ props }">
                        <v-btn color="primary" dark class="mr-5" v-bind="props" variant="outlined">
                            Agregar admin
                        </v-btn>
                    </template>
                    <v-card class="pa-3">
                        <v-form ref="formFunc" @submit.prevent="">
                            <v-card-title>
                                <span class="text-h5">{{ formTitle }}</span>
                            </v-card-title>

                            <v-card-text>
                                <v-container>
                                    <v-row>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field color="primary" v-model="editedAdmin.firstName" label="Nombre(s)"
                                                :rules="nameRules"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field color="primary" v-model="editedAdmin.surName" label="Primer apellido"
                                                :rules="nameRules"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field color="primary" v-model="editedAdmin.secondSurName" :rules="SecSurnameRules"
                                                label="Segundo apellido"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field color="primary" v-model="editedAdmin.email" label="Email"
                                                :rules="emailRules"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field color="primary" v-model="editedAdmin.username" label="Nombre de usuario"
                                                :rules="usernameRules"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field color="primary" v-model="editedAdmin.password" :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                                            :type="visible ? 'text' : 'password'" :label="passwordLabel"
                                            @click:append-inner="visible = !visible" :rules="passwordRules"
                                            ></v-text-field>
                                        </v-col>
                                    </v-row>

                                </v-container>
                                <p v-if="errorMsg">{{ errorMsg }}</p>
                            </v-card-text>

                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="primary" variant="text" @click="close">Cancelar</v-btn>
                                <v-btn color="primary" variant="text" @click="save">Aceptar</v-btn>
                            </v-card-actions>
                        </v-form>
                    </v-card>
                </v-dialog>
                <v-dialog v-model="dialogDelete" max-width="650px">
                    <v-card class="pa-4">
                        <v-card-title class="text-h5">¿Seguro que quieres eliminar al administrador?</v-card-title>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="primary" variant="text" @click="closeDelete">Cancelar</v-btn>
                            <v-btn color="primary" variant="text" @click="deleteAdminConfirm">OK</v-btn>
                            <v-spacer></v-spacer>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-toolbar>
        </template>
        <template v-slot:item.actions="{ item }">
            <v-container v-if="!enabledCheckbox">
                <v-icon size="small" class="me-2" @click="editAdmin(item.raw)">mdi-pencil</v-icon>
                <v-icon size="small" class="me-2" @click="deleteAdmin(item.raw, item.index)">mdi-delete</v-icon>
            </v-container>
            <v-container v-else>
                <v-checkbox v-model="selected" :value="item.raw._id"
                    @click:append="selected.push(item.raw._id)"></v-checkbox>
            </v-container>
        </template>
    </v-data-table>
</template>
  
<script setup>
import { useAdminUsers } from '@/stores/adminUsers';
import { ref, watch, computed, onMounted, nextTick } from 'vue';

const adminUsrStore = useAdminUsers();
const formFunc = ref(null);
const visible = ref(false);
const selected = ref([]);
const dialog = ref(false);
const dialogDelete = ref(false);
const errorMsg = ref('');

const props = defineProps({
    enabledCheckbox: Boolean,
    roomNumber: String,
});

onMounted(async () => {
    await adminUsrStore.listAdminUsers();
});

const headers = [
    { title: 'Nombre(s)', align: 'start', key: 'firstName' },
    { title: 'Primer apellido', key: 'surName' },
    { title: 'Segundo apellido', key: 'secondSurName' },
    { title: 'Email', key: 'email' },
    { title: 'Nombre de usuario', key: 'username' },
    { title: 'Acciones', key: 'actions' },
];

const admins = computed(() => adminUsrStore.adminUsers);

const editedIndex = ref(-1);
const editedAdmin = ref({
    id: null,
    firstName: '',
    surName: '',
    secondSurName: '',
    email: '',
    username: '',
    password: ''
});
const defaultAdmin = {
    id: null,
    firstName: '',
    surName: '',
    secondSurName: '',
    email: '',
    username: '',
    password: ''
};

const formTitle = computed(() => {
    return editedIndex.value === -1 ? 'Nuevo Administrador' : 'Editar Administrador';
});

const passwordLabel = computed(() => {
    return editedIndex.value === -1 ? 'Contraseña*' : 'Nueva contraseña (dejar en blanco para no cambiarla)'
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
const editAdmin = (admin) => {
    editedIndex.value = 1;
    editedAdmin.value = { ...admin };
    editedAdmin.value.password = '';
    dialog.value = true;
};

const deleteAdmin = (admin) => {
    editedIndex.value = admins.value.indexOf(admin);
    editedAdmin.value = { ...admin };
    dialogDelete.value = true;
};

const deleteAdminConfirm = async () => {
    await adminUsrStore.deleteAdminUser(editedAdmin.value._id);
    admins.value.splice(editedIndex.value, 1);
    closeDelete();
};

const close = () => {
    dialog.value = false;
    nextTick(() => {
        editedAdmin.value = { ...defaultAdmin };
        editedIndex.value = -1;
    });
};

const closeDelete = () => {
    dialogDelete.value = false;
    nextTick(() => {
        editedAdmin.value = { ...defaultAdmin };
        editedIndex.value = -1;
    });
};

const save = async () => {
    const { valid } = await formFunc.value.validate();
    if (valid) {
        try {

            if (editedIndex.value > -1) {
                await adminUsrStore.updateAdminUser(editedAdmin.value);
            } else {
                await adminUsrStore.createAdminUser(editedAdmin.value).catch(e => console.error(e));
            }
            await adminUsrStore.listAdminUsers();
            close();
        } catch (err) {
            errorMsg.value = err.message;
        }
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
    () => errorMsg.value.length === 0 || 'El correo ya esta en uso',
];

const usernameRules = [v => !!v || 'Este campo es obligatorio'];

const passwordRules = [
    (v) => {
        if (editedIndex.value > -1) {
            return (v.length >= 1 && v.length <= 6) ? 'La contraseña debe tener al menos 6 caracteres' : true;
        } else {
            return v ? (v.length >= 6 ? true : 'La contraseña debe tener al menos 6 caracteres') : 'Este campo es obligatorio';
        }
    },
];

</script>


  