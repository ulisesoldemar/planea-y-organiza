<template>
    <div :style="welcome" class="welcome">
        <v-container fluid>
            <v-row justify="end" :style="logoStyle">
                <v-col cols="12" md="4" sm="6" xs="12">
                    <!-- <p class="text-center" style="color: white;">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p> -->
                    <!-- <div class="text-center">
                        <router-link to="/login">
                            <v-btn color="tertiary" variant="outlined" class="ma-4 elevation-1">Iniciar sesión</v-btn>
                        </router-link>
                        <router-link to="/welcome">
                            <v-btn color="tertiary" variant="outlined" class="ma-4 elevation-1">Registrarse</v-btn>
                        </router-link>
                    </div> -->
                <v-col class="text-center">
                    <v-img v-if="!xs" :src="logoWhite" alt="Logo" style="margin-left: auto; margin-right: auto; width: 80%;"></v-img>
                    <v-img v-if="xs"  :src="logo" alt="Logo" style="margin-left: auto; margin-right: auto; width: 80%;"></v-img>
                </v-col>
                    
                </v-col>
            </v-row>
            <v-row style="margin-top: -7%;" :style="textAlign">
                <v-col cols="12" md="5" sm="6" xs="12">
                    <p class="text-h3 font-weight-bold text-center" style="color: #39343E;">Planea y Organiza</p>
                </v-col>
                
            </v-row>
            <v-row justify="start"  align="center" :style="textAlign">
                <v-col cols="12" md="5" sm="6" xs="12">
                    <p class="text-center">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                </v-col>
                
            </v-row>
            <v-row justify="start" :style="textAlign">
                <v-col cols="12" md="5" sm="6" xs="12">
                    <div class="text-center">
                        <router-link to="/login">
                            <v-btn color="primary" class="ma-4">Inicia sesión</v-btn>
                        </router-link>
                        <router-link to="/welcome">
                            <v-btn color="primary" class="ma-4">Registrate</v-btn>
                        </router-link>
                    </div>
                </v-col>
            </v-row>
            
        </v-container>
    </div>
</template>
  
<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import logo from "@/assets/images/Logo.svg";
import logoWhite from "@/assets/images/Logo-White.svg";
import { useDisplay } from 'vuetify/lib/framework.mjs';

const redirectToRegistration = () => {
    const router = useRouter();
    router.push('/registro');
};

const redirectToLogin = () => {
    const router = useRouter();
    router.push('/inicio-sesion');
};

const { xs, mdAndUp, sm } = useDisplay()

const logoStyle = computed(() => ({
  margin: mdAndUp.value ? '5% 4% 0px 0px' : '8% 0px 13% 0px'
}));

const welcome = computed(() => ({
  backgroundPosition: xs.value ? 'left' : 'center', 
}));

const textAlign = computed(() => {
  const styles = {};

  if (mdAndUp.value) {
    styles.marginLeft = '7.5%';
    return styles;
  }

  if (sm.value) {
    styles.marginLeft = '4%';
    return styles;
  }

  styles.marginLeft = '0';
  styles.padding = '5px';
  return styles;
});

</script>
  
<style scoped>
.welcome {
    height: 100vh; 
    background: #f0f0f0 url('@/assets/images/Welcome-Banner.png') no-repeat fixed;
    background-size: cover;
}
</style>
  