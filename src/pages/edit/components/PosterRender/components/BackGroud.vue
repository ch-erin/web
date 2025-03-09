<template>
    <div class="background" :style="backgroundStyle">
        <slot></slot>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useCanvasBackgroundStore } from "@/stores/canvasBackgroud";

const canvasBackgroundStore = useCanvasBackgroundStore();

const backgroundStyle = computed(() => ({
    backgroundColor: canvasBackgroundStore.background,
    height: `${canvasBackgroundStore.height}px`,
    width: `${canvasBackgroundStore.width}px`,
    opacity: canvasBackgroundStore.opacity,
}));
</script>

<style scoped lang="scss">
.background {
    overflow: visible;
}
</style>