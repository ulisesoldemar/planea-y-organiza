<template>
    <div :style="welcome" class="welcome">
        <v-container fluid>

            <div :style="logoStyle">
                <v-img v-if="!xs" :src="logoWhite" alt="Logo" style="position: absolute; right: 5%; top: 5%; width: 25%;"></v-img>
                <v-img v-else  :src="logo" alt="Logo" style="margin-left: auto; margin-right: auto; width: 75%;"></v-img>
            </div>
            <!-- <v-row justify="end" :style="logoStyle">
                <v-col cols="12" md="4" sm="6" xs="12">
                    
                </v-col>
            </v-row> -->
            <div>
                <v-row :style="textAlign">
                    <v-col cols="12" md="5" sm="6" xs="12" :style="centerText">
                        <p v-if="!xs" class="text-h3 font-weight-bold text-center" style="color: #39343E;">Play And Sail</p>
                        <p v-else class="text-h4 font-weight-bold text-center" style="color: #39343E;">Play And Sail</p>
                    </v-col>
                </v-row>
                <v-row justify="start" :style="textAlign">
                    <v-col cols="12" md="5" sm="6" xs="12" class="text-center">
                        <p>
                            Bienvenido a la plataforma la cual te ayudará a ofrecer una visión valiosa sobre las habilidades de las personas
                        </p>
                    </v-col>
                </v-row>
                <v-row justify="start" :style="textAlign">
                    <v-col cols="12" md="5" sm="6" xs="12" class="text-center">
                        <div>
                            <router-link to="/login">
                                <v-btn color="primary" class="ma-4">Inicia sesión</v-btn>
                            </router-link>
                            <router-link to="/join-room">
                                <v-btn color="primary" class="ma-4">Únete a una sala</v-btn>
                            </router-link>
                        </div>
                    </v-col>
                </v-row>
            </div>
            
        </v-container>
    </div>
</template>
  
<script setup>
import { computed, } from 'vue';
// import logo from "@/assets/images/Logo.svg";
// import logoWhite from "@/assets/images/Logo-White.svg";
import logo from "@/assets/images/Logo-Sail.svg";
import logoWhite from "@/assets/images/Logo-White-Sail.svg";
import { useDisplay } from 'vuetify/lib/framework.mjs';

const { xs, mdAndUp, sm } = useDisplay()

const logoStyle = computed(() => ({
  margin: mdAndUp.value ? '5% 5% 0px 0px' : '15% 0px 13% 0px',
}));

const welcome = computed(() => ({
  backgroundPosition: xs.value ? 'left' : 'center', 
}));

const centerText = computed(() => ({
  marginTop: mdAndUp.value ? '14%' : '12%', 
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

  styles.marginLeft = '0px';
  styles.marginRight = '0px';
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
  