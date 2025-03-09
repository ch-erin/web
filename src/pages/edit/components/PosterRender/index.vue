<template>
  <BackGroud>
    <div id="editor" class="editor" ref="editor" @mousedown="handleMouseDown" @mousemove="handleMouseMove"
      @mouseup="handleMouseUp" @dragover.prevent="handleDragOver" @drop.prevent="handleDropEvent"
      @click.prevent="deselectCanvasData">
      <Grid />
      <DynamicCanvas />
    </div>
  </BackGroud>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { throttle } from "lodash";
import Grid from "./components/Grid.vue";
import DynamicCanvas from "./components/Data.vue";
import BackGroud from "./components/BackGroud.vue";
//import MarkLine from "./components/MarkLine.vue";
import { handleDragOver, handleDrop } from "@/utils/Drag/index";
import { useCanvasStore } from "@/stores/canvasData";
import { getRealComponent } from "@/utils/map/index";
import { setGenerateId } from '@/utils/base/generateId'


// 状态管理
const editor = ref<HTMLDivElement | null>(null);
const editorRect = ref<DOMRect | null>(null);
const isDragging = ref(false);

// 鼠标位置状态
const mouseX = ref(0);
const mouseY = ref(0);

// 画布数据管理
const canvasStore = useCanvasStore();
const { addCanvasData, updateStyle, deselectCanvasData } = canvasStore;

const getRelativePosition = (event: MouseEvent | DragEvent): { x: number; y: number } => {
  if (!editorRect.value) return { x: 0, y: 0 };

  const { left, top } = editorRect.value;
  return {
    x: event.clientX - left,
    y: event.clientY - top,
  };
};

//只计算样式
const calculateComponentStyle = (x: number, y: number, component: any): Record<string, string> => {
  const style = component.style || {};
  const width = style.width ? parseInt(style.width, 10) : 0;
  const height = style.height ? parseInt(style.height, 10) : 0;

  return {
    ...style,
    position: "absolute",
    left: `${x - width / 2}px`,
    top: `${y - height / 2}px`,
  };
};

// 处理拖拽数据并添加到画布
const addComponentToCanvas = (realComponent: any) => {
  const componentStyle = calculateComponentStyle(mouseX.value, mouseY.value, realComponent);
  realComponent.style = componentStyle;
  realComponent.id = setGenerateId()
  addCanvasData(realComponent);
};

//修改组件位置
const upDateComponentToCanvas = (component: any) => {
  const componentStyle = calculateComponentStyle(mouseX.value, mouseY.value, component);
  component.style = componentStyle;
  updateStyle(component);
}

const handleMouseDown = () => isDragging.value = true;
const handleMouseUp = () => isDragging.value = false;

const throttledMouseMoveHandler = throttle((event: MouseEvent) => {
  const { x, y } = getRelativePosition(event);
  return { x, y }
}, 64);

const handleMouseMove = (event: MouseEvent) => {
  if (!isDragging.value) return;
  throttledMouseMoveHandler(event);
};

// 拖拽结束逻辑
const handleDropEvent = (event: DragEvent) => {
  const { x, y } = throttledMouseMoveHandler(event);
  mouseX.value = x;
  mouseY.value = y;

  handleDrop(event, (data) => {
    const realComponent = getRealComponent(data);

    if (data.source === "external") {
      data.source = "canvas";
      addComponentToCanvas(realComponent);
    } else if (data.source === "canvas") {
      upDateComponentToCanvas(realComponent)
    }
  });
};

// 更新编辑器边界
const updateEditorRect = () => {
  if (!editor.value) return;
  editorRect.value = editor.value.getBoundingClientRect();
};

// 设置和移除事件监听
const setupEditorRectListeners = () => {
  updateEditorRect();
  window.addEventListener("resize", updateEditorRect);
  window.addEventListener("scroll", updateEditorRect);
};

const teardownEditorRectListeners = () => {
  window.removeEventListener("resize", updateEditorRect);
  window.removeEventListener("scroll", updateEditorRect);
};

onMounted(setupEditorRectListeners);
onUnmounted(teardownEditorRectListeners);
</script>

<style scoped lang="scss">
.editor {
  position: relative;
  background: #fff;
  margin: auto;
  height: 100%;
  width: 100%;
  overflow: auto;
}
</style>