<template>
    <el-card class="tab-panel">
        <el-tabs v-model="activeTab" style="height: 100%;">
            <el-tab-pane name="properties" label="属性">
                <div class="tab-content">
                    <template v-if="selectedComponent">
                        <el-form label-width="80px">
                            <!-- 现有的表单项 -->
                            <el-form-item label="X 坐标">
                                <el-input-number v-model="componentStyle.left" :min="0" :step="1" suffix="px" />
                            </el-form-item>
                            <el-form-item label="Y 坐标">
                                <el-input-number v-model="componentStyle.top" :min="0" :step="1" suffix="px" />
                            </el-form-item>
                            <el-form-item label="宽度">
                                <el-input-number v-model="componentStyle.width" :min="0" :step="1" suffix="px" />
                            </el-form-item>
                            <el-form-item label="高度">
                                <el-input-number v-model="componentStyle.height" :min="0" :step="1" suffix="px" />
                            </el-form-item>
                            <el-form-item label="参数">
                                <el-input v-model="componentStyle.propValue" placeholder="请输入" />
                            </el-form-item>
                        </el-form>
                    </template>
                    <p v-else>未选择组件</p>
                </div>
            </el-tab-pane>

            <el-tab-pane name="events" label="事件">
                <div class="tab-content">
                    <p>事件相关的配置和控制项可以放在这里。</p>
                </div>
            </el-tab-pane>
        </el-tabs>

        <!-- 对齐操作下拉按钮 -->
        <div class="align-dropdown">
            <el-dropdown @command="handleAlignCommand">
                <el-button type="primary">
                    对齐操作
                </el-button>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="alignLeft">左对齐</el-dropdown-item>
                        <el-dropdown-item command="alignRight">右对齐</el-dropdown-item>
                        <el-dropdown-item command="alignTop">顶对齐</el-dropdown-item>
                        <el-dropdown-item command="alignBottom">底对齐</el-dropdown-item>
                        <el-dropdown-item command="alignCenterHorizontal">水平居中</el-dropdown-item>
                        <el-dropdown-item command="alignCenterVertical">垂直居中</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </el-card>
</template>


<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import { useCanvasStore } from "@/stores/canvasData";

const canvasStore = useCanvasStore();
const selectedId = computed(() => canvasStore.selectedId);

const selectedComponent = computed(() =>
    selectedId.value ? canvasStore.canvasDataList.find(item => item.id === selectedId.value) || null : null
);

const componentStyle = reactive({
    left: 0,
    top: 0,
    width: 100,
    height: 100,
    fontSize: 14,
    color: "#000000",
    backgroundColor: "#ffffff",
    borderColor: "#000000",
    borderRadius: 0,
    rotate: 0,
    propValue: ""
});

watch(selectedComponent, (newComponent) => {
    if (newComponent && newComponent.style) {
        Object.assign(componentStyle, {
            left: parseInt(newComponent.style.left || "0", 10),
            top: parseInt(newComponent.style.top || "0", 10),
            width: parseInt(newComponent.style.width || "100", 10),
            height: parseInt(newComponent.style.height || "100", 10),
            fontSize: parseInt(newComponent.style.fontSize || "14", 10),
            color: newComponent.style.color || "#000000",
            backgroundColor: newComponent.style.backgroundColor || "#ffffff",
            borderColor: newComponent.style.borderColor || "#000000",
            borderRadius: parseInt(newComponent.style.borderRadius || "0", 10),
            rotate: parseInt(newComponent.style.rotate || "0", 10),
            propValue: newComponent.attrs?.propValue || ""
        });
    }
}, { immediate: true });

watch(componentStyle, () => {
    if (selectedComponent.value) {
        canvasStore.updateStyle({
            id: selectedComponent.value.id,
            style: {
                ...selectedComponent.value.style,
                ...componentStyle,
                left: `${componentStyle.left}px`,
                top: `${componentStyle.top}px`,
                width: `${componentStyle.width}px`,
                height: `${componentStyle.height}px`,
                fontSize: `${componentStyle.fontSize}px`,
                borderRadius: `${componentStyle.borderRadius}px`,
                transform: `rotate(${componentStyle.rotate}deg)`
            },
            attrs: {
                ...selectedComponent.value.attrs,
                propValue: componentStyle.propValue
            }
        });
    }
}, { deep: true });

const activeTab = ref("properties");

const handleAlignCommand = (command: string) => {
    switch (command) {
        case "alignLeft":
            componentStyle.left = 0;
            break;
        case "alignRight":
            componentStyle.left = parentWidth - componentStyle.width;
            break;
        case "alignTop":
            componentStyle.top = 0;
            break;
        case "alignBottom":
            componentStyle.top = parentHeight - componentStyle.height;
            break;
        case "alignCenterHorizontal":
            componentStyle.left = (parentWidth - componentStyle.width) / 2;
            break;
        case "alignCenterVertical":
            componentStyle.top = (parentHeight - componentStyle.height) / 2;
            break;
    }
};

const parentWidth = 1500;
const parentHeight = 1200; 
</script>


<style scoped lang="scss">
.tab-panel {
    width: 300px;
    height: 100%;
    display: flex;
    flex-direction: column;

    :deep(.el-card__header) {
        font-weight: bold;
        font-size: 16px;
        background-color: #f5f5f5;
        padding: 10px;
        border-bottom: 1px solid #ddd;
    }

    .tab-content {
        padding: 20px;
        height: 100%;
        overflow-y: auto;
    }
}

.align-dropdown {
    margin-top: 20px;
    text-align: center;
}
</style>