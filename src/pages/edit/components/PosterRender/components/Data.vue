<template>
  <div
    class="canvas"
    ref="canvasRef"
    @dragover.prevent="handleCanvasDragOver"
    @drop.prevent="handleCanvasDrop"
    @click.self="deselectAll"
  >
    <!-- 画布组件 -->
    <div
      v-for="(item, index) in canvasDataList"
      :key="item.id"
      :class="[
        'draggable-component',
        {
          'selected': item.id === selectedId,
          'dragging': dragState.dragIndex === index
        }
      ]"
      :style="getComponentStyle(item)"
      draggable="true"
      @dragstart="handleDragStart($event, item, index)"
      @dragend="handleDragEnd"
      @mousedown="handleMouseDown($event, item, index)"
      @click.stop="handleComponentClick($event, item.id)"
    >
      <div class="component-content">
        <component
          :is="item.component"
          v-bind="{ ...item.props, ...item.attrs }"
        >
          {{ item.name || `组件 ${index + 1}` }}
        </component>
      </div>

      <!-- 选中状态的控制点 -->
      <div v-if="item.id === selectedId" class="selection-handles">
        <div class="handle handle-nw"></div>
        <div class="handle handle-ne"></div>
        <div class="handle handle-sw"></div>
        <div class="handle handle-se"></div>
      </div>
    </div>

    <!-- 拖拽预览 -->
    <div
      v-if="dragState.isDragging && dragState.dragItem"
      class="drag-preview"
      :style="dragPreviewStyle"
    >
      <component
        :is="dragState.dragItem.component"
        v-bind="{ ...dragState.dragItem.props, ...dragState.dragItem.attrs }"
      >
        {{ dragState.dragItem.name || '拖拽组件' }}
      </component>
    </div>

    <!-- 空状态提示 -->
    <div v-if="canvasDataList.length === 0" class="empty-canvas">
      <div class="empty-content">
        <div class="empty-icon">📦</div>
        <p>暂无组件，请从左侧拖拽组件到此处</p>
      </div>
    </div>

    <!-- 拖拽辅助线 -->
    <div v-if="showGuideLines" class="guide-lines">
      <div
        v-if="guideLines.vertical !== null"
        class="guide-line vertical"
        :style="{ left: guideLines.vertical + 'px' }"
      ></div>
      <div
        v-if="guideLines.horizontal !== null"
        class="guide-line horizontal"
        :style="{ top: guideLines.horizontal + 'px' }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onUnmounted, watch, nextTick } from "vue";
import { useCanvasStore } from "@/stores/canvasData";
import { useCanvasBackgroundStore } from "@/stores/canvasBackgroud";

const canvasStore = useCanvasStore();
const { canvasDataList, selectedId, selectCanvasData, updateStyle, deselectCanvasData } = canvasStore;
const canvasBackgroundStore = useCanvasBackgroundStore();

canvasStore.loadCanvasData();

const canvasRef = ref<HTMLElement>();

// 拖拽状态
const dragState = reactive({
  dragItem: null as any,
  dragIndex: -1,
  isDragging: false,
  startX: 0,
  startY: 0,
  currentX: 0,
  currentY: 0,
  offset: { x: 0, y: 0 }
});

// 辅助线状态
const showGuideLines = ref(false);
const guideLines = reactive({
  vertical: null as number | null,
  horizontal: null as number | null
});

// 拖拽预览样式
const dragPreviewStyle = computed(() => ({
  position: 'fixed' as const,
  left: `${dragState.currentX - dragState.offset.x}px`,
  top: `${dragState.currentY - dragState.offset.y}px`,
  pointerEvents: 'none' as const,
  zIndex: 1000,
  opacity: 0.8,
  transform: 'rotate(2deg) scale(1.05)'
}));

