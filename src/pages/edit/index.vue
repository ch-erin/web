<template>
  <div class="editor-container">
    <!-- 顶部工具栏区域 -->
    <header class="editor-toolbar">
      <ToolBar />
    </header>

    <!-- 主编辑区域 -->
    <main class="editor-main">
      <!-- 左侧组件面板 -->
      <section class="editor-left">
        <MaterialList />
      </section>

      <!-- 中间画布区域 -->
      <section class="editor-center" ref="renderCanvas">
        <Canvas />
      </section>

      <!-- 右侧属性面板 -->
      <section class="editor-right">
        <PropertiesPanel />
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import ToolBar from './components/ToolBar/index.vue'
import Canvas from "../edit/components/PosterRender/index.vue";
import MaterialList from "./components/MaterialList/index.vue";
import PropertiesPanel from './components/PropertiesPanel/index.vue'
import { logNavigationTimings } from '@/utils/performance/index'


const renderCanvas = ref<HTMLElement | null>(null);

onMounted(() => {
  logNavigationTimings();
});
</script>

<style scoped lang="scss">
.editor-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f0f2f5;

  .editor-toolbar {
    height: 52px;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    border-bottom: 1px solid #e9c5c5;
  }

  .editor-main {
    flex: 1;
    display: flex;
    overflow: hidden;

    section {
      background: #fff;
      border-radius: 4px;
      box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    }

    .editor-left {
      width: 336px;
      overflow: auto;
      padding: 12px;
      border-right: 1px solid #e9c5c5;
      border-bottom: 1px solid #e9c5c5;
    }

    .editor-center {
      flex: 1;
      overflow: hidden;
      margin: 15px;
      border: 1px dashed #ddd;
      background: #fafafa;
    }

    .editor-right {
      width: 340px;
      overflow: auto;
      padding: 12px;
      border-left: 1px solid #e9c5c5;
      border-bottom: 1px solid #e9c5c5;
    }
  }
}
</style>
