<template>
  <div class="justify-center h-screen d-flex align-center">
    <v-card class="pb-8 mx-auto pa-12" elevation="8" width="448" max-width="448" rounded="lg">
      <div class="text-subtitle-1 text-medium-emphasis">Nombre de usuario o correo</div>
      <v-text-field v-model="formData.identifier" density="compact" placeholder="Nombre o correo"
        prepend-inner-icon="mdi-account-key" variant="outlined" :rules="identifierRules"></v-text-field>

      <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
        Contraseña
      </div>

      <v-text-field v-model="formData.password" :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
        :type="visible ? 'text' : 'password'" density="compact" placeholder="Ingresa tu contraseña"
        prepend-inner-icon="mdi-lock-outline" variant="outlined" @click:append-inner="visible = !visible"
        :rules="passwordRules" @keyup.enter="handleLogin"></v-text-field>

      <p v-if="errorMessage" class="text-center text-red">{{ errorMessage }}</p>
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

<script setup>
import { useAdmins } from "@/stores/admin";
import { ref } from "vue";

const formData = ref({
  identifier: "",
  password: "",
});

const visible = ref(false);

const identifierRules = [
  value => !!value || 'El nombre de usuario o correo es requerido',
  value => (value && value.length <= 50) || 'El nombre de usuario o correo debe tener menos de 50 caracteres'
];

const passwordRules = [
  value => !!value || 'La contraseña es requerida',
  // value => (value && value.length >= 8) || 'La contraseña debe tener al menos 8 caracteres'
];

const errorMessage = ref(""); // Initialize error message as empty

async function handleLogin() {
  const adminStore = useAdmins();

  try {
    await adminStore.login(formData.value, errorMessage.value);
    // Login successful, redirect or perform necessary actions
  } catch (error) {
    errorMessage.value = error.message;
  }
}
</script>
