<template>
    <div class="v-image" :style="style" @dragover="handleDragOver">
        <img :src="propValue" />
    </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

defineProps<{
    propValue: string;
    label: string;
    icon: string;
    style: {}
}>();

const handleDragOver = (event: DragEvent) => {
    const target = event.target as HTMLElement;
    if (target) {
        const containerWidth = target.clientWidth;
        const containerHeight = target.clientHeight;

        // 动态调整图片的尺寸
        target.style.width = `${containerWidth}px`;
        target.style.height = `${containerHeight}px`;
    }
};
</script>

<style scoped>
.v-image {
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    border-radius: 4px;
    border: 1px solid #ccc;
    background-color: #f5f5f5;
}

.v-image img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
}
</style>