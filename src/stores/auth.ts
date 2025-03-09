import { defineStore } from 'pinia'
import axios from 'axios'
import type { LoginForm } from '@/types/auth'
import { API_URLS } from '@/api/auth'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: localStorage.getItem('token') || '',
        user: null as null | { username: string }
    }),

    getters: {
        isAuthenticated: (state) => !!state.token
    },

    actions: {
        async login(credentials: LoginForm) {
            try {
                const response = await axios.post(API_URLS.login, credentials)
                const { token, user } = response.data

                // 更新状态
                this.token = token || ''
                this.user = user

                // 持久化 token
                localStorage.setItem('token', token)

                // 设置 axios 默认请求头
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
            } catch (error) {
                throw new Error('登录失败，请检查用户名和密码')
            }
        },

        logout() {
            // 清除状态
            this.token = ''
            this.user = null

            // 移除持久化 token
            localStorage.removeItem('token')

            // 移除 axios 默认请求头
            delete axios.defaults.headers.common['Authorization']
        }
    }
})