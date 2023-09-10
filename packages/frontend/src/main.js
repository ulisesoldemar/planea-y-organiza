import { createApp, markRaw } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

const pinia = createPinia();

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as labsComponents from 'vuetify/labs/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css' // Iconos

const vuetify = createVuetify({
  components: {
    ...components,
    ...labsComponents,
  },
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: 'myCustomTheme',
    themes: {
      myCustomTheme: {
        dark: false,
        colors: {
          primary: '#6634C3', // Color principal
          secondary: '#5E4B99', // Color secundario
          accent: '#e91e63', // Color de acento
          success: '#56CA00',
          info: '#16B1FF',
          warning: '#FFB400',
        },
      },
    },
  },
})

const app = createApp(App)

app.use(
  pinia.use(({ store }) => {
    store.router = markRaw(router)
  }),
)
app.use(router)
app.use(vuetify)
app.mount('#app')
