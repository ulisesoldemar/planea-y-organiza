<template>
  <v-container class="pa-4 text-center">
    <v-row class="fill-height" align="center" justify="center">
      <template v-for="(item, index) in items" :key="index">
        <v-col cols="12" md="2">
          <v-hover v-slot="{ isHovering, props }">
            <v-card :elevation="isHovering ? 12 : 2" :class="{ 'on-hover': isHovering }" v-bind="props">
              <div class="image-container">
                <v-img :src="item.img" height="auto" width="200px" cover
                  :style="{ transform: `rotate(${item.rotation}deg) scaleX(${item.flipH ? -1 : 1})`}"></v-img>
                <v-card-title class="text-h6 flex-column">
                  <p class="mt-4">{{ item.title }}</p>
                </v-card-title>
              </div>
              <div class="button-container">
                <div class="align-self-center justify-center">
                  <v-row class="margin-none">
                    <v-col>
                      <v-btn variant="rext" :class="{ 'show-btns': isHovering }" :color="transparent"
                        icon="mdi-rotate-left" @click="rotateLeft(index)"></v-btn>
                    </v-col>
                  </v-row>
                  <v-row class="margin-none">
                    <v-col>
                      <v-btn v-for="(icon, i) in icons" :key="i" variant="rext" :class="{ 'show-btns': isHovering }"
                        :color="transparent" :icon="icon" @click="middlebtns(i, index)"></v-btn>
                    </v-col>
                  </v-row>
                  <v-row class="margin-none">
                    <v-col>
                      <v-btn variant="rext" :class="{ 'show-btns': isHovering }" :color="transparent"
                        icon="mdi-rotate-right" @click="rotateRight(index)"></v-btn>
                    </v-col>
                  </v-row>
                </div>
              </div>
            </v-card>
          </v-hover>
        </v-col>
      </template>
    </v-row>
    <v-btn @click="submitCords()">Submit</v-btn>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';

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
    inverted: false
  },
  {
    finalPos: 1,
    flipped: false,
    inverted: false
  },
  {
    finalPos: 2,
    flipped: false,
    inverted: false
  },
  {
    finalPos: 3,
    flipped: false,
    inverted: false
  },
  {
    finalPos: 4,
    flipped: false,
    inverted: false
  },
]);

const items = ref([
  {
    id: 0,
    title: 'Sección 1',
    text: `It's New Release Friday`,
    img: sec1,
    rotation: 0,
    flipH: false,
  },
  {
    id: 1,
    title: 'Sección 2',
    text: 'Greatest Rock Hits',
    img: sec2,
    rotation: 0,
    flipH: false,
  },
  {
    id: 2,
    title: 'Sección 3',
    text: 'Ambient Bass',
    img: sec3,
    rotation: 0,
    flipH: false,
  },
  {
    id: 3,
    title: 'Sección 4',
    text: 'Ambient Bass',
    img: sec4,
    rotation: 0,
    flipH: false,
  },
  {
    id: 4,
    title: 'Sección 5',
    text: 'Ambient Bass',
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
  sectionStates.value[secc].inverted = (items.value[index].rotation % 360) !== 0 ? true : false;
};

const rotateRight = (index) => {
  console.log("Rotate-right");
  const secc = items.value[index].id;

  //Rotate the image
  items.value[index].rotation += 180;
  //Save state rotation
  sectionStates.value[secc].inverted = (items.value[index].rotation % 360) !== 0 ? true : false; 
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
.v-card {
  transition: opacity 0.4s ease-in-out;
}

.v-card:not(.on-hover) {
  opacity: 0.7;
}

.show-btns {
  color: rgb(51, 47, 53) !important;
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