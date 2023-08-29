<template>
    <AdminLayout>
        <Result v-if="scores.length > 0" :patterns="scores[0].patterns"/>
    </AdminLayout>
</template>

<script setup>
import AdminLayout from '@/layouts/AdminLayout.vue';
// import ResultsList from '@/components/Admin/ResultsList.vue';
import Result from '@/components/Admin/Result.vue';

import { onMounted, computed } from 'vue';
import { useScores } from '@/stores/scores';

const scoreStore = useScores();

onMounted(async () => {
    await scoreStore.listResults();
});

const scores = computed(() => scoreStore.scores);

</script>