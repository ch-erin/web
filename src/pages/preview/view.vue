<template>
    <div class="preview-container">
        <component v-for="item in DataList" :key="item.id" :is="item.component"
            v-bind="{ ...item.props, ...item.attrs }" :style="item.style" />
    </div>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue'
import { getRealComponent } from '@/utils/map/index'

const props = defineProps<{ DataList: any[] }>()
const DataList = computed(() => {
    return props.DataList.map(item => {
        const realComponent = getRealComponent(item)
        return realComponent || item;
    })
})
</script>

<style scoped lang="scss">
.preview-container {
    position: relative;
    padding: 20px;
    /* 添加内边距 */
    border-radius: 12px;
    /* 圆角边框 */
    border: 2px solid #e0e0e0;
    /* 边框颜色和宽度 */
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    /* 阴影效果 */
    background: linear-gradient(135deg, #ffffff, #f9f9f9);
    /* 渐变背景 */
    transition: all 0.3s ease;
    /* 平滑过渡效果 */
    width: 100%;
    height: 100%;

    &:hover {
        box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
        /* 鼠标悬停时增强阴影 */
        transform: translateY(-5px);
        /* 鼠标悬停时轻微上移 */
    }
}
</style>