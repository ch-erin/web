<template>
    <div class="real-time-component-list">
        <div v-for="(item, index) in canvasDataList" :key="item.id" class="list"
            :class="{ actived: index === curComponentIndex }" @click="setCurComponent(index)">
            <span class="component-name">{{ item.name }} : {{ item.id }}</span>
            <div class="icon-container">
                <span class="iconfont icon-shangyi" @click.stop="moveUp(index)"></span>
                <span class="iconfont icon-xiayi" @click.stop="moveDown(index)"></span>
                <span class="iconfont icon-shanchu" @click.stop="deleteComponent(index)"></span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useCanvasStore } from "@/stores/canvasData";

const canvasStore = useCanvasStore();
const canvasDataList = ref(canvasStore.canvasDataList); // 使用 ref 包装以确保响应性
const curComponentIndex = ref(-1); // 当前选中的组件索引

// 上移组件
const moveUp = (index: number) => {
    if (index > 0) {
        const temp = canvasDataList.value[index];
        canvasDataList.value[index] = canvasDataList.value[index - 1];
        canvasDataList.value[index - 1] = temp;
        canvasStore.canvasDataList = [...canvasDataList.value]; // 更新 Vuex 状态
    }
};

// 下移组件
const moveDown = (index: number) => {
    if (index < canvasDataList.value.length - 1) {
        const temp = canvasDataList.value[index];
        canvasDataList.value[index] = canvasDataList.value[index + 1];
        canvasDataList.value[index + 1] = temp;
        canvasStore.canvasDataList = [...canvasDataList.value]; // 更新 Vuex 状态
    }
};

// 删除组件
const deleteComponent = (index: number) => {
    canvasDataList.value.splice(index, 1);
    canvasStore.canvasDataList = [...canvasDataList.value]; // 更新 Vuex 状态
};

// 设置当前选中的组件
const setCurComponent = (index: number) => {
    curComponentIndex.value = index;
};
</script>

<style lang="scss" scoped>
.real-time-component-list {
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
    border: 1px solid #ddd;
    border-radius: 4px;
    overflow: hidden;

    .list {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 12px;
        cursor: pointer;
        font-size: 14px;
        border-bottom: 1px solid #f5f5f5;

        &:hover {
            background-color: #f5f5f5;
        }

        .component-name {
            flex: 1;
            margin-right: 10px;
        }

        .component-id {
            text-align: right;
        }

        .icon-container {
            display: flex;
            gap: 8px;

            .iconfont {
                cursor: pointer;
                font-size: 16px;
                color: #666;

                &:hover {
                    color: #409eff;
                }
            }
        }
    }

    .actived {
        background-color: #ecf5ff;
        color: #409eff;
    }
}
</style>