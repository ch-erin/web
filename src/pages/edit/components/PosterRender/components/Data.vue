<template>
  <div class="canvas">
    <component v-for="item in canvasDataList" :key="item.id" :is="item.component"
      v-bind="{ ...item.props, ...item.attrs }" :style="item.style" draggable="true"
      @dragstart="handleDragStart($event, item)" @dragend="handleDragEnd" @click="handleComponentClick($event, item.id)"
      class="draggable-component" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useCanvasStore } from "@/stores/canvasData";

const canvasStore = useCanvasStore();
const { canvasDataList, selectCanvasData } = canvasStore;
canvasStore.loadCanvasData();

const dragItem = ref<any>(null);
const initialTransform = ref({ x: 0, y: 0 });

const handleDragStart = (event: DragEvent, item: any) => {
  const dragElement = event.target as HTMLElement;
  dragItem.value = item;

  // 记录初始位置
  const rect = dragElement.getBoundingClientRect();
  initialTransform.value = {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };

  // 设置拖拽视觉效果
  dragElement.classList.add('dragging');

  // 创建透明拖拽图像
  if (event.dataTransfer) {
    const transparentImg = new Image();
    transparentImg.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    event.dataTransfer.setDragImage(transparentImg, 0, 0);
    event.dataTransfer.setData("application/json", JSON.stringify(item));
  }
};

const handleDragEnd = (event: DragEvent) => {
  const dragElement = event.target as HTMLElement;
  dragElement.classList.remove('dragging');
  dragElement.style.removeProperty('transform');
  dragItem.value = null;
};

const handleComponentClick = (event: MouseEvent, id: string) => {
  event.stopPropagation();
  selectCanvasData(id);
};
</script>

<style scoped lang="scss">
.canvas {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
}

.draggable-component {
  padding: 10px;
  border: 1px solid #ddd;
  background-color: #fff;
  cursor: grab;
  transition:
    transform 0.2s cubic-bezier(0.18, 0.89, 0.32, 1.28),
    box-shadow 0.2s ease;

  &.dragging {
    cursor: grabbing;
    opacity: 0.9;
    transform: scale(1.02) translate(var(--dx, 0), var(--dy, 0));
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    transition: none;
  }

  &:active {
    cursor: grabbing;
  }
}
</style>