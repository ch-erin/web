<template>
    <div>
        <div class="project-info">
            <div class="project-title">{{ projectName }}</div>
            <div class="project-description">{{ projectDescription }}</div>
        </div>

        <!-- Toolbar -->
        <div class="toolbar">
            <div class="toolbar-actions">
                <el-button class="return-button" @click="goBack">返回</el-button>
                <el-button class="home-button" @click="goToHome">首页</el-button>
            </div>
        </div>
        <div class="content">
            <View :DataList="data" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import View from './view.vue';
import { usePreviewStore } from '@/stores/perView';

const previewStore = usePreviewStore();

const data = computed(() => {
    return previewStore.previewData || [];
});

const projectName = computed(() => {
    return previewStore.projectName || '';
});

const projectDescription = computed(() => {
    return previewStore.projectDescription || '';
});

const goBack = () => { history.back() }

const goToHome = () => {
    window.location.href = '/';
};
</script>

<style scoped lang="scss">
.project-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #f8f9fa;
    padding: 20px;
    border-bottom: 1px solid #ddd;

    .project-title {
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 10px;
    }

    .project-description {
        font-size: 14px;
        color: #6c757d;
        text-align: center;
        max-width: 80%;
        margin: 0 auto;
    }
}

.toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
    padding: 10px 20px;
    border-bottom: 1px solid #ddd;
}

.toolbar-title {
    font-size: 16px;
    font-weight: bold;
}

.toolbar-actions {
    display: flex;
    align-items: center;
    gap: 10px;
}

.return-button,
.home-button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 5px 10px;
    cursor: pointer;
    border-radius: 4px;

    &:hover {
        background-color: #0056b3;
    }
}

.content {
    padding: 10px;
    width: 1710px;
    height: 830px;
}
</style>