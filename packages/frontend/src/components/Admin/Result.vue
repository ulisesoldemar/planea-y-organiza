<template>
    <v-dialog v-model="dialog" activator="parent" width="auto">
        <v-toolbar flat class="rounded-t-lg">
            <v-toolbar-title>{{ playerName }}</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-col cols="2">
                <v-text-field v-model="currentDate" type="date"></v-text-field>
            </v-col>
        </v-toolbar>
        <v-card v-if="currentResult">
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
    </v-dialog>
</template>
  
<script setup>
import { ref, watch, computed, onMounted } from 'vue';

const dialog = ref(false);
const canvasRef = ref(null);

const props = defineProps({
    playerName: String,
    results: Array,
});

const currentDate = ref(null);

onMounted(() => {
    const firstDate = new Date(props.results.slice(-1)[0].date).toISOString().substring(0, 10); // Se obtiene la ultima prueba
    currentDate.value = firstDate;
})

const currentResult = computed(() => {
    return props.results.find(result => result.date.substring(0, 10) === currentDate.value); // Se filtra el resultado por fecha
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
  
<style>
/* Estilos opcionales para el canvas */
</style>
  