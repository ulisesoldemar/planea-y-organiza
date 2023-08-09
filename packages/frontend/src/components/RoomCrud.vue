<template>
    <v-container>
        <v-card>
            <v-card-title class="headline">Crear Sala</v-card-title>
            <v-card-text>
                <v-form ref="form" @submit.prevent="createRoom">
                    <v-text-field v-model="formData.roomNumber" label="Número de Sala"></v-text-field>
                    <v-date-picker v-model="formData.expiration" label="Fecha de caducidad"></v-date-picker>
                    <v-btn type="submit" color="primary">Crear Sala</v-btn>
                </v-form>
            </v-card-text>
        </v-card>
    </v-container>
</template>
  
<script>
import { useAdmins } from '@/stores/admin';
export default {
    data() {
        return {
            formData: {
                roomNumber: '',
                expiration: null,
            }
        };
    },
    methods: {
        createRoom() {
            // Llama al método logout del store userStore
            const adminStore = useAdmins();
            adminStore.createRoom(this.formData);
        },
    },
};
</script>
  