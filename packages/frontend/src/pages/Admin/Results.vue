<template>
    <AdminLayout>
        <v-data-table :headers="headers" :items="scores" :sort-by="[{ key: 'date', order: 'asc' }]"
        :items-length="scores.length" class="pb-3 rounded elevation-1">
        <template v-slot:top>
            <v-toolbar flat class="rounded-t">
                <v-toolbar-title>Resultados</v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-spacer></v-spacer>
                <v-dialog v-model="dialogDelete" max-width="650px">
                    <v-card class="pa-4">
                        <v-card-title class="text-h5">¿Seguro que quieres eliminar el resultado?</v-card-title>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="primary" variant="text" @click="closeDelete">Cancelar</v-btn>
                            <v-btn color="primary" variant="text" @click="deleteScoreConfirm">OK</v-btn>
                            <v-spacer></v-spacer>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-toolbar>
        </template>
        <template v-slot:item.actions="{ item }">
            <v-container>
                <v-icon size="small" class="me-2" @click="deleteScore(item.raw, item.index)">mdi-delete</v-icon>
            </v-container>
        </template>
    </v-data-table>
    </AdminLayout>



</template>

<script setup>
import AdminLayout from '@/layouts/AdminLayout.vue';
import { useScores } from '@/stores/scores';
import { ref, watch, computed, onMounted, nextTick } from 'vue';

const scoreStore = useScores();
const scores = computed(() => scoreStore.scores);
const dialog = ref(false);
const dialogDelete = ref(false);

onMounted(async () => {
    scoreStore.listResults();
});

const headers = [
    { title: 'Fecha', align: 'start', key: 'date' },
    { title: 'Tiempo', key: 'time' },
    { title: 'Distancia total', key: 'distance' },
    { title: 'Distancia por seccion', key: 'distancePerSection' },
    { title: 'Puntuacion', key: 'score' },
    { title: 'Acciones', key: 'actions' },
];


const editedIndex = ref(-1);
const editedScore = ref({
    id: null,
    firstName: '',
    surName: '',
    secondSurName: '',
    email: '',
    username: '',
    password: ''
});

const defaultScore = {
    id: null,
    firstName: '',
    surName: '',
    secondSurName: '',
    email: '',
    username: '',
    password: ''
};

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

const deleteScore = (score) => {
    editedIndex.value = scores.value.indexOf(score);
    editedScore.value = { ...score };
    dialogDelete.value = true;
};

const deleteScoreConfirm = async () => {
    //await scoreUsrStore.deletescoreUser(editedscore.value._id);
    //scores.value.splice(editedIndex.value, 1);
    closeDelete();
};

const close = () => {
    dialog.value = false;
    nextTick(() => {
        editedScore.value = { ...defaultScore };
        editedIndex.value = -1;
    });
};

const closeDelete = () => {
    dialogDelete.value = false;
    nextTick(() => {
        editedScore.value = { ...defaultScore };
        editedIndex.value = -1;
    });
};

</script>