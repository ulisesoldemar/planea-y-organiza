<template>
    <AdminLayout>
        <v-card class="pa-2" width="100%">
            <v-card-title class="d-flex justify-space-between">
                <div>
                    <router-link to="/tasks">
                        <v-btn prepend-icon="mdi-arrow-left-bold" color="secondary"
                            variant="tonal">Regresar</v-btn>
                    </router-link>
                </div>
                <!-- <div class="room-title">Nombre de tarea: {{ currentRoom.roomName }}</div> -->
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
                <v-row>
                    <v-col cols="12" sm="6" md="6">
                        <v-text-field color="primary" label="Nombre de la tarea" :rules="nameRules"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                        <v-btn @click="submitCords()" color="primary">Guardar</v-btn>
                    </v-col>
                </v-row>
                
                <!-- Funcionamiento de las secciones -->
                <v-container class="text-center">
                    <v-spacer class="mt-5"></v-spacer>
                    <v-row class="fill-height" align="center" justify="center">
                        <template v-for="(item, index) in items" :key="index">
                            <v-col cols="12" md="2">
                                <v-hover v-slot="{ isHovering, props }">
                                    <v-card :elevation="isHovering ? 12 : 2" :class="{ 'on-hover': isHovering }"
                                        v-bind="props">
                                        <div class="image-container">
                                            <v-img :src="item.img" height="auto" width="200px" cover
                                                :style="{ transform: `rotate(${item.rotation}deg) scaleX(${item.flipH ? -1 : 1})` }"></v-img>
                                            <v-card-title class="text-h6 flex-column">
                                                <p class="mt-4">{{ item.title }}</p>
                                            </v-card-title>
                                        </div>
                                        <div class="button-container">
                                            <div class="align-self-center justify-center">
                                                <v-row class="margin-none">
                                                    <v-col>
                                                        <v-btn variant="text" :class="{ 'show-btns': isHovering }"
                                                            :color="transparent" icon="mdi-rotate-left"
                                                            @click="rotateLeft(index)"></v-btn>
                                                    </v-col>
                                                </v-row>
                                                <v-row class="margin-none">
                                                    <v-col>
                                                        <v-btn v-for="(icon, i) in icons" :key="i" variant="text"
                                                            :class="{ 'show-btns': isHovering }" :color="transparent"
                                                            :icon="icon" @click="middlebtns(i, index)"></v-btn>
                                                    </v-col>
                                                </v-row>
                                                <v-row class="margin-none">
                                                    <v-col>
                                                        <v-btn variant="text" :class="{ 'show-btns': isHovering }"
                                                            :color="transparent" icon="mdi-rotate-right"
                                                            @click="rotateRight(index)"></v-btn>
                                                    </v-col>
                                                </v-row>
                                            </div>
                                        </div>
                                    </v-card>
                                </v-hover>
                            </v-col>
                        </template>
                    </v-row>
                </v-container>
            </v-card-text>
        </v-card>
    </AdminLayout>
</template>

<script setup>
import AdminLayout from '@/layouts/AdminLayout.vue';
import { useRoute, useRouter } from 'vue-router';
import { ref, watch, computed, onMounted } from 'vue';


const route = useRoute();

onMounted(async () => {
    if (route.params.id) {
        // await roomStore.fetchRoomData(route.params.id);

        // if (currentRoom.value.expiration) {
        //     expiredAt.value = roomStore.formatDate(currentRoom.value.expiration);
        //     isExpired.value = new Date() > new Date(currentRoom.value.expiration);
        // } else {
        //     expiredAt.value = "No expira";
        //     isExpired.value = false;
        // }

    }
});

 const nameRules = [
    (v) => v && v.length <= 50 || 'El nombre de la sala debe tener 50 caracteres o menos',
];

/**
 * Codigo para el funcionamiento 
 */

