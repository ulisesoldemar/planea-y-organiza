<template>
    <v-card :loading="isUpdating" color="blue-grey-darken-1" class="mx-auto" max-width="420">
        <template v-slot:loader="{ isActive }">
            <v-progress-linear :active="isActive" color="green-lighten-3" height="4" indeterminate></v-progress-linear>
        </template>

        <v-img cover height="200" src="https://cdn.vuetifyjs.com/images/cards/dark-beach.jpg">
            <v-row class="pa-3">
                <v-col cols="12">
                    <v-menu location="bottom start" origin="overlap" transition="slide-y-transition">
                        <template v-slot:activator="{ props }">
                            <v-btn v-bind="props" icon="mdi-dots-vertical" density="comfortable" variant="tonal"></v-btn>
                        </template>

                        <v-list :lines="false">
                            <v-list-item title="Update" @click="isUpdating = true"></v-list-item>
                        </v-list>
                    </v-menu>
                </v-col>

                <v-row>
                    <v-col class="text-center">
                        <h3 class="text-h5">{{ name }}</h3>

                        <span class="text-grey-lighten-1">{{ title }}</span>
                    </v-col>
                </v-row>
            </v-row>
        </v-img>

        <v-form>
            <v-container>
                <v-row dense>
                    <v-col cols="12" md="6">
                        <v-text-field v-model="name" :disabled="isUpdating" color="blue-grey-lighten-2"
                            label="Name"></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6">
                        <v-text-field v-model="title" :disabled="isUpdating" color="blue-grey-lighten-2"
                            label="Title"></v-text-field>
                    </v-col>

                    <v-col cols="12">
                        <v-autocomplete v-model="friends" :disabled="isUpdating" :items="people" chips closable-chips
                            color="blue-grey-lighten-2" item-title="name" item-value="name" label="Select" multiple>
                            <template v-slot:chip="{ props, item }">
                                <v-chip v-bind="props" :prepend-avatar="item.raw.avatar" :text="item.raw.name"></v-chip>
                            </template>

                            <template v-slot:item="{ props, item }">
                                <v-list-item v-bind="props" :prepend-avatar="item?.raw?.avatar" :title="item?.raw?.name"
                                    :subtitle="item?.raw?.group"></v-list-item>
                            </template>
                        </v-autocomplete>
                    </v-col>
                </v-row>
            </v-container>
        </v-form>

        <v-divider></v-divider>

        <v-card-actions>
            <v-switch v-model="autoUpdate" :disabled="isUpdating" class="mt-0 ms-2" color="green-lighten-2"
                density="compact" hide-details label="Auto Update"></v-switch>

            <v-spacer></v-spacer>

            <v-btn :disabled="autoUpdate" :loading="isUpdating" :variant="isUpdating ? 'tonal' : undefined"
                color="blue-grey-lighten-3" prepend-icon="mdi-update" @click="isUpdating = true">
                Update Now
            </v-btn>
        </v-card-actions>
    </v-card>
</template>
  
<script setup>
import {
    ref,
    watch,
    onMounted,
    clearTimeout,
    setTimeout,
    computed
} from 'vue';

import { usePlayers } from '@/stores/players';

const playerStore = usePlayers();
onMounted(async () => {
    await playerStore.listPlayers();
});

const autoUpdate = ref(true);
const friends = ref([playerStore.fullName(0)]);
console.log(friends.value)
const isUpdating = ref(false);
const name = ref('Midnight Crew');
const people = computed(() => playerStore.players);
const title = ref('The summer breeze');
let timeout = null;

watch(isUpdating, (val) => {
    clearTimeout(timeout);

    if (val) {
        timeout = setTimeout(() => (isUpdating.value = false), 3000);
    }
});

function remove(item) {
    const index = friends.value.indexOf(item.name);
    if (index >= 0) friends.value.splice(index, 1);
}
</script>
  