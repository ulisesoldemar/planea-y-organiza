<script setup>
import { onBeforeMount, onBeforeUnmount } from 'vue';
import PhaserContainer from '@/components/PhaserContainer';

// TODO: Que funcione
const confirmExit = (event) => {
  // Muestra un mensaje de advertencia personalizado
  event.returnValue = 'Estás a punto de abandonar la página. ¿Estás seguro?';
};

onBeforeMount(() => {
  // Agrega un controlador de evento beforeunload cuando el componente se monta
  window.addEventListener('beforeunload', confirmExit);
});

onBeforeUnmount(() => {
  // Elimina el controlador de evento beforeunload cuando el componente se desmonta
  window.removeEventListener('beforeunload', confirmExit);
});

</script>

<template>
  <Suspense>
    <PhaserContainer />

    <template #fallback>
      <div class="placeholder">
        Cargando ...
      </div>
    </template>
  </Suspense>
</template>

<style lang="scss" scoped>
.placeholder {
  font-size: 2rem;
  font-family: 'Courier New', Courier, monospace;
}
</style>