// 获取组件样式
const getComponentStyle = (item: any) => {
  const baseStyle = {
    ...item.style,
    position: 'absolute',
    transition: dragState.isDragging ? 'none' : 'all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    transform: 'translateZ(0)' // 启用硬件加速
  };

  // 如果正在拖拽当前组件，降低透明度
  if (dragState.isDragging && dragState.dragItem?.id === item.id) {
    baseStyle.opacity = '0.8';
  }

  return baseStyle;
};

// 获取相对画布的位置
const getRelativePosition = (event: MouseEvent | DragEvent): { x: number; y: number } => {
  if (!canvasRef.value) return { x: 0, y: 0 };

  const rect = canvasRef.value.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };
};

// 计算组件样式
const calculateComponentStyle = (x: number, y: number, component: any): Record<string, string> => {
  const style = component.style || {};
  const width = style.width ? parseInt(style.width, 10) : 100;
  const height = style.height ? parseInt(style.height, 10) : 50;

  return {
    ...style,
    position: 'absolute',
    left: `${x - width / 2}px`,
    top: `${y - height / 2}px`
  };
};

// 鼠标按下处理
const handleMouseDown = (event: MouseEvent, item: any, index: number) => {
  // 防止在输入框等元素上启动拖拽
  const target = event.target as HTMLElement;
  if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.contentEditable === 'true') {
    return;
  }

  event.preventDefault();
  event.stopPropagation();

  // 初始化拖拽状态
  dragState.dragItem = { ...item };
  dragState.dragIndex = index;
  dragState.startX = event.clientX;
  dragState.startY = event.clientY;
  dragState.currentX = event.clientX;
  dragState.currentY = event.clientY;

  // 计算鼠标相对于组件的偏移
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
  dragState.offset = {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };

  // 选中当前组件
  selectCanvasData(item.id);

  // 添加全局事件监听
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
  document.body.style.userSelect = 'none';
  document.body.style.cursor = 'grabbing';

  // 延迟启动拖拽，避免误触
  setTimeout(() => {
    if (dragState.dragItem) {
      dragState.isDragging = true;
      showGuideLines.value = true;
    }
  }, 100);
};

// 鼠标移动处理
const handleMouseMove = (event: MouseEvent) => {
  if (!dragState.isDragging || !dragState.dragItem) return;

  event.preventDefault();
  dragState.currentX = event.clientX;
  dragState.currentY = event.clientY;

  // 计算辅助线
  calculateGuideLines(event);
};

// 计算辅助线
const calculateGuideLines = (event: MouseEvent) => {
  if (!canvasRef.value) return;

  const { x, y } = getRelativePosition(event);
  const threshold = 5; // 吸附阈值

  // 重置辅助线
  guideLines.vertical = null;
  guideLines.horizontal = null;

  // 检查与其他组件的对齐
  canvasDataList.forEach((component, index) => {
    if (index === dragState.dragIndex) return;

    const compStyle = component.style || {};
    const compLeft = parseInt(compStyle.left || '0', 10);
    const compTop = parseInt(compStyle.top || '0', 10);
    const compWidth = parseInt(compStyle.width || '100', 10);
    const compHeight = parseInt(compStyle.height || '50', 10);

    // 垂直对齐检查
    if (Math.abs(x - compLeft) < threshold) {
      guideLines.vertical = compLeft;
    } else if (Math.abs(x - (compLeft + compWidth / 2)) < threshold) {
      guideLines.vertical = compLeft + compWidth / 2;
    } else if (Math.abs(x - (compLeft + compWidth)) < threshold) {
      guideLines.vertical = compLeft + compWidth;
    }

    // 水平对齐检查
    if (Math.abs(y - compTop) < threshold) {
      guideLines.horizontal = compTop;
    } else if (Math.abs(y - (compTop + compHeight / 2)) < threshold) {
      guideLines.horizontal = compTop + compHeight / 2;
    } else if (Math.abs(y - (compTop + compHeight)) < threshold) {
      guideLines.horizontal = compTop + compHeight;
    }
  });
};

