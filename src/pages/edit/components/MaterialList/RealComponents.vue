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
import { computed } from "vue";
import { useCanvasStore } from "@/stores/canvasData";

const canvasStore = useCanvasStore();

// 使用计算属性确保响应性
const canvasDataList = computed(() => canvasStore.canvasDataList);
const selectedId = computed(() => canvasStore.selectedId);

// 获取当前选中组件的索引
const curComponentIndex = computed(() => {
    return canvasDataList.value.findIndex(item => item.id === selectedId.value);
});

// 上移组件
const moveUp = (index: number) => {
    if (index > 0) {
        canvasStore.pushHistory(); // 保存历史状态
        const temp = canvasDataList.value[index];
        canvasDataList.value[index] = canvasDataList.value[index - 1];
        canvasDataList.value[index - 1] = temp;
        canvasStore.updateStore();
    }
};

// 下移组件
const moveDown = (index: number) => {
    if (index < canvasDataList.value.length - 1) {
        canvasStore.pushHistory(); // 保存历史状态
        const temp = canvasDataList.value[index];
        canvasDataList.value[index] = canvasDataList.value[index + 1];
        canvasDataList.value[index + 1] = temp;
        canvasStore.updateStore();
    }
};

// 删除组件
const deleteComponent = (index: number) => {
    const componentId = canvasDataList.value[index].id;
    canvasStore.deleteCanvasData(componentId);
};

// 设置当前选中的组件
const setCurComponent = (index: number) => {
    const componentId = canvasDataList.value[index].id;
    canvasStore.selectCanvasData(componentId);
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