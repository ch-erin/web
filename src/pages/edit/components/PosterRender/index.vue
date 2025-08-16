<template>
  <BackGroud>
    <div id="editor" class="editor" ref="editor" @dragover.prevent="handleDragOver" @drop.prevent="handleDropEvent"
      @click.self="handleCanvasClick">
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
import { handleDrop } from "@/utils/Drag/index";
import { useCanvasStore } from "@/stores/canvasData";
import { getRealComponent } from "@/utils/map/index";
import { setGenerateId } from '@/utils/base/generateId'

// 状态管理
const editor = ref<HTMLDivElement | null>(null);
const editorRect = ref<DOMRect | null>(null);

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

const throttledMouseMoveHandler = throttle((event: MouseEvent | DragEvent) => {
  const { x, y } = getRelativePosition(event);
  return { x, y }
}, 64);

// 处理外部拖拽悬停
const handleDragOver = (event: DragEvent) => {
  const { x, y } = throttledMouseMoveHandler(event);
  mouseX.value = x;
  mouseY.value = y;
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

// 处理画布点击事件
const handleCanvasClick = () => {
  // 取消选择组件，这样会自动显示画布控制面板
  deselectCanvasData();
};

onMounted(setupEditorRectListeners);
onUnmounted(teardownEditorRectListeners);
</script>

<style scoped lang="scss">
.editor {
  position: relative;
  background: #f5f5f5;
  margin: auto;
  height: 100%;
  width: 100%;
  overflow: auto; // 改为auto支持滚动
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 20px;
  box-sizing: border-box;
}
</style>