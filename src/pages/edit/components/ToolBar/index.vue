<template>
    <el-header class="topbar">
        <div class="topbar-left">
            <el-button @click="handleJsonDialog">查看 JSON</el-button>
            <el-button @click="clearCanvas">清空画布</el-button>
            <el-button @click="handleExport">导出</el-button>
            <el-button @click="handleImport">导入</el-button>
            <input
                ref="fileInput"
                type="file"
                accept=".json"
                @change="handleFileImport"
                style="display: none;"
            />
            <el-button @click="goToPreview">预览</el-button>
            <el-button @click="undo">撤销</el-button>
            <el-button @click="redo">重做</el-button>
            <el-button @click="saveCanvas">保存</el-button>
            <el-button @click="lockSelectedComponent">锁定</el-button>
            <el-button @click="unlockSelectedComponent">解锁</el-button>
            <el-button @click="showGenerateProjectDialog">生成项目</el-button>
        </div>

        <div class="topbar-right">
            <el-button type="primary" @click="goHome">返回首页</el-button>
        </div>
    </el-header>

    <!-- JSON 视图弹窗 -->
    <el-dialog title="JSON 视图" v-model="showJsonDialog">
        <jsonView :jsonData="jsonData" />
    </el-dialog>

    <ProjectDialog v-model="showGenerateDialog" :initial-project-name="projectName"
        :initial-project-description="projectDescription" @confirm="generateProject" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useCanvasStore } from "@/stores/canvasData";
import { usePreviewStore } from "@/stores/perView";
import { useProjectsStore } from "@/stores/projects";
import jsonView from "./dialog/jsonView.vue";
import ProjectDialog from './dialog/porjectView.vue';
import { ElMessage } from "element-plus";

const canvasStore = useCanvasStore();
const previewStore = usePreviewStore();
const projectsStore = useProjectsStore();
const router = useRouter();

const showJsonDialog = ref(false);
const jsonData = ref("");
const showGenerateDialog = ref(false);
const projectName = ref("默认项目名称");
const projectDescription = ref("默认项目介绍");
const fileInput = ref<HTMLInputElement | null>(null);

// 处理查看 JSON 弹窗
const handleJsonDialog = () => {
    showJsonDialog.value = !showJsonDialog.value;
    jsonData.value = canvasStore.getJsonData();
};

// 清空画布
const clearCanvas = () => {
    canvasStore.clearCanvasData();
};

// 导出画布数据为 JSON
const handleExport = () => {
    const data = canvasStore.getJsonData();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const name = `canvas-data-${new Date().toISOString()}`;
    a.download = `${name}.json`;
    a.click();
    URL.revokeObjectURL(url);
};

// 锁定选中组件
const lockSelectedComponent = () => {
    const selectedId = canvasStore.selectedId;
    if (!selectedId) return;

    const component = canvasStore.canvasDataList.find(item => item.id === selectedId);
    if (component) {
        component.isLock = true;
        canvasStore.updateStore();
        ElMessage({
            message: `组件 ${selectedId} 已锁定`,
            type: 'success'
        });
    } else {
        ElMessage.error('未找到选中的组件');
    }
};

// 解锁选中组件
const unlockSelectedComponent = () => {
    const selectedId = canvasStore.selectedId;
    if (!selectedId) return;

    const component = canvasStore.canvasDataList.find(item => item.id === selectedId);
    if (component) {
        component.isLock = false;
        canvasStore.updateStore();
        ElMessage({
            message: `组件 ${selectedId} 已解锁`,
            type: 'success'
        });
    } else {
        ElMessage.error('未找到选中的组件');
    }
};

// 返回首页
const goHome = () => {
    router.push("/");
};

// 保存画布数据
const saveCanvas = () => {
    canvasStore.saveCanvasData();
    ElMessage({
        message: "画布数据已保存",
        type: "success",
    });
};

// 快捷键监听
const handleKeyDown = (event: KeyboardEvent) => {
    if ((event.ctrlKey && event.key.toLowerCase() === 's') || (event.metaKey && event.key.toLowerCase() === 's')) {
        event.preventDefault();
        saveCanvas();
    }
};

// 撤销操作
const undo = () => {
    canvasStore.undo();
};

// 重做操作
const redo = () => {
    canvasStore.redo();
};

// 进入预览页面
const goToPreview = () => {
    previewStore.setPreviewData(canvasStore.canvasDataList);
    router.push('/preview');
};

// 显示生成项目弹窗
const showGenerateProjectDialog = () => {
    showGenerateDialog.value = true;
};

// 生成项目
const generateProject = (projectData: { name: string; description: string }) => {
    const { name, description } = projectData;
    if (!name.trim()) {
        ElMessage.error("项目名称不能为空");
        return;
    }

    const project = {
        name,
        description,
        data: canvasStore.canvasDataList,
        createdAt: new Date().toISOString()
    } as any

    projectsStore.addProject(project);
    ElMessage({
        message: "项目已生成并保存",
        type: "success"
    });
};

// 触发文件选择
const handleImport = () => {
    fileInput.value?.click();
};

// 处理文件导入
const handleFileImport = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (!file) return;

    if (!file.name.endsWith('.json')) {
        ElMessage.error('请选择JSON格式的文件');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const content = e.target?.result as string;
            const data = JSON.parse(content);

            // 验证数据格式
            if (!Array.isArray(data)) {
                ElMessage.error('文件格式不正确，请选择有效的画布数据文件');
                return;
            }

            // 导入数据
            canvasStore.setJsonData(content);
            ElMessage({
                message: "数据导入成功",
                type: "success"
            });

        } catch (error) {
            ElMessage.error('文件解析失败，请检查文件格式');
        }
    };

    reader.readAsText(file);

    // 清空input值，允许重复选择同一文件
    target.value = '';
};



onMounted(() => {
    document.addEventListener('keydown', handleKeyDown);
});
onUnmounted(() => {
    document.removeEventListener('keydown', handleKeyDown);
});
</script>

<style scoped lang="scss">
.topbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    background-color: #fff;
    border-bottom: 1px solid #ddd;

    .topbar-left {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .topbar-right {
        display: flex;
        align-items: center;
    }
}
</style>