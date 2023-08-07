<template>
    <v-sheet width="448" max-width="448" class="mx-auto">
        <v-form validate-on="submit lazy" @submit.prevent="submit">
            <v-text-field v-model="playerToken" :rules="rules" label="Token de acceso"></v-text-field>
            <v-btn :loading="loading" type="submit" block class="mt-2" text="Aceptar"></v-btn>
        </v-form>
    </v-sheet>
</template>

<script>
import api from '@/api';

export default {
    data() {
        return {
            playerToken: '',
            loading: false,
            rules: [v => !!v || 'El token de acceso es requerido'], // Validación del campo token
        };
    },
    methods: {
        async submit() {
            try {
                this.loading = true;
                // Realizar la solicitud para unirse a una sala al backend
                const response = await api.post('/player/join-room', {
                    token: this.playerToken,
                });

                // Manejar la respuesta del backend
                console.log('Jugador unido a la sala exitosamente');

                // Aquí puedes realizar acciones adicionales después de unirse a la sala
                // Por ejemplo, redirigir a una página específica para la sala de juego.
            } catch (error) {
                // Manejar los errores del backend
                console.error('Error al unirse a la sala:', error.response.data.message);
            } finally {
                this.loading = false;
            }
        },
    },
};
</script>