// 鼠标抬起处理
const handleMouseUp = (event: MouseEvent) => {
  if (dragState.isDragging && dragState.dragItem) {
    // 计算新位置
    const { x, y } = getRelativePosition(event);
    const newStyle = calculateComponentStyle(x, y, dragState.dragItem);

    // 更新组件位置
    const updatedComponent = {
      ...dragState.dragItem,
      style: newStyle
    };

    updateStyleWithCanvasAdjust(updatedComponent);
  }

  // 清理拖拽状态
  cleanupDrag();
};

// 拖拽开始（HTML5 API）
const handleDragStart = (event: DragEvent, item: any, index: number) => {
  // 设置拖拽数据用于外部拖拽
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', JSON.stringify({
      ...item,
      source: 'canvas',
      originalIndex: index
    }));
  }
};

// 拖拽结束（HTML5 API）
const handleDragEnd = () => {
  // HTML5 拖拽结束时的清理
};

// 画布拖拽悬停
const handleCanvasDragOver = (event: DragEvent) => {
  event.preventDefault();
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move';
  }
};

// 画布拖拽放置
const handleCanvasDrop = (event: DragEvent) => {
  event.preventDefault();

  try {
    const data = JSON.parse(event.dataTransfer?.getData('text/plain') || '{}');

    if (data.source === 'external') {
      // 处理外部组件拖拽到画布
      const { x, y } = getRelativePosition(event);
      const newStyle = calculateComponentStyle(x, y, data);

      const newComponent = {
        ...data,
        style: newStyle,
        source: 'canvas'
      };

      // 这里需要调用父组件的添加方法
      console.log('添加新组件:', newComponent);
    }
  } catch (error) {
    console.error('拖拽数据解析失败:', error);
  }
};

// 取消选择
const deselectAll = () => {
  deselectCanvasData();
};

// 清理拖拽状态
const cleanupDrag = () => {
  dragState.isDragging = false;
  showGuideLines.value = false;

  // 重置拖拽状态
  Object.assign(dragState, {
    dragItem: null,
    dragIndex: -1,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    offset: { x: 0, y: 0 }
  });

  // 重置辅助线
  guideLines.vertical = null;
  guideLines.horizontal = null;

  // 移除全局事件监听
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseup', handleMouseUp);
  document.body.style.userSelect = '';
  document.body.style.cursor = '';
};

// 组件点击处理
const handleComponentClick = (event: MouseEvent, id: string) => {
  if (dragState.isDragging) return;
  event.stopPropagation();
  selectCanvasData(id);
};

