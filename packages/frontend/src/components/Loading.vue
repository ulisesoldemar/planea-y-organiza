<template>
    <div class="loading-page">
        <div class="loading-spinner"></div>
        <p class="mt-10">Esperando a que el administrador inicie la prueba...</p>
    </div>
</template>
  
<style>

.body{
    padding: 0px;
    margin: 0px;
}

html {
  overflow-x: hidden;
  overflow-y: scroll;
}

.loading-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    width: 100%;
    background-color: #f9f9f9;
}

.loading-spinner {
    border: 3px solid transparent;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    width: 55px;
    height: 55px;
    animation: rotate 1s ease infinite;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(1turn);
  }
}
</style>