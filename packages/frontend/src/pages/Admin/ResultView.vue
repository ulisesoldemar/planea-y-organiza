<template>
    <AdminLayout>
        <v-overlay :model-value="loading" class="justify-center align-center">
            <v-progress-circular color="primary" indeterminate size="64"></v-progress-circular>
        </v-overlay>
        <v-card v-if="currentResult" width="100%">
            <v-card-title class="font-weight-bold">{{ scoreStore.playerName }}</v-card-title>
            <v-card-text>
                <v-row>
                    <v-col cols="12" md="3" sm="12">
                        <v-card class="my-2 ml-2">


                            <v-select color="primary" label="Busca por fecha de la prueba" v-model="currentResultId"
                                :items="scores" item-title="date" item-value="_id">
                            </v-select>


                            <v-card-text>

                                <div class="text-center">
                                    <v-icon size="x-large" color="primary" icon="mdi-clock-time-four"></v-icon>
                                    <div class="text-h6 title-data ">
                                        Tiempo
                                    </div>
                                    <div class="text-subtitle-1 ">{{ currentResult.time }} Segundos</div>
                                </div>

                                <v-divider class="my-5"></v-divider>

                                <div class="text-center">
                                    <v-icon size="x-large" color="primary" icon="mdi-map-marker-distance"></v-icon>
                                    <div class="text-h6 title-data">
                                        Distancia
                                    </div>
                                    <div class="text-subtitle-1">{{ currentResult.distance }} Puntos</div>
                                </div>

                                <v-divider class="my-5"></v-divider>

                                <div class="text-center">
                                    <v-icon size="x-large" color="primary" icon="mdi-tennis-ball"></v-icon>
                                    <div class="text-h6 title-data">
                                        Pelotas ingresadas
                                    </div>
                                    <div class="text-subtitle-1"> Sec 1 <v-icon>mdi-arrow-right-thin</v-icon> 37</div>
                                    <div class="text-subtitle-1"> Sec 2 <v-icon>mdi-arrow-right-thin</v-icon> 30</div>
                                    <div class="text-subtitle-1"> Sec 3 <v-icon>mdi-arrow-right-thin</v-icon> 15</div>
                                    <div class="text-subtitle-1"> Sec 4 <v-icon>mdi-arrow-right-thin</v-icon> 40</div>
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-col>

                    <v-col class="ma-2">
                        <v-divider v-if="cvHeight == 450" />
                        <canvas ref="canvasRef" width="1280" height="720"></canvas>
                        <v-card>
                            <img ref="canvasImage" alt="Canvas Image" class="w-100" :height="cvHeight" />
                        </v-card>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
        <v-card v-else>
            <v-card-text>Sin datos</v-card-text>
        </v-card>
    </AdminLayout>
</template>
  
<script setup>
import AdminLayout from '@/layouts/AdminLayout.vue';

import { useRoute, useRouter } from 'vue-router'
import { ref, watch, computed, onMounted, onBeforeUnmount } from 'vue';
import { useScores } from '@/stores/scores';
import { handleError } from 'vue';
import { useDisplay } from 'vuetify';

const route = useRoute();
const scoreStore = useScores();
const canvasRef = ref(null);
const canvasImage = ref(null);
const cvHeight = ref('');
const loading = computed(() => scoreStore.loading);
const currentResult = ref(null);
const currentResultId = ref(null);

const scores = computed(() => scoreStore.scores);
const { name } = useDisplay();


const heightScreen = computed(() => {

    console.log("name: ", name.value);

    switch (name.value) {
        case 'xs': return 210
        case 'sm': return 400
        case 'md': return 640
        case 'lg': return 740
        case 'xl': return 820
        case 'xxl': return 820
    }

    return undefined
});

onMounted(async () => {
    if (route.params.id) {
        scoreStore.fetchResult(route.params.id)
            .then((res) => {
                if (res.data.scores.length > 0) {
                    currentResultId.value = res.data.scores.slice(-1)[0]._id; // Asignar la ultima prueba como valor por defecto
                }
            })
            .catch((err) => {

            });

        cvHeight.value = heightScreen.value;
    }
});

watch(currentResultId, (newId) => {
    if (newId) {
        currentResult.value = scores.value.find(score => score._id === newId); // Filtrar por el nuevo id
        drawPatterns();
    }
});

watch(heightScreen, async () => {
    cvHeight.value = heightScreen.value;
});

// Con este watch evito que se inicialice la referencia al canvas como null
watch(canvasRef, (val) => {
    if (val) {
        canvasRef.value = val;
        drawPatterns();
    }
});

function drawPatterns() {
    if (!canvasRef.value) {
        console.log("No hay canvas");
        return;
    }

    const canvas = canvasRef.value;
    const ctx = canvas.getContext('2d');
    const patterns = currentResult.value.patterns;

    ctx.lineWidth = 2;
    ctx.strokeStyle = 'blue';
    ctx.fillStyle = 'yellow';
    for (let i = 0; i < patterns.length; ++i) {
        const points = patterns[i];
        if (points.length === 0) {
            continue;
        }
        // Dibuja líneas entre los puntos
        for (let j = 0; j < points.length - 1; ++j) {
            // Dibujar linea
            const x = points[j].x;
            ctx.beginPath();
            ctx.moveTo(x, points[j].y);
            ctx.lineTo(points[j + 1].x, points[j + 1].y);
            ctx.stroke();

            // Dibujar punto
            ctx.beginPath();
            if (j === 0) {
                ctx.fillStyle = 'red';
            } else {
                ctx.fillStyle = 'yellow';
            }
            ctx.arc(x, points[j].y, 6, 0, Math.PI * 2);
            ctx.fill();
        }

        // Dibujar último punto
        ctx.beginPath();
        ctx.arc(points[points.length - 1].x, points[points.length - 1].y, 6, 0, Math.PI * 2);
        ctx.fill();
    }
    // Convierte el canvas a una imagen y actualiza el src de la etiqueta <img>
    const canvasDataUrl = canvas.toDataURL('image/png');
    canvasImage.value.src = canvasDataUrl;
}

</script>

<style scoped>
/* Estilo para ocultar el canvas */
canvas {
    display: none;
}

.title-data {
    margin-bottom: 16px;
    color: #424242;
    font-weight: 700 !important;
}
</style>

  