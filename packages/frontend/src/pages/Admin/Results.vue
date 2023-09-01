<template>
    <AdminLayout>
        <v-btn>
            Open
            <Result v-if="scores.length > 0" :results="scores" player-name="Ulises Ortega"/>
        </v-btn>
    </AdminLayout>
</template>

<script setup>
import AdminLayout from '@/layouts/AdminLayout.vue';
// import ResultsList from '@/components/Admin/ResultsList.vue';
import Result from '@/components/Admin/Result.vue';

import { onMounted, computed } from 'vue';
import { useScores } from '@/stores/scores';
import { ref } from 'vue';

const scoreStore = useScores();

const dialog = ref(false);

onMounted(async () => {
    await scoreStore.fetchResult("64ef67d1a601626d3c351986");
});

const scores = computed(() => scoreStore.currentScores);

</script>