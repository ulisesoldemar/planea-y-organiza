<template>
    <v-row justify="center">
        <v-dialog v-model="dialog" persistent width="auto">
            <template v-slot:activator="{ props }">
                <v-btn color="primary" v-bind="props">
                    Open Dialog
                </v-btn>
            </template>
            <v-card>
                <v-card-title class="text-h5">
                    ¿Sigues ahí?
                </v-card-title>
                <v-card-text>La sesión ha caducado.</v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green-darken-1" variant="text" @click="refreshSession">
                        Sigo aquí
                    </v-btn>
                    <v-btn color="green-darken-1" variant="text" @click="logout">
                        Cerrar sesión
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>
</template>
<script setup>
import { ref } from 'vue';
import { useAdmins } from '@/stores/admin';

const adminStore = useAdmins();
const dialog = ref(false);

async function refreshSession() {
    await adminStore.fetchNewAccessToken()
        .then(dialog.value = false)
        .catch((err) => {
            console.log(err);
        });
}

async function logout() {
    await adminStore.logout()
        .then(dialog.value = false);
}

</script>