<template>
    <div class="background" :style="canvasBackgroundStore.canvasStyle">
        <slot></slot>
    </div>
</template>

<script setup lang="ts">
import { useCanvasBackgroundStore } from "@/stores/canvasBackgroud";

const canvasBackgroundStore = useCanvasBackgroundStore();
</script>

<style scoped lang="scss">
.background {
    overflow: hidden;
    position: relative;
}
</style>