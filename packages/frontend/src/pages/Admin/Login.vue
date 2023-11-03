<template>
  <div class="justify-center h-screen d-flex align-center" style="background-color: #f5f5f5;">
    <v-card class="pb-6 px-12 pb-12 pt-8 mx-5" elevation="8" width="448" max-width="448" rounded="lg" >
      <v-img :src="logo" alt="Logo"  class="mb-6 pa-4" style="display: block;
        margin-left: auto;
        margin-right: auto;
        width: 40%;"
      ></v-img>

      <v-form v-model="formFunction" @submit.prevent="">
        <div class="text-subtitle-1 text-medium-emphasis">Nombre de usuario o correo</div>
        <v-text-field color="primary" v-model="formData.identifier" placeholder="Nombre o correo" prepend-inner-icon="mdi-account-key"
          variant="outlined" :rules="identifierRules"></v-text-field>

        <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
          Contraseña
        </div>

        <v-text-field  color="primary" v-model="formData.password" :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
          :type="visible ? 'text' : 'password'" placeholder="Ingresa tu contraseña" prepend-inner-icon="mdi-lock-outline"
          variant="outlined" @click:append-inner="visible = !visible" :rules="passwordRules"
          @keyup.enter="handleLogin"></v-text-field>

        <p v-if="errorMessage" class="text-center text-red">{{ errorMessage }}</p>
        <v-btn block class="mt-5 mb-6" color="primary" size="large" variant="elevated" @click="handleLogin"
          :disabled="!formFunction" :loading="loading">
          Ingresar
        </v-btn>

        <!-- <v-card-text class="text-center">
          <a class="text-decoration-none" href="#" rel="noopener noreferrer" target="_blank">
            Olvidé mi contraseña <v-icon icon="mdi-chevron-right"></v-icon>
          </a>
        </v-card-text> -->
      </v-form>
    </v-card>
  </div>
</template>

<script setup>
import { useTheme } from "vuetify";
import { useAdmins } from "@/stores/admin";
import { ref } from "vue";
// import logo from "@/assets/images/Logo.svg";
import logo from "@/assets/images/Logo-Sail.svg";
import { computed } from "vue";

const formFunction = ref(false);
const loading = ref(false);

const formData = ref({
  identifier: "",
  password: "",
});

const visible = ref(false);

const theme = useTheme();

computed(() => {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark';
});

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
  loading.value = true;
  const adminStore = useAdmins();
  errorMessage.value = "";
 
  setTimeout(async() => {
    try {
        await adminStore.login(formData.value, errorMessage.value);
        loading.value = false;
      // Login successful, redirect or perform necessary actions
    } catch (error) {
      errorMessage.value = error.message;
      loading.value = false;
    }
  }, 400);
}

</script>
