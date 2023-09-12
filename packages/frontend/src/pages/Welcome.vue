<template>
    <div class="welcome">
        <div class="logo">
            <!-- Aquí puedes incluir tu logo -->
            <img src="ruta/a/tu/logo.png" alt="Logo de la aplicación" />
        </div>
        <div class="buttons">
            <router-link to="/welcome">
                <button>Registrarse</button>
            </router-link>
            <router-link to="/login">
                <button>Iniciar sesión</button>
            </router-link>
        </div>
    </div>
</template>
  
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const redirectToRegistration = () => {
    const router = useRouter();
    router.push('/registro');
};

const redirectToLogin = () => {
    const router = useRouter();
    router.push('/inicio-sesion');
};
</script>
  
<style scoped>
.welcome {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
}

.logo img {
    max-width: 200px;
    /* Ajusta el ancho de tu logo según sea necesario */
}

.buttons {
    margin-top: 20px;
}

button {
    margin: 10px;
    padding: 10px 20px;
    font-size: 16px;
    background-color: #007bff;
    /* Color de fondo del botón, puedes cambiarlo */
    color: #fff;
    /* Color del texto del botón, puedes cambiarlo */
    border: none;
    cursor: pointer;
}

button:hover {
    background-color: #0056b3;
    /* Cambia el color de fondo cuando el botón se encuentra en estado "hover" */
}</style>
  