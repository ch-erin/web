<template>
    <div v-if="selectedId === 'background'">
        <backGroud />
    </div>
    <div v-else>
        <PropertiesPanel />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import backGroud from './backGroud.vue';
import PropertiesPanel from './components.vue';
import { useCanvasStore } from '@/stores/canvasData';

const canvasStore = useCanvasStore();
const selectedId = computed(() => canvasStore.selectedId);
</script>