<template>
    <v-app>
      <v-container>
        <v-row>
          <v-col cols="6">
            <v-color-picker hide-inputs show-swatches
              v-model="selectedColor"
              label="Selecciona un color"
              @input="updateColor"
            ></v-color-picker>
          </v-col>
          <v-col cols="6">
            <div
              :style="{ backgroundColor: selectedColor }"
              :class="{ 'text-dark': isColorDark(selectedColor) }"
              class="color-box"
            >
              Texto en color dinámico
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-app>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const selectedColor = ref('#ff0000'); // Color inicial
  
  const isColorDark = (color) => {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128;
  };
  
  const updateColor = () => {
    // Esta función se ejecutará cada vez que se seleccione un nuevo color.
    // Puedes realizar acciones adicionales aquí si es necesario.
  };
  </script>
  
  <style>
  .color-box {
    width: 100%;
    height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white; /* Color de texto predeterminado */
  }
  
  .text-dark {
    color: #343434; /* Color de texto cuando el fondo es oscuro */
  }
  </style>