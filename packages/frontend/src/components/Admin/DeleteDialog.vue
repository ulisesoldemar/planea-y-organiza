<template>
    <v-dialog v-model="dialog" max-width="500px">
        <v-card>
            <v-card-title class="text-h5">¿Seguro que quieres eliminarlo?</v-card-title>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue-darken-1" variant="text" @click="dialog = false">Cancelar</v-btn>
                <v-btn color="blue-darken-1" variant="text" @click="console.log('delete')">OK</v-btn>
                <v-spacer></v-spacer>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
    dialog: Boolean,
})

</script>