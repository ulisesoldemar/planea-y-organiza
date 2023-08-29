<template>
    <v-card :title="props.date" :subtitle="props.date">
        <canvas ref="canvas" width="1280" height="720"></canvas>
    </v-card>
</template>
  
<script setup>
import { onMounted, ref } from 'vue';

const props = defineProps({
    _id: String,
    date: Date,
    time: Number,
    distance: Number,
    distancePerSection: Array,
    transitions: Array,
    patterns: Array,
    score: Number,
});

const canvas = ref(null);

onMounted(() => {
    drawLines();
});

function drawLines() {
    const ctx = canvas.value.getContext('2d');
    console.log(props.patterns)

    ctx.lineWidth = 2;
    ctx.strokeStyle = 'blue';
    ctx.fillStyle = 'yellow';

    for (let i = 0; i < props.patterns.length; ++i) {
        const points = props.patterns[i];
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
canvas {
    border: 1px solid black;
}
</style>
  