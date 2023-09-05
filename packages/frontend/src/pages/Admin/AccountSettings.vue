<template>
    <AdminLayout title="AccountSettings">
        <v-row>
            <v-col cols="12">
                <v-card width="100%" class="pa-4 rounded elevation-2 mb-4">
                    <v-card-title class="mb-5">Configuración de Cuenta</v-card-title>
                    <v-card-text>
                        <v-form ref="formFunc" @submit.prevent="">
                            <v-row>
                                <v-col cols="12" sm="6" md="4">
                                    <v-text-field v-model="editedAdmin.firstName" label="Nombre" :rules="nameRules"></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6" md="4">
                                    <v-text-field v-model="editedAdmin.surName" :rules="nameRules"
                                        label="Primer apellido"></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6" md="4">
                                    <v-text-field v-model="editedAdmin.secondSurName" :rules="SecSurnameRules"
                                        label="Segundo apellido"></v-text-field>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12" sm="6" md="6">
                                    <v-text-field v-model="editedAdmin.email" :rules="emailRules"
                                        label="Correo electrónico"></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6" md="6">
                                    <v-text-field v-model="editedAdmin.username" :rules="usernameRules"
                                        label="Nombre de usuario"></v-text-field>
                                </v-col>
                            </v-row>

                        </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn color="primary" @click="save" variant="elevated" :loading="loading">Guardar Cambios</v-btn>
                        <v-btn color="primary" @click="resset" variant="tonal">Limpiar</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>

            <v-col cols="6" sm="12" md="6">
                <v-card width="100%" class="pa-4 rounded elevation-2">
                    <v-card-title class="mb-4">Configuración de icono</v-card-title>
                    <v-card-text>
                        <v-form>
                            <v-row class="text-center">
                                <v-col cols="12" sm="12" md="12">
                                    <v-avatar :color="bkColor" size="90">
                                        <span class="text-h3" :style="{color : textColor}">{{ adminStore.initials }}</span>
                                    </v-avatar>
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn class="mt-3" color="primary" variant="elevated" @click="colorDialog = true">Cambiar color</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>

            <v-dialog v-model="colorDialog" width="auto">
                <v-card class="pa-2">
                    <v-card-title class="mb-5">
                        Elige un color
                    </v-card-title>
                    <v-color-picker v-model="changedColor" hide-inputs show-swatches class="mb-8" style="margin-left: 90px; margin-right: 90px;"></v-color-picker>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue-darken-1" variant="text" @click="colorDialog = false">
                            Cerrar
                        </v-btn>
                        <v-btn color="blue-darken-1" variant="text" @click="saveColor">
                            Guardar
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>

            <v-col cols="6" sm="12" md="6">
                <v-card width="100%" class="pa-4 rounded elevation-2">
                    <v-card-title class="mb-4">Cambiar contraseña</v-card-title>
                    <v-card-text>
                        <v-form ref="formPass" @submit.prevent="">
                            <v-row class="text-center">
                                <v-col cols="12" sm="12" md="12">
                                    <v-text-field class="mt-3" label="Nueva contraseña" v-model="password"
                                    :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" 
                                    :type="visible ? 'text' : 'password'"
                                    @click:append-inner="visible = !visible"
                                    :rules="passwordRules"></v-text-field>
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn class="mt-3" color="primary" variant="elevated" @click="savePassword" :loading="loadingPassword">
                                        Guardar
                                    </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </AdminLayout>
</template>

<script setup>
import AdminLayout from '@/layouts/AdminLayout.vue';
import { useAdmins } from '@/stores/admin';
import { onMounted, ref } from 'vue';
import { watch } from 'vue';

const adminStore = useAdmins();
const colorDialog = ref(false);
const formFunc = ref(null);
const formPass = ref(null);
const changedColor = ref('');
const bkColor = ref(adminStore.avatar.bkColor);
const textColor =  ref(adminStore.avatar.textColor);
const password = ref('');
const visible = ref (false);
const loading = ref(false);
const loadingPassword = ref(false);


const editedAdmin = ref({
    id: null,
    firstName: '',
    surName: '',
    secondSurName: '',
    email: '',
    username: ''
});

const defaultAdmin = {
    id: null,
    firstName: '',
    surName: '',
    secondSurName: '',
    email: '',
    username: ''
};

onMounted(() => {
    editedAdmin.value = { ...adminStore.userData };
});

async function save() {
    loading.value = true;
    const { valid } = await formFunc.value.validate();

    setTimeout(async() => {    
        if (valid) {
            await adminStore.updateAdmin(editedAdmin.value);
        }
        loading.value = false;
    }, 500);

}

async function savePassword() {
    loadingPassword.value = true;
    const { valid } = await formPass.value.validate();

    setTimeout(async() => {    
        if (valid) {
            await adminStore.updatePassword(editedAdmin.value._id, password.value);
        }
        loadingPassword.value = false;
    }, 500);

}

async function saveColor() {
    //Cambiar el color del texto dependiendo del color de fondo
    textColor.value = isDarkColor(changedColor.value) ? '#262626' : '#F1F1F1';
    bkColor.value = changedColor.value;
    colorDialog.value = false;

    //Guardar el color en la base de datos
    await adminStore.updateColor(editedAdmin.value._id, { bkColor, textColor});

}

async function resset(){
    editedAdmin.value = { ...defaultAdmin };
}

const isDarkColor = (color) => {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128;
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

const usernameRules = [v => !!v || 'Este campo es obligatorio'];

const passwordRules = [
    v => !!v || 'Este campo es obligatorio',
    v => (v && v.length >= 6) || 'Ingrese al menos 6 caracteres',
];

// watch(changedColor, () => {
//     textColor.value = isDarkColor(bkColor.value) ? '#262626' : '#F1F1F1';
// });
</script>
