<template>
    <AdminLayout title="Salas">
        <v-row dense>
            <v-col cols="12" sm="6" md="4" lg="3" v-for="(task, index) in tasks" :key="123">
                <v-card preppend>
                    <div class="text-center">
                        <v-btn :to="{
                                name: 'taskView',
                                params: { id: 123 }
                            }"
                            variant="text"
                            color="primary"
                            class="ma-2"
                            prepend-icon="mdi-cog-outline"
                            density="comfortable"
                            size="large"
                        >
                        Ver configuracion de Tarea
                        </v-btn>
                    </div>
                    <v-divider></v-divider>

                    <v-card-actions>
                        <v-card-title>Tarea 1</v-card-title>
                        <v-spacer></v-spacer>

                        <!-- <v-tooltip location="bottom center" origin="auto">
                            <template v-slot:activator="{ props }">
                                <v-btn v-bind="props" size="small" color="surface-variant" variant="text" icon="mdi-pencil"
                                    @click="edittask(task, index)"></v-btn>
                            </template>
                            <span>Editar Tarea</span>
                        </v-tooltip> -->

                        <v-tooltip location="bottom center" origin="auto">
                            <template v-slot:activator="{ props }">
                                <v-btn v-bind="props" size="small" color="surface-variant" variant="text" icon="mdi-delete"
                                    @click="deleteTask(task, index)" :disabled="task.status === 'Running'"></v-btn>
                            </template>
                            <span>Eliminar Tarea</span>
                        </v-tooltip>
                    </v-card-actions>
                </v-card>
            </v-col>
            <v-col cols="12" sm="6" md="4" lg="3">
                <v-card class="d-flex flex-column align-center" height="117" @click="createTask()">
                    <v-row align="center" justify="center">
                        <v-icon color="grey
                        " icon="mdi-plus-circle-outline" size="64"></v-icon>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>

        <v-dialog v-model="deleteDialog" width="auto">
            <v-card class="pa-3">
                <v-card-title class="text-h5">¿Estás seguro de eliminar esta configuracion de tarea?</v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" variant="text" @click="closeDelete">Cancelar</v-btn>
                    <v-btn color="primary" variant="text" @click="deleteTaskConfirm">OK</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </AdminLayout>
</template>

<script setup>
import AdminLayout from '@/layouts/AdminLayout.vue';
import { useRouter } from 'vue-router';
import { ref, watch, computed, onMounted, nextTick } from 'vue';
import { useTasks } from '@/stores/tasks';

const router = useRouter();
const taskStore = useTasks();

onMounted(async () => {
    //await taskStore.listTasks();
});


const taskDialog = ref(false);
const deleteDialog = ref(false);

const tasks = computed(() => taskStore.tasks);

watch(taskDialog, (val) => {
    if (!val) {
        close();
    }
});

watch(deleteDialog, (val) => {
    if (!val) {
        closeDelete();
    }
});

function createTask() {
    router.push({ name: 'taskView', params: { id: -1} });
}

async function deleteTask(task, index) {
    editedTask.value = { ...task };
    deleteDialog.value = true;
}

async function deleteTaskConfirm() {
    await taskStore.deletTask(editedTask.value.taskNumber);
    closeDelete();
}

const close = () => {
    taskDialog.value = false;
    nextTick(() => {
        editedTask.value = { ...defaultTask };
    });
};

function closeDelete() {
    deleteDialog.value = false;
    nextTick(() => {
        editedTask.value = { ...defaultTask };
    });
}


</script>

<style scoped>
.align-center {
    align-items: center;
}
</style>
