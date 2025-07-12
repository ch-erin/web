<template>
    <div class="project-container">
        <el-table :data="projectsDataList" border class="project-table">
            <el-table-column prop="name" label="名称" width="200">
                <template #default="{ row }">
                    <el-input v-model="row.name" @input="updateTime(row)" />
                </template>
            </el-table-column>

            <el-table-column prop="createTime" label="创建时间" width="180">
                <template #default="{ row }">
                    {{ formatDate(row.createTime) }}
                </template>
            </el-table-column>

            <el-table-column prop="updateTime" label="更改时间" width="180">
                <template #default="{ row }">
                    {{ formatDate(row.updateTime) }}
                </template>
            </el-table-column>

            <el-table-column prop="description" label="项目介绍" min-width="250">
                <template #default="{ row }">
                    <el-input v-model="row.description" type="textarea" autosize @input="updateTime(row)" />
                </template>
            </el-table-column>

            <el-table-column label="操作" width="180">
                <template #default="{ row }">
                    <div class="action-buttons">
                        <el-button type="primary" size="small" @click="previewProject()">预览</el-button>
                        <el-button type="danger" size="small" @click="deleteProject(row.id)">删除</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <el-button type="primary" @click="handleInitProjects">新增项目</el-button>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import dayjs from "dayjs";
import { useProjectsStore } from '@/stores/projects';
import {
    ElTable,
    ElTableColumn,
    ElInput,
    ElButton
} from "element-plus";


const projectsStore = useProjectsStore();
const projectsDataList = ref<any[]>([]);

// 监听 projectsStore.projects 的变化并更新 projectsDataList
watch(() => projectsStore.projects, (newProjects) => {
    projectsDataList.value = newProjects.map(project => ({
        id: project.id,
        name: project.name,
        description: project.description,
        createTime: project.createdAt,
        updateTime: project.updateTime || dayjs().format(), // 如果没有 updateTime，则设置为当前时间
        componentData: project.componentData
    }));
}, { immediate: true });

const formatDate = (date: string) => dayjs(date).format("YYYY-MM-DD HH:mm:ss");

const updateTime = (row: any) => {
    const index = projectsStore.projects.findIndex(p => p.id === row.id);
    if (index !== -1) {
        projectsStore.projects[index].updateTime = dayjs().format();
    }
};

const previewProject = () => {
    location.href = '/preview';
};

const deleteProject = (projectId: string) => {
    projectsStore.deleteProject(projectId);
};

const handleInitProjects = () => {
    projectsStore.initProjects();
};

onMounted(() => {
    projectsStore.getAllProjects(); // 确保在页面加载时获取所有项目数据
});
</script>

<style scoped lang="scss">
.project-container {
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: 15px;
    overflow: auto;
}

.project-table {
    flex: 1;
    min-width: 100%;
}

.action-buttons {
    display: flex;
    justify-content: center;
    gap: 8px;
}

.el-button {
    margin: 0;
}
</style>