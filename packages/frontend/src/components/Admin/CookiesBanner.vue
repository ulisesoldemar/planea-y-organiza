<template>
  <div v-if="dialog" style="position: fixed; bottom: 40px; right: 40px; z-index: 1000;">
    <!-- <div class="flex-row-reverse d-flex"></div> -->
    <v-card width="700" class="px-2 pt-2 elevation-5">
      <v-banner avatar="https://cdn.vuetifyjs.com/docs/images/logos/v.svg" stacked>
        <template v-slot:text>
          P&O Usa cookies para habilitar and import the use of the website. utiliza cookies para habilitar e importar el
          uso del sitio web. Por favor, consulte nuestras
          <a href="https://www.iubenda.com/privacy-policy/76325752/cookie-policy" target="_blank">Politicas de
            Privacidad</a>
          para más información. Al hacer clic en "Aceptar cookies" o continuar utilizando el sitio, acepta el uso de
          cookies.
        </template>

        <template v-slot:actions>
          <v-dialog v-model="dialog" max-width="500" z-index="9999">
            <template v-slot:activator="{ props }">
              <v-btn class="text-none" color="blue-darken-4" variant="outlined" v-bind="props">
                Administrar Cookies
              </v-btn>
            </template>

            <v-card title="Cookie Settings">
              <v-card-text>
                <p class="pb-4">
                  Vuetify websites use cookies to deliver and improve the visitor experience. Learn more about the cookies
                  we use on our Cookie Policy page.
                </p>

                <v-list-subheader class="font-weight-black text-high-emphasis">Required Cookies</v-list-subheader>

                <p class="mb-4">These cookies are required for the site to function and cannot be turned off.</p>

                <v-list-subheader class="font-weight-black text-high-emphasis">Performance Cookies</v-list-subheader>

                <v-switch v-model="performance" :label="performance ? 'On' : 'Off'" color="blue-darken-4"
                  density="compact" hide-details inline inset></v-switch>

                <p class="mb-4">Counts website visits and clicks to understand where people most engage with links to make
                  the experience better.</p>

                <v-list-subheader class="font-weight-black text-high-emphasis">Advertising Cookies</v-list-subheader>

                <v-switch v-model="advertising" :label="advertising ? 'On' : 'Off'" color="blue-darken-4"
                  density="compact" hide-details inline inset></v-switch>

                <p class="mb-16">Set by our advertising partners, these cookies are used to build a profile of your
                  interests and show you relevant ads on other sites. They do not store personal information, but are
                  based on uniquely identifying your browser and internet device.</p>
              </v-card-text>

              <v-divider></v-divider>

              <v-card-actions class="justify-center px-6 py-3">
                <v-btn class="flex-grow-1 text-none" color="blue-darken-4" variant="plain" @click="dialog = false">
                  Rechazar
                </v-btn>

                <v-btn class="text-white flex-grow-1 text-none" color="blue-darken-4" variant="flat"
                  @click="dialog = false">
                  Guardar y Aceptar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-btn class="mb-2 text-white text-none ms-4" color="blue-darken-4" variant="flat">
            Aceptar Cookies
          </v-btn>
        </template>
      </v-banner>
    </v-card>
  </div>
</template>
  
<script setup>
import { ref } from 'vue';
const dialog = ref(true);
const advertising = ref(true);
const performance = ref(true);
</script>
  