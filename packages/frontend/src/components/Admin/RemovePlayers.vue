<template>
    <v-data-table :headers="headers" :items="players" :items-length="players.length"
        :sort-by="[{ key: 'addedAt', order: 'asc' }]" class="pb-3 rounded elevation-1">
        <template v-slot:top>
            <v-toolbar class="rounded" flat>
                <v-toolbar-title>Eliminar jugadores</v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-spacer></v-spacer>
                <v-btn color="error" text @click="removePlayers" :disabled="selected.length === 0">
                    <v-icon>mdi-delete</v-icon>
                    <span class="hidden-sm-and-down">Eliminar</span>
                </v-btn>
            </v-toolbar>
        </template>
        <template v-slot:item.actions="{ item }">
            <v-container>
                <v-checkbox v-model="selected" :value="item.raw._id"
                    @click:append="selected.push(item.raw._id)"></v-checkbox>
            </v-container>
        </template>
    </v-data-table>
</template>

<script setup>
import { useRooms } from '@/stores/rooms';
import { ref, computed, onMounted } from 'vue';

const roomStore = useRooms();

const props = defineProps({
    roomNumber: {
        type: String,
        required: true
    }
});

const emit = defineEmits(['close']);

onMounted(() => {
    roomStore.fetchRoomPlayers(props.roomNumber);
});

const players = computed(() => roomStore.currentPlayers);
const selected = ref([]);

const headers = [
    { title: 'Nombre(s)', align: 'start', key: 'firstName' },
    { title: 'Primer apellido', key: 'surName' },
    { title: 'Segundo apellido', key: 'secondSurName' },
    { title: 'Email', key: 'email' },
    { title: 'Teléfono', key: 'phone' },
    { title: 'Edad', key: 'age' },
    { title: 'Agregado el', key: 'addedAt' },
    { title: 'Eliminar', key: 'actions', align: 'center' },
];

async function removePlayers() {
    await roomStore.removePlayersFromRoom(props.roomNumber, selected.value);
    emit('close');
}

</script>