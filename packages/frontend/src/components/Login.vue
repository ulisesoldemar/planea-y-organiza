<template>
  <div>
    <v-card class="pb-8 mx-auto pa-12" elevation="8" max-width="448" rounded="lg">
      <div class="text-subtitle-1 text-medium-emphasis">Username</div>

      <!-- Vincular el campo de entrada del username a un modelo de datos -->
      <v-text-field v-model="username" density="compact" placeholder="Enter your username"
        prepend-inner-icon="mdi-account-key" variant="outlined"></v-text-field>

      <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
        Password

        <a class="text-caption text-decoration-none text-blue" href="#" rel="noopener noreferrer" target="_blank">
          Forgot login password?</a>
      </div>

      <!-- Vincular el campo de entrada del password a un modelo de datos -->
      <v-text-field v-model="password" :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
        :type="visible ? 'text' : 'password'" density="compact" placeholder="Enter your password"
        prepend-inner-icon="mdi-lock-outline" variant="outlined" @click:append-inner="visible = !visible"></v-text-field>

      <v-card class="mb-12" color="surface-variant" variant="tonal">
        <v-card-text class="text-medium-emphasis text-caption">
          Warning: After 3 consecutive failed login attempts, you account will be temporarily locked for three hours. If
          you must login now, you can also click "Forgot login password?" below to reset the login password.
        </v-card-text>
      </v-card>

      <!-- Agregar el evento click para iniciar el proceso de login -->
      <v-btn block class="mb-8" color="blue" size="large" variant="tonal" @click="login">
        Log In
      </v-btn>

      <v-card-text class="text-center">
        <a class="text-blue text-decoration-none" href="#" rel="noopener noreferrer" target="_blank">
          Sign up now <v-icon icon="mdi-chevron-right"></v-icon>
        </a>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import api from '@/utils/api';

export default {
  data() {
    return {
      username: '',
      password: '',
      visible: false,
    };
  },
  methods: {
    async login() {
      try {
        // Realizar la solicitud de inicio de sesión al backend
        const response = await api.post('/admin/login', {
          username: this.username,
          password: this.password,
        });

        // Manejar la respuesta del backend
        const { data } = response;
        const adminToken = data.token;

        // Aquí puedes realizar acciones adicionales después del inicio de sesión exitoso, como redirigir al dashboard
        console.log('Admin token:', adminToken);
      } catch (error) {
        // Manejar los errores del backend
        console.error('Error en el inicio de sesión:', error.response.data.message);
      }
    },
  },
};
</script>