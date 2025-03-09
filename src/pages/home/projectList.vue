<template>
    <div class="project-container">
        <el-table :data="projects" border class="project-table">
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
                        <el-button type="primary" size="small" @click="previewProject(row)">预览</el-button>
                        <el-button type="danger" size="small" @click="deleteProject(row.id)">删除</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import dayjs from "dayjs";
import { useProjectsStore } from '@/stores/projects'

const projectsStore = useProjectsStore();
const projects = ref(projectsStore.projects);

const formatDate = (date: string) => dayjs(date).format("YYYY-MM-DD HH:mm:ss");

const updateTime = (row: any) => {
    row.updateTime = dayjs().format();
    projectsStore.projects = [...projectsStore.projects];
};

//preview有待开发
const previewProject = (project: any) => {
    location.href = '/preview'
    const { } = project
};

const deleteProject = (projectId: string) => {
    projectsStore.deleteProject(projectId)
};
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