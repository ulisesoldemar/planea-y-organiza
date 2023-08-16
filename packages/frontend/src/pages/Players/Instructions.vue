<template>
    <v-card class="mx-auto" max-width="1280">
        <v-card-title>Instrucciones</v-card-title>
        <v-container fluid>
            <v-row dense>
                <v-col v-for="instructions in videos" :key="instructions.text" cols="4">
                    <v-card class="card">
                        <video :src="instructions.video" class="video" autoplay loop></video>
                        <v-card-text>
                            {{ instructions.text }}
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
        <v-card-actions>
            <v-btn variant="elevated" block to="/game">
                Entendido
            </v-btn>
        </v-card-actions>
    </v-card>
</template>
  
<script setup>
import video1 from '@/assets/animations/Instrucciones-1.mp4'
import video2 from '@/assets/animations/Instrucciones-2.mp4'
import video3 from '@/assets/animations/Instrucciones-3.mp4'
import video4 from '@/assets/animations/Instrucciones-4.mp4'
import video5 from '@/assets/animations/Instrucciones-5.mp4'
import video6 from '@/assets/animations/Instrucciones-6.mp4'

const videos = [
    { video: video1, text: "1- Arrastra la pelota manteniendo el clic." },
    { video: video2, text: "2- Lleva la pelota hasta el canasto azul correspondiente." },
    { video: video3, text: "3- Puedes comenzar en la casilla que prefieras y cambiar cuando lo desees, aún si no has terminado de meter todas las pelotas." },
    { video: video4, text: "4- No es posible meter una pelota dentro de una casilla diferente a la de su sección." },
    { video: video5, text: "5- La prueba inicia cuando escuches un sonido y aparezca un circulo verde en la parte superior derecha." },
    { video: video6, text: "6- La prueba termina cuando escuches un sonido y aparezca un cirtulo rojo en la misma posicion." },
]
</script>

<style>
.card {
    /* Asegura que todas las tarjetas tengan la misma altura */
    height: 100%;
}
</style>
  