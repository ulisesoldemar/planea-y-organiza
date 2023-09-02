<template>
    <AdminLayout>
        <v-overlay :model-value="loading" class="align-center justify-center">
            <v-progress-circular color="primary" indeterminate size="64"></v-progress-circular>
        </v-overlay>
        <v-card v-if="currentResult">
            <v-card-title>{{ scoreStore.playerName }}</v-card-title>
            <v-card-actions>
                <v-col cols="2">
                    <v-select label="Fecha de la prueba" v-model="currentResultId" :items="scores" item-title="date"
                        item-value="_id">
                    </v-select>
                </v-col>
            </v-card-actions>
            <v-table fixed-header>
                <thead>
                    <tr>
                        <th class="text-left">
                            Tiempo
                        </th>
                        <th class="text-left">
                            Distancia
                        </th>
                        <th class="text-left">
                            Puntaje
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{{ currentResult.time }}</td>
                        <td>{{ currentResult.distance }}</td>
                        <td>{{ currentResult.score }}</td>
                    </tr>
                </tbody>
            </v-table>
            <v-divider></v-divider>
            <canvas ref="canvasRef" width="1280" height="720"></canvas>
        </v-card>
        <v-card v-else>
            <v-card-text>Sin datos</v-card-text>
        </v-card>
    </AdminLayout>
</template>
  
<script setup>
import AdminLayout from '@/layouts/AdminLayout.vue';

import { useRoute, useRouter } from 'vue-router'
import { ref, watch, computed, onMounted } from 'vue';
import { useScores } from '@/stores/scores';

const route = useRoute();
const router = useRouter();
const scoreStore = useScores();
const canvasRef = ref(null);
const loading = computed(() => scoreStore.loading);
const currentResult = ref(null);
const currentResultId = ref(null);

const scores = computed(() => scoreStore.scores);

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
    }
});

watch(currentResultId, (newId) => {
    if (newId) {
        currentResult.value = scores.value.find(score => score._id === newId); // Filtrar por el nuevo id
    }
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
}

</script>
  