<template>
  <div class="justify-center h-screen d-flex align-center" style="background-color: #f5f5f5">
    <div class="text-center">
      <v-card class="mb-5 pa-3 mx-auto elevation-4" width="500" max-width="500" height="550" max-height="550"
        v-for="(item, index) in historyList" :key="index">
        <v-card-title v-if="item.num != 7" class="text-right text-subtitle-1 font-weight-black">
          <v-avatar color="grey-lighten-1" density="compact">
            <div>{{ item.num }}</div>
          </v-avatar>
        </v-card-title>

        <transition name="slide">
          <!-- <video
            :src="item.video"
            class="video pb-3 mt-2"
            autoplay
            loop
          ></video> -->

          <v-img v-if="item.num != 7" :src="item.video" class="video pb-2 mt-1" height="350"></v-img>
        </transition>

        <v-card-text class="mt-4">
          <pre class="text-subtitle-1">{{ item.title }}</pre>
        </v-card-text>


        <v-card-text class="mt-15" v-if="item.num == 7">
          <p class="text-h6">
            <span class="font-weight-black"> ¿Estas listo para comenzar la fase de entrenamiento? </span> <br> Haz click
            en el siguiente boton
          </p>
        </v-card-text>

        <v-btn v-if="item.num == 7" icon="mdi-play" size="x-large" color="primary" class="mt-10" to="/game"></v-btn>
      </v-card>

      <v-pagination color="primary" class="mb-2" v-model="page" :length="pages"
        @update:model-value="updatePage"></v-pagination>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
//import video1 from "@/assets/animations/Instrucciones-1.mp4";
// import video2 from "@/assets/animations/Instrucciones-2.mp4";
// import video3 from "@/assets/animations/Instrucciones-3.mp4";
// import video4 from "@/assets/animations/Instrucciones-4.mp4";
// import video5 from "@/assets/animations/Instrucciones-5.mp4";
// import video6 from "@/assets/animations/Instrucciones-6.mp4";
import video1 from "@/assets/animations/Instrucciones-1.gif";
import video2 from "@/assets/animations/Instrucciones-2.gif";
import video3 from "@/assets/animations/Instrucciones-3.gif";
import video4 from "@/assets/animations/Instrucciones-4.gif";
import video5 from "@/assets/animations/Instrucciones-5.gif";
import video6 from "@/assets/animations/Instrucciones-6.gif";


const page = ref(1);
const pageSize = 1;
const list = [
  {
    num: 1,
    title: "Arrastra la pelota manteniendo el clic.",
    video: video1,
  },
  {
    num: 2,
    title: "Lleva la pelota hasta el canasto azul correspondiente.",
    video: video2,
  },
  {
    num: 3,
    title:
      "Puedes comenzar en la casilla que prefieras \ny cambiar de casilla cuando lo desees, aún si no has \nterminado de meter todas las pelotas.",
    video: video3,
  },
  {
    num: 4,
    title:
      "No es posible meter una pelota dentro de una \ncasilla diferente a la de su sección.",
    video: video4,
  },
  {
    num: 5,
    title:
      "Tendras una fase de entrenamiento. Esta inicia cuando escuches un sonido y \naparezca un circulo verde en la parte superior derecha.",
    video: video6,
  },
  {
    num: 6,
    title:
      "Esta fase de entrenamiento termina cuando escuches un sonido y \naparezca un circulo rojo en la parte superior derecha.",
    video: video5,
  },
  {
    num: 7,
    title: "",
    video: "",
  },
];

const listCount = ref(0);
const historyList = ref([]);

const initPage = () => {
  listCount.value = list.length;
  if (listCount.value < pageSize) {
    historyList.value = list;
  } else {
    historyList.value = list.slice(0, pageSize);
  }
};

const updatePage = (pageIndex) => {
  const _start = (pageIndex - 1) * pageSize;
  const _end = pageIndex * pageSize;
  historyList.value = list.slice(_start, _end);
  page.value = pageIndex;
};

const pages = computed(() => {
  if (pageSize == null || listCount.value == null) return 0;
  return Math.ceil(listCount.value / pageSize);
});

onMounted(() => {
  initPage();
  updatePage(page.value);
});
</script>

<style scoped>
/* Estilos específicos para este componente si es necesario */
</style>