// 计算所有组件的边界
const calculateComponentsBounds = () => {
  if (canvasDataList.length === 0) {
    return { minX: 0, minY: 0, maxX: 0, maxY: 0 };
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  canvasDataList.forEach(component => {
    const style = component.style || {};
    const left = parseInt(style.left || '0', 10);
    const top = parseInt(style.top || '0', 10);
    const width = parseInt(style.width || '100', 10);
    const height = parseInt(style.height || '50', 10);

    const right = left + width;
    const bottom = top + height;

    minX = Math.min(minX, left);
    minY = Math.min(minY, top);
    maxX = Math.max(maxX, right);
    maxY = Math.max(maxY, bottom);
  });

  return { minX, minY, maxX, maxY };
};

// 自动调整画布尺寸
const adjustCanvasSize = async () => {
  await nextTick(); // 等待DOM更新

  const bounds = calculateComponentsBounds();
  const adjusted = canvasBackgroundStore.adjustCanvasSize(bounds);

  if (adjusted) {
    console.log('画布尺寸已调整:', {
      width: canvasBackgroundStore.width,
      height: canvasBackgroundStore.height,
      bounds
    });
  }
};

// 监听组件列表变化，自动调整画布
watch(
  () => canvasDataList.map(item => ({
    id: item.id,
    style: item.style
  })),
  () => {
    adjustCanvasSize();
  },
  { deep: true, immediate: true }
);

// 在组件位置更新后调整画布
const updateStyleWithCanvasAdjust = (component: any) => {
  updateStyle(component);
  adjustCanvasSize();
};


// 清理函数
onUnmounted(() => {
  cleanupDrag();
});
</script>

<style scoped lang="scss">
.canvas {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding: 20px;
  box-sizing: border-box;
}

.draggable-component {
  position: relative;
  padding: 10px;
  border: 2px solid transparent;
  background-color: #fff;
  border-radius: 8px;
  cursor: grab;
  transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  user-select: none;

  &:hover {
    border-color: #e0e6ff;
    box-shadow: 0 2px 8px rgba(99, 102, 241, 0.1);
  }

  &.selected {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }

  &.dragging {
    cursor: grabbing;
    z-index: 999;
  }

  &.drag-over {
    border-color: #10b981;
    background-color: #f0fdf4;

    .drop-indicator {
      position: absolute;
      left: -2px;
      right: -2px;
      height: 3px;
      background: linear-gradient(90deg, #10b981, #34d399);
      border-radius: 2px;
      box-shadow: 0 0 8px rgba(16, 185, 129, 0.4);

      &.drop-above {
        top: -6px;
      }

      &.drop-below {
        bottom: -6px;
      }

      &::before {
        content: '';
        position: absolute;
        left: -4px;
        top: 50%;
        transform: translateY(-50%);
        width: 8px;
        height: 8px;
        background: #10b981;
        border-radius: 50%;
        box-shadow: 0 0 4px rgba(16, 185, 129, 0.6);
      }

      &::after {
        content: '';
        position: absolute;
        right: -4px;
        top: 50%;
        transform: translateY(-50%);
        width: 8px;
        height: 8px;
        background: #10b981;
        border-radius: 50%;
        box-shadow: 0 0 4px rgba(16, 185, 129, 0.6);
      }
    }
  }

  &:active {
    cursor: grabbing;
  }
}

.drag-preview {
  padding: 10px;
  border: 2px solid #6366f1;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 8px 25px rgba(99, 102, 241, 0.3);
  max-width: 300px;

  &::after {
    content: '';
    position: absolute;
    inset: -2px;
    border: 2px dashed #6366f1;
    border-radius: 8px;
    opacity: 0.5;
  }
}

// 拖拽时禁用组件内部的指针事件和文本选择
.draggable-component.dragging * {
  user-select: none;
  pointer-events: none;
}

// 选中状态的控制点
.selection-handles {
  position: absolute;
  inset: -4px;
  pointer-events: none;

  .handle {
    position: absolute;
    width: 8px;
    height: 8px;
    background: #6366f1;
    border: 2px solid #fff;
    border-radius: 50%;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    &.handle-nw {
      top: -4px;
      left: -4px;
    }

    &.handle-ne {
      top: -4px;
      right: -4px;
    }

    &.handle-sw {
      bottom: -4px;
      left: -4px;
    }

    &.handle-se {
      bottom: -4px;
      right: -4px;
    }
  }
}

// 拖拽辅助线
.guide-lines {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 998;

  .guide-line {
    position: absolute;
    background: #6366f1;
    opacity: 0.8;

    &.vertical {
      width: 1px;
      height: 100%;
      top: 0;
    }

    &.horizontal {
      height: 1px;
      width: 100%;
      left: 0;
    }
  }
}

// 空状态样式
.empty-canvas {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;

  .empty-content {
    text-align: center;
    color: #9ca3af;

    .empty-icon {
      font-size: 48px;
      margin-bottom: 16px;
    }

    p {
      margin: 0;
      font-size: 14px;
    }
  }
}

// 画布边界指示器
.canvas::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 2px dashed rgba(99, 102, 241, 0.3);
  pointer-events: none;
  z-index: 1;
}
</style>