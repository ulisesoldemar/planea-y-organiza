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
                                    <div class="text-subtitle-1" v-for="distance in currentResult.distancePerSection">
                                        {{ distance }}
                                    </div>
                                    <div class="text-subtitle-1" style="font-weight: bold">Total: {{ currentResult.distance
                                    }}</div>
                                </div>

                                <v-divider class="my-5"></v-divider>

                                <div class="text-center">
                                    <v-icon size="x-large" color="primary" icon="mdi-tennis-ball"></v-icon>
                                    <div class="text-h6 title-data">
                                        Pelotas ingresadas
                                    </div>
                                    <div class="text-subtitle-1" v-for="(coords, index) in currentResult.patterns">
                                        Sección {{ index + 1 }}: {{ coords.length }}
                                    </div>
                                    <div class="text-subtitle-1" style="font-weight: bold">Total: {{
                                        currentResult.enteredBalls }}</div>
                                </div>

                                <v-divider class="my-5"></v-divider>

                                <div class="text-center">
                                    <v-icon size="x-large" color="primary" icon="mdi-arrow-right"></v-icon>
                                    <div class="text-h6 title-data">
                                        Transiciones
                                    </div>
                                    <div class="text-subtitle-1" v-for="transition in currentResult.transitions">
                                        {{ transition.from + 1 }} <v-icon>mdi-arrow-right-thin</v-icon> {{ transition.to +
                                            1 }}
                                    </div>
                                </div>

                                <v-divider class="my-5"></v-divider>

                                <div class="text-center">
                                    <v-icon size="x-large" color="primary" icon="mdi-star-circle"></v-icon>
                                    <div class="text-h6 title-data">
                                        Puntaje
                                    </div>
                                    <div class="text-subtitle-1">{{ currentResult.score }}</div>
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-col>

                    <v-col class="ma-2">
                        <v-select label="Patrón" v-model="patternSelect" :items="['Por sección', 'Completo']"></v-select>
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
import PlayCoords from '@/game/assets/json/play_coords.json';

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
const patternSelect = ref('Por sección');

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

watch(heightScreen, async () => {
    cvHeight.value = heightScreen.value;
});

watch(currentResultId, (newId) => {
    if (newId) {
        currentResult.value = scores.value.find(score => score._id === newId); // Filtrar por el nuevo id
        drawPatterns();
    }
});

// Con este watch evito que se inicialice la referencia al canvas como null
watch(canvasRef, (val) => {
    if (val) {
        canvasRef.value = val;
        drawPatterns();
    }
});

watch(patternSelect, (val) => {
    if (val) {
        drawPatterns();
    }
});

function drawPatterns() {
    const canvas = canvasRef.value;
    if (!canvas) {
        console.log("No hay canvas");
        return;
    }

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Validar que existan los patrones
    const patterns = patternSelect.value === 'Completo' ? [currentResult.value.fullPattern] : currentResult.value.patterns;

    if (!patterns) {
        drawNoDataMessage(ctx, canvas);
        return;
    }

    ctx.lineWidth = 2;
    ctx.fillStyle = 'yellow';

    for (const pattern of patterns) {
        if (pattern.length === 0) continue;

        for (let j = 0; j < pattern.length - 1; j++) {
            const pointFrom = pattern[j];
            const pointTo = pattern[j + 1];

            drawLine(ctx, pointFrom, pointTo);
            drawPoint(ctx, pointFrom, j === 0);
        }

        drawPoint(ctx, pattern[pattern.length - 1]);
    }
    drawBlueSquares(ctx);
    updateCanvasImage(canvas);
}

function drawLine(ctx, from, to) {
    const sectionFrom = Math.floor(from.x / 256);
    const sectionTo = Math.floor(to.x / 256);

    ctx.strokeStyle = sectionFrom === sectionTo ? 'blue' : 'red';

    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
}

function drawPoint(ctx, point, isFirstPoint = false) {
    ctx.fillStyle = isFirstPoint ? '#6bb120' : 'yellow';
    ctx.beginPath();
    ctx.arc(point.x, point.y, 6, 0, Math.PI * 2);
    ctx.fill();
}

function drawBlueSquares(ctx) {
    ctx.fillStyle = 'rgb(0, 0, 255, 0.4)';
    const sections = PlayCoords.sections;

    for (let i = 0; i < sections.length; ++i) {
        const target = sections[i].target;
        ctx.fillRect(target.x + (i * 256) - 27, target.y - 27, 54, 54);
    }
}

function drawNoDataMessage(ctx, canvas) {
    ctx.font = "30px Arial";
    ctx.fillStyle = "red";
    ctx.textAlign = "center";
    ctx.fillText("Sin datos", canvas.width / 2, canvas.height / 2);
    updateCanvasImage(canvas);
}

function updateCanvasImage(canvas) {
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

  