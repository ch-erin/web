<template>
  <div class="properties-panel">
    <!-- Tab 切换 -->
    <el-tabs v-model="activeTab" class="panel-tabs">
      <!-- 组件属性 Tab -->
      <el-tab-pane label="组件属性" name="component" :disabled="!selectedComponent">
        <ComponentProperties />
      </el-tab-pane>

      <!-- 画布控制 Tab -->
      <el-tab-pane label="画布控制" name="canvas">
        <CanvasControls />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useCanvasStore } from '@/stores/canvasData';
import ComponentProperties from './ComponentProperties.vue';
import CanvasControls from './CanvasControls.vue';

const canvasStore = useCanvasStore();
const activeTab = ref('component');

// 获取当前选中的组件
const selectedComponent = computed(() => canvasStore.curComponent);

// 监听选中组件变化，智能切换tab
watch(selectedComponent, (newComponent, oldComponent) => {
  if (newComponent) {
    // 选中了组件，切换到组件属性tab
    activeTab.value = 'component';
  } else if (oldComponent && !newComponent) {
    // 从选中组件变为未选中（点击画布），切换到画布控制tab
    activeTab.value = 'canvas';
  }
});
</script>
<style scoped lang="scss">
.properties-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
}

// Tab样式
.panel-tabs {
  height: 100%;

  :deep(.el-tabs__header) {
    margin: 0;
    border-bottom: 1px solid #e8e9eb;
  }

  :deep(.el-tabs__nav-wrap) {
    padding: 0 16px;
  }

  :deep(.el-tabs__content) {
    height: calc(100% - 40px);
    overflow: hidden;
  }

  :deep(.el-tab-pane) {
    height: 100%;
  }
}
</style>
