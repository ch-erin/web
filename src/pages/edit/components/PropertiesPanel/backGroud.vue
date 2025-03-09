<template>
    <el-card class="control-panel" header="背景设置">
        <el-form label-width="120px" label-position="top">
            <el-form-item label="颜色">
                <el-color-picker v-model="canvasBackgroundStore.background" show-alpha />
            </el-form-item>

            <el-form-item label="高度 (px)">
                <el-input-number v-model="canvasBackgroundStore.height" :min="100" :max="2000" />
            </el-form-item>

            <el-form-item label="宽度 (px)">
                <el-input-number v-model="canvasBackgroundStore.width" :min="100" :max="2000" />
            </el-form-item>

            <el-form-item label="透明度">
                <el-slider v-model="canvasBackgroundStore.opacity" :min="0" :max="1" :step="0.01" show-input />
            </el-form-item>
        </el-form>
    </el-card>
</template>

<script setup lang="ts">
import { useCanvasBackgroundStore } from '@/stores/canvasBackgroud';
const canvasBackgroundStore = useCanvasBackgroundStore();
</script>

<style scoped lang="scss">
.control-panel {
    width: 300px;
    margin-left: 10px;

    :deep(.el-card__header) {
        font-weight: bold;
        font-size: 16px;
        background-color: #f5f5f5;
        padding: 10px;
        border-bottom: 1px solid #ddd;
    }

    :deep(.el-form-item__label) {
        font-size: 14px;
        color: #333;
    }

    :deep(.el-color-picker) {
        width: 100%;
    }
}
</style>