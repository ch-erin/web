<template>
  <div class="canvas">
    <component v-for="item in canvasDataList" :key="item.id" :is="item.component"
      v-bind="{ ...item.props, ...item.attrs }" :style="item.style" draggable="true"
      @dragstart="handleDragStart($event, item)" @dragend="handleDragEnd"
      @click="handleComponentClick($event, item.id)" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useCanvasStore } from "@/stores/canvasData";

// 获取画布数据
const canvasStore = useCanvasStore();
const { canvasDataList, selectCanvasData } = canvasStore;
canvasStore.loadCanvasData();

// 拖拽状态
const dragItem = ref<any>(null);
const dragImage = ref<any>(null);
const isDragging = ref(false);

// 拖拽开始
const handleDragStart = (event: DragEvent, item: any) => {
  dragItem.value = item;
  isDragging.value = true;

  // 获取正在拖拽的元素
  const dragElement = event.target as HTMLElement;

  // 创建拖拽镜像
  dragImage.value = dragElement.cloneNode(true) as HTMLElement;

  // 设置镜像样式，保持原样并给其一个浮动的效果
  dragImage.value.style.position = 'absolute';
  dragImage.value.style.pointerEvents = 'none';
  dragImage.value.style.opacity = '0.02';
  dragImage.value.style.zIndex = '9999';

  // 将镜像添加到页面上（它会随着鼠标移动）
  document.body.appendChild(dragImage.value);

  // 通过 dragstart 事件设置镜像的拖拽位置
  const offsetX = event.clientX - dragElement.getBoundingClientRect().left;
  const offsetY = event.clientY - dragElement.getBoundingClientRect().top;

  if (!event.dataTransfer) return;
  event.dataTransfer.setDragImage(dragImage.value, offsetX, offsetY);
  event.dataTransfer.setData("application/json", JSON.stringify(item));
};

// 拖拽结束
const handleDragEnd = () => {
  // 隐藏原组件
  if (dragItem.value) {
    const dragElement = document.querySelector(`[data-id='${dragItem.value.id}']`) as HTMLElement;
    if (dragElement) {
      dragElement.style.visibility = "hidden"; // 隐藏原组件
    }
  }

  // 移除镜像
  if (dragImage.value) {
    dragImage.value.remove();
    dragImage.value = null;
  }

  // 恢复原组件可见
  setTimeout(() => {
    if (dragItem.value) {
      const dragElement = document.querySelector(`[data-id='${dragItem.value.id}']`) as HTMLElement;
      if (dragElement) {
        dragElement.style.visibility = "visible";
      }
    }
  }, 0);

  isDragging.value = false;
  dragItem.value = null;
};

const handleComponentClick = (event: MouseEvent, id: string) => {
  event.stopPropagation(); // 阻止事件冒泡，避免触发画布的点击事件
  selectCanvasData(id); // 调用选中组件的逻辑
};

</script>

<style scoped lang="scss">
.canvas {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
}

.canvas>* {
  padding: 10px;
  border: 1px solid #ddd;
  background-color: #fff;
  cursor: grab;
  transform: translate(1px, 1px);
}

/* 可选的，拖拽时让原组件的透明度变为 0，以便更明显地看到镜像 */
.canvas>*[draggable="true"]:active {
  opacity: 0;
  transform: translate(1px, 1px);
}
</style>