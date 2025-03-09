<template>
  <div class="components-container">
    <div v-for="item in elements" :key="item.name" class="component-wrapper" :style="item.containerStyle">
      <component :is="item.component" v-bind="item.attrs" :style="item.style" draggable="true"
        @dragstart="(event: DragEvent) => handleDragStart(event, item)" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  elements: {
    name: string;
    component: any;
    attrs: Record<string, any>;
    style: Record<string, any>;
    containerStyle: Record<string, any>;
  }[];
}>();

//后续会添加获取鼠标相对组件位置，实现更为金精细化的拖拽安放，不会出现组件位置错位的情况
const handleDragStart = (event: DragEvent, data: any) => {
  if (!event.dataTransfer) return;

  const dragData = {
    ...data,
    component: data.component.name,
    source: "external",
  };

  event.dataTransfer.setData("application/json", JSON.stringify(dragData));
};
</script>

<style scoped lang="scss">
.components-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.component-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  box-sizing: border-box;

  :deep(.v-button) {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
  }

  :deep(.v-text),
  :deep(.v-input) {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
  }
}

:deep(.v-button):hover {
  background-color: #0062cc;
}
</style>