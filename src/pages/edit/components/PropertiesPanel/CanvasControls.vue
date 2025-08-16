<template>
  <div class="canvas-controls">
    <div class="panel-content">
      <div class="control-group">
        <h4>画布信息</h4>
        <div class="control-item">
          <label>画布尺寸</label>
          <div class="size-display">
            {{ canvasBackgroundStore.width }} × {{ canvasBackgroundStore.height }} px
          </div>
        </div>
        <div class="control-item">
          <label>组件数量</label>
          <div class="count-display">
            {{ canvasStore.canvasDataList.length }} 个组件
          </div>
        </div>
      </div>

      <div class="control-group">
        <h4>组件边界</h4>
        <div class="bounds-grid">
          <div class="bounds-item">
            <label>X轴范围</label>
            <span>{{ componentBounds.minX }} ~ {{ componentBounds.maxX }}</span>
          </div>
          <div class="bounds-item">
            <label>Y轴范围</label>
            <span>{{ componentBounds.minY }} ~ {{ componentBounds.maxY }}</span>
          </div>
        </div>
      </div>

      <div class="control-group">
        <h4>画布设置</h4>
        <div class="control-item">
          <label>背景颜色</label>
          <el-color-picker
            v-model="canvasBackgroundStore.background"
            @change="updateCanvasBackground"
            size="small"
          />
        </div>
        <div class="control-item">
          <label>画布透明度</label>
          <el-slider
            v-model="canvasBackgroundStore.opacity"
            @change="updateCanvasOpacity"
            :min="0"
            :max="1"
            :step="0.1"
            :show-tooltip="false"
          />
        </div>
        <div class="control-item">
          <label>最小尺寸</label>
          <div class="size-controls">
            <el-input-number
              v-model="minWidth"
              @change="updateMinSize"
              size="small"
              :min="400"
              :max="2000"
              :step="50"
              placeholder="宽度"
            />
            <span class="separator">×</span>
            <el-input-number
              v-model="minHeight"
              @change="updateMinSize"
              size="small"
              :min="300"
              :max="2000"
              :step="50"
              placeholder="高度"
            />
          </div>
        </div>
      </div>

      <div class="control-actions">
        <el-button @click="resetCanvas" size="small" type="info">
          重置画布
        </el-button>
        <el-button @click="adjustCanvas" size="small" type="primary">
          自动调整
        </el-button>
      </div>

      <div class="control-group">
        <h4>画布操作</h4>
        <div class="operation-buttons">
          <el-button @click="centerAllComponents" size="small" type="success">
            居中所有组件
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useCanvasStore } from '@/stores/canvasData';
import { useCanvasBackgroundStore } from '@/stores/canvasBackgroud';
import { ElMessage } from 'element-plus';

const canvasStore = useCanvasStore();
const canvasBackgroundStore = useCanvasBackgroundStore();

const minWidth = ref(canvasBackgroundStore.minWidth);
const minHeight = ref(canvasBackgroundStore.minHeight);

// 计算组件边界
const componentBounds = computed(() => {
  if (canvasStore.canvasDataList.length === 0) {
    return { minX: 0, minY: 0, maxX: 0, maxY: 0 };
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  canvasStore.canvasDataList.forEach(component => {
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
});

// 画布控制方法
const updateCanvasBackground = (color: string) => {
  canvasBackgroundStore.setBackground(color);
};

const updateCanvasOpacity = (opacity: number) => {
  canvasBackgroundStore.setOpacity(opacity);
};

const updateMinSize = () => {
  canvasBackgroundStore.setMinSize(minWidth.value, minHeight.value);
  ElMessage.success('最小尺寸已更新');
};

const resetCanvas = () => {
  canvasBackgroundStore.resetToMinSize();
  ElMessage.success('画布已重置到最小尺寸');
};

const adjustCanvas = () => {
  const bounds = componentBounds.value;
  const adjusted = canvasBackgroundStore.adjustCanvasSize(bounds);
  if (adjusted) {
    ElMessage.success('画布尺寸已自动调整');
  } else {
    ElMessage.info('画布尺寸无需调整');
  }
};

// 居中所有组件
const centerAllComponents = () => {
  if (canvasStore.canvasDataList.length === 0) {
    ElMessage.warning('画布上没有组件');
    return;
  }

  const bounds = componentBounds.value;
  const canvasWidth = canvasBackgroundStore.width;
  const canvasHeight = canvasBackgroundStore.height;

  const componentsWidth = bounds.maxX - bounds.minX;
  const componentsHeight = bounds.maxY - bounds.minY;

  const offsetX = (canvasWidth - componentsWidth) / 2 - bounds.minX;
  const offsetY = (canvasHeight - componentsHeight) / 2 - bounds.minY;

  canvasStore.canvasDataList.forEach(component => {
    const style = component.style || {};
    const left = parseInt(style.left || '0', 10);
    const top = parseInt(style.top || '0', 10);

    canvasStore.updateStyle({
      id: component.id,
      style: {
        ...style,
        left: `${left + offsetX}px`,
        top: `${top + offsetY}px`
      }
    });
  });

  ElMessage.success('所有组件已居中');
};
</script>

<style scoped lang="scss">
.canvas-controls {
  height: 100%;

  .panel-content {
    padding: 16px;
    height: 100%;
    overflow-y: auto;
  }

  .control-group {
    margin-bottom: 24px;

    h4 {
      margin: 0 0 12px 0;
      font-size: 14px;
      font-weight: 600;
      color: #1f2329;
      border-bottom: 1px solid #e8e9eb;
      padding-bottom: 8px;
    }
  }

  .control-item {
    margin-bottom: 16px;

    label {
      display: block;
      margin-bottom: 6px;
      font-size: 12px;
      color: #4e5969;
      font-weight: 500;
    }

    .size-display,
    .count-display {
      padding: 8px 12px;
      background: #f8f9fa;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 500;
      color: #1f2329;
    }

    .size-controls {
      display: flex;
      align-items: center;
      gap: 8px;

      .separator {
        color: #86909c;
        font-weight: 500;
      }

      .el-input-number {
        flex: 1;
      }
    }
  }

  .bounds-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;

    .bounds-item {
      padding: 8px 12px;
      background: #f8f9fa;
      border-radius: 4px;

      label {
        display: block;
        font-size: 11px;
        color: #86909c;
        margin-bottom: 4px;
      }

      span {
        font-size: 12px;
        font-weight: 500;
        color: #1f2329;
      }
    }
  }

  .control-actions,
  .operation-buttons {
    display: flex;
    gap: 8px;
    margin-top: 12px;

    .el-button {
      flex: 1;
    }
  }

  .operation-buttons {
    flex-direction: column;

    .el-button {
      margin-bottom: 8px;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>
