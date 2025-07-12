import { defineStore } from 'pinia';
import axios from 'axios';
import { json_urls } from '@/api/auth';

const { Create, Update, Delete, Get, GetAll } = json_urls;

export const useProjectsStore = defineStore('projects', {
    state: () => ({
        projects: [] as {
            id: string;
            name: string;
            description: string;
            createdAt: string;
            updateTime: string;
            componentData: any;
        }[]
    }),

    actions: {
        // 添加新项目
        async addProject(project: { name: string; description: string; componentData: any }) {
            const newProject = {
                "projectId": this.generateId(),
                "projectData": {
                    name: project.name,
                    description: project.description,
                    createdAt: new Date().toISOString(),
                    componentData: project.componentData
                }
            };

            try {
                const response = await axios.post(Create, newProject);
                console.log('Project created successfully:', response.data);
                this.projects.push(response.data); // 更新本地状态
            } catch (error) {
                console.error('Error creating project:', error);
                throw error;
            }
        },

        // 更新项目
        async updateProject(projectId: string, projectData: { name: string; description: string; componentData: any }) {
            const updatedProject = {
                "projectId": projectId,  // 传递需要更新的项目 ID
                "projectData": projectData // 传递更新的项目数据
            };

            try {
                const response = await axios.post(Update, updatedProject);
                console.log('Project updated successfully:', response.data);

                // 更新本地状态
                const index = this.projects.findIndex(project => project.id === projectId);
                if (index !== -1) {
                    this.projects[index] = { ...this.projects[index], ...projectData }; // 合并更新的项目数据
                }
            } catch (error) {
                console.error('Error updating project:', error);
                throw error;
            }
        },

        // 删除项目
        async deleteProject(projectId: string) {
            const projectToDelete = {
                projectId  // 只需要 projectId 来标识需要删除的项目
            };

            try {
                const response = await axios.post(Delete, projectToDelete);  // 删除请求
                console.log('Project deleted successfully:', response.data);

                // 更新本地状态
                this.projects = this.projects.filter(project => project.id !== projectId);
            } catch (error) {
                console.error('Error deleting project:', error);
                throw error;
            }
        },

        // 获取项目
        async getProject(projectId: string) {
            try {
                const response = await axios.post(Get, { projectId });
                console.log('Project fetched successfully:', response.data);

                // 查找并返回项目数据
                const project = response.data;
                return project;
            } catch (error) {
                console.error('Error fetching project:', error);
                throw error;
            }
        },

        // 初始化项目数据
        async initProjects() {
            try {
                const response = await this.getAllProjects()
                this.projects = response.data || [];
            } catch (error) {
                console.error('Error initializing projects:', error);
                throw error;
            }
        },

        // 获取所有项目
        async getAllProjects() {
            try {
                const response = await axios.get(GetAll);
                return response.data;
            } catch (error) {
                console.error('Error fetching all projects:', error);
                throw error;
            }
        },

        // 生成项目 ID
        generateId(): string {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let result = '';
            const length = 16;
            for (let i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            return result;
        }
    }
});
