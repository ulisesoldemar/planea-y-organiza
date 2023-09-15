<template>
    <AdminLayout>
        <v-card>
            <v-card-title>WIP</v-card-title>
            {{ scores }}
        </v-card>
    </AdminLayout>
</template>

<script setup>
import AdminLayout from '@/layouts/AdminLayout.vue';
import { useScores } from '@/stores/scores';
import { onMounted, computed } from 'vue';

const scoreStore = useScores();
const scores = computed(() => scoreStore.scores);

onMounted(async () => {
    scoreStore.listResults();
});

</script>