import { defineStore } from 'pinia';

export const usePreviewStore = defineStore('preview', {
    state: () => ({
        previewData: null as any[] | null, // 预览数据
        projectName: '' as string,        // 项目名称
        projectDescription: '' as string  // 项目介绍
    }),

    actions: {
        // 设置预览数据
        setPreviewData(data: any[]) {
            this.previewData = data;
        },

        // 清除预览数据
        clearPreviewData() {
            this.previewData = null;
        },

        // 设置项目名称
        setProjectName(name: string) {
            this.projectName = name;
        },

        // 设置项目介绍
        setProjectDescription(description: string) {
            this.projectDescription = description;
        },

        // 清除项目信息
        clearProjectInfo() {
            this.projectName = '';
            this.projectDescription = '';
        }
    }
});