const sec1 = require('@/assets/images/Seccion-1.png');
const sec2 = require('@/assets/images/Seccion-2.png');
const sec3 = require('@/assets/images/Seccion-3.png');
const sec4 = require('@/assets/images/Seccion-4.png');
const sec5 = require('@/assets/images/Seccion-5.png');

const icons = ref(['mdi-arrow-left', 'mdi-swap-horizontal-circle', 'mdi-arrow-right']);

const sectionStates = ref([
    {
        finalPos: 0,
        flipped: false,
        rotated: false
    },
    {
        finalPos: 1,
        flipped: false,
        rotated: false
    },
    {
        finalPos: 2,
        flipped: false,
        rotated: false
    },
    {
        finalPos: 3,
        flipped: false,
        rotated: false
    },
    {
        finalPos: 4,
        flipped: false,
        rotated: false
    },
]);

const items = ref([
    {
        id: 0,
        title: 'Sección 1',
        img: sec1,
        rotation: 0,
        flipH: false,
    },
    {
        id: 1,
        title: 'Sección 2',
        img: sec2,
        rotation: 0,
        flipH: false,
    },
    {
        id: 2,
        title: 'Sección 3',
        img: sec3,
        rotation: 0,
        flipH: false,
    },
    {
        id: 3,
        title: 'Sección 4',
        img: sec4,
        rotation: 0,
        flipH: false,
    },
    {
        id: 4,
        title: 'Sección 5',
        img: sec5,
        rotation: 0,
        flipH: false,
    }
]);

const transparent = 'rgba(255, 255, 255, 0)';

const middlebtns = (i, index) => {
    switch (i) {
        case 0:
            moveLeft(index);
            break;
        case 1:
            flipHorizontal(index);
            break;
        case 2:
            moveRight(index);
            break;
    }
};

const rotateLeft = (index) => {
    console.log("Rotate-left");
    const secc = items.value[index].id;

    //Rotate the image
    items.value[index].rotation -= 180;
    //Save state rotation
    sectionStates.value[secc].rotated = (items.value[index].rotation % 360) !== 0 ? true : false;
};

const rotateRight = (index) => {
    console.log("Rotate-right");
    const secc = items.value[index].id;

    //Rotate the image
    items.value[index].rotation += 180;
    //Save state rotation
    sectionStates.value[secc].rotated = (items.value[index].rotation % 360) !== 0 ? true : false;
};

const moveLeft = (index) => {
    console.log("Move-left");
    const id1 = items.value[index].id;
    const id2 = items.value[index - 1].id;

    //Swap images
    const temp = items.value[index];
    items.value[index] = items.value[index - 1];
    items.value[index - 1] = temp;

    sectionStates.value[id1].finalPos = id2;
    sectionStates.value[id2].finalPos = id1;

};

const flipHorizontal = (index) => {
    console.log("Swap horizontal");
    const state = !items.value[index].flipH;
    items.value[index].flipH = state;

    sectionStates.value[items.value[index].id].flipped = state;
};

const moveRight = (index) => {
    console.log("Move-right");
    const id1 = items.value[index].id;
    const id2 = items.value[index + 1].id;

    //Swap images
    const temp = items.value[index];
    items.value[index] = items.value[index + 1];
    items.value[index + 1] = temp;


    sectionStates.value[id1].finalPos = id2;
    sectionStates.value[id2].finalPos = id1;
};

const submitCords = () => {
    console.log(sectionStates.value);
};


</script>

<style scoped>
.room-title {
    color: #424242;
    /*font-weight: 500 !important;*/
    margin-right: 15px;
}

.v-card {
    transition: opacity 0.4s ease-in-out;
}

.v-card:not(.on-hover) {
    opacity: 0.92;
}

.show-btns {
    color: rgb(41, 39, 42) !important;
}

.margin-none {
    margin: 0 !important;
}

.margin-none .v-col {
    padding: 2px;
}

.image-container {
    width: 100%;
    height: auto;
}

.button-container {
    width: 100%;
    height: auto;
    position: absolute;
    top: 27%;
}
</style>