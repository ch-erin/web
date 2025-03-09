<template>
  <div>
    <el-tabs type="border-card" tab-position="left" style="height: 240px" stretch>
      <el-tab-pane v-for="tab in tabs" :key="tab.name" :label="tab.name">
        <div>
          <component-renderer :elements="tab.items"></component-renderer>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { elementsList, textList, imageList, iconList } from "./componentData";
import ComponentRenderer from "./ComponentRenderer.vue";

const tabElementList = elementsList;
const tabTextList = textList;
const tabIconList = iconList;
const tabImageList = imageList;

const tabs = reactive([
  {
    name: "组件",
    items: tabElementList,
  },
  {
    name: "文本",
    items: tabTextList,
  },
  {
    name: "图标",
    items: tabIconList,
  },
  {
    name: "图片",
    items: tabImageList
  }
]);
</script>

<style scoped lang="scss">
.el-tabs--left {
  .el-tabs__header.is-left {
    margin-right: 0;
  }

  .el-tabs__nav-wrap.is-left {
    background-color: #f5f5f5;
    border-radius: 4px 0 0 4px;
  }

  .el-tabs__item.is-left {
    width: 150px;
    text-align: left;
    padding-left: 15px;
    color: #333;
    background-color: #f5f5f5;
    border: none;
    border-radius: 4px 0 0 4px;
    margin-bottom: 8px;
    transition: background-color 0.3s;

    &:hover {
      background-color: #e5e5e5;
    }
  }

  .el-tabs__item.is-left.is-active {
    color: #ffffff;
    background-color: #007bff;
    font-weight: bold;
  }

  .el-tabs__content {
    padding: 20px;
    background-color: #ffffff;
    box-shadow: -5px 0px 5px rgba(0, 0, 0, 0.1);
    border-radius: 0 4px 4px 0;
    overflow-y: auto;
  }

  :deep(.v-button),
  :deep(.v-text),
  :deep(.v-input) {
    display: block;
    width: 100%;
    box-sizing: border-box;
    transition: all 0.3s;

    &.v-button:hover {
      background-color: #0062cc;
    }
  }
}
</style>
