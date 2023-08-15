<template>
  <div class="h-screen d-flex justify-center align-center">
    <v-card class="pb-8 mx-auto pa-12" elevation="8" width="448" max-width="448" rounded="lg">
      <div class="text-subtitle-1 text-medium-emphasis">Nombre de usuario o correo</div>
      <v-text-field v-model="form.identifier" density="compact" placeholder="Nombre o correo"
        prepend-inner-icon="mdi-account-key" variant="outlined"></v-text-field>

      <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
        Contraseña
        <!-- <a class="text-caption text-decoration-none text-blue" href="#" rel="noopener noreferrer" target="_blank">
          Forgot login password?</a> -->
      </div>

      <v-text-field v-model="form.password" :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
        :type="visible ? 'text' : 'password'" density="compact" placeholder="Ingresa tu contraseña"
        prepend-inner-icon="mdi-lock-outline" variant="outlined" @click:append-inner="visible = !visible"></v-text-field>

      <!-- Agregar el evento click para iniciar el proceso de login -->
      <v-btn block class="mb-8" color="blue" size="large" variant="tonal" @click="handleLogin">
        Ingresar
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
import { useAdmins } from "@/stores/admin";

export default {
  data() {
    return {
      form: {
        identifier: "",
        password: "",
      },
      visible: false,
    };
  },
  methods: {
    async handleLogin() {
      // Acceder a la instancia del store
      const adminStore = useAdmins();

      try {
        // Llamar a la acción de inicio de sesión del store
        await adminStore.login(this.form);

      } catch (error) {
        // Manejar los errores del inicio de sesión
        console.error("Error en el inicio de sesión:", error);
      }
    },
  },
};
</script>
