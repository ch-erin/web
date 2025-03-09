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
const dragImage = ref<any>(null);
const originalOpacity = ref<string>("");

const handleDragStart = (event: DragEvent, item: any) => {
  const dragElement = event.target as HTMLElement;
  dragItem.value = item;

  // 保存原始透明度
  originalOpacity.value = dragElement.style.opacity;
  dragElement.style.opacity = "0.01"; // 半透明效果

  // 创建拖拽镜像
  dragImage.value = dragElement.cloneNode(true) as HTMLElement;

  // 设置镜像样式
  dragImage.value.style.position = 'fixed';
  dragImage.value.style.pointerEvents = 'none';
  dragImage.value.style.opacity = '0.7';
  dragImage.value.style.zIndex = '9999';
  dragImage.value.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
  dragImage.value.style.transition = 'none'; // 禁用过渡效果

  // 计算镜像位置
  const rect = dragElement.getBoundingClientRect();
  dragImage.value.style.left = `${rect.left}px`;
  dragImage.value.style.top = `${rect.top}px`;

  document.body.appendChild(dragImage.value);

  // 设置拖拽图像和偏移
  const offsetX = event.clientX - rect.left;
  const offsetY = event.clientY - rect.top;

  if (event.dataTransfer) {
    event.dataTransfer.setDragImage(dragImage.value, offsetX, offsetY);
    event.dataTransfer.setData("application/json", JSON.stringify(item));
  }
};

const handleDragEnd = () => {
  // 恢复原始元素状态
  if (dragItem.value) {
    const dragElement = document.querySelector(`[data-id='${dragItem.value.id}']`) as HTMLElement;
    if (dragElement) {
      dragElement.style.opacity = originalOpacity.value;
      dragElement.style.transform = "translate(0, 0)"; // 重置变换
    }
  }

  // 移除镜像
  if (dragImage.value) {
    dragImage.value.remove();
    dragImage.value = null;
  }

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
  transition: all 0.2s ease; // 添加平滑过渡

  &:active {
    cursor: grabbing;
    transition: none; // 拖拽时禁用过渡
  }

  &.drag-overlay {
    opacity: 0.7 !important;
    transform: scale(1.02);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
}
</style>