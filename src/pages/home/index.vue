<template>
  <div class="home-container">
    <!-- 顶部导航栏 -->
    <header class="header">
      <div class="logo">Cherin - LowCode</div>
      <nav class="nav">
        <router-link to="/" class="nav-link">首页</router-link>
        <router-link to="/about" class="nav-link">关于</router-link>
        <el-button type="danger" @click="logout">退出登录</el-button>
      </nav>
    </header>

    <!-- 主体内容 -->
    <main class="main-content">
      <div class="sidebar">
        <div class="sidebar-header">
          <el-button @click="gotoEdit" class="new-project-btn">
            <el-icon>
              <Plus />
            </el-icon>
            <span>新建项目</span>
          </el-button>
          <p class="hint-text">点击创建新的低代码项目</p>
        </div>
        <el-divider />
        <h3>功能菜单</h3>
        <el-menu default-active="1" class="menu">
          <el-menu-item index="1">
            <el-icon>
              <Folder />
            </el-icon>
            <span>我的项目</span>
          </el-menu-item>
          <el-menu-item index="2">
            <el-icon>
              <Setting />
            </el-icon>
            <span>系统设置</span>
          </el-menu-item>
          <el-menu-item index="3">
            <el-icon>
              <Document />
            </el-icon>
            <span>文档中心</span>
          </el-menu-item>
        </el-menu>
      </div>

      <div class="content">
        <Projects />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import router from "@/router";
import Projects from './projectList.vue'
import { useAuthStore } from "@/stores/auth";
import { Folder, Setting, Document, Plus } from "@element-plus/icons-vue";
import { logNavigationTimings } from '@/utils/performance/index'

const authStore = useAuthStore();

// 退出登录
const logout = () => {
  authStore.logout();
  router.push("/login");
};

// 跳转到编辑页面
const gotoEdit = () => {
  router.push("/edit");
};


onMounted(() => {
  logNavigationTimings()
})
</script>

<style scoped lang="scss">
.home-container {
  display: flex;
  flex-direction: column;
  height: 97vh;
  background-color: #f5f7fa;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;

  .logo {
    font-size: 1.5rem;
    font-weight: bold;
    color: #3b82f6;
  }

  .nav {
    display: flex;
    align-items: center;
    gap: 1rem;

    .nav-link {
      text-decoration: none;
      color: #4b5563;
      font-weight: 500;

      &:hover {
        color: #3b82f6;
      }
    }
  }
}

.main-content {
  display: flex;
  flex: 1;
  overflow: hidden;

  .sidebar {
    width: 240px;
    background-color: #ffffff;
    box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
    padding: 1rem;
    flex-shrink: 0;

    .sidebar-header {
      text-align: center;
      padding: 1rem 0;
    }

    h3 {
      margin-bottom: 1rem;
      font-size: 1.25rem;
      color: #374151;
    }

    .menu {
      border-right: none;
    }
  }

  .content {
    flex: 1;
    padding: 2rem;
    overflow-y: auto;
    background-color: #ffffff;
    margin: 1rem;
    border-radius: 0.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
}

.new-project-btn {
  width: 100%;
  margin-top: 1rem;
  padding: 1rem;
  font-size: 1rem;
  font-weight: 500;
  background-color: #3b82f6;
  color: white;
  border-radius: 0.75rem;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #2563eb;
  }

  &:active {
    animation: pulse 0.3s ease;
  }

  .el-icon {
    margin-right: 0.5rem;
  }
}

.hint-text {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
  text-align: center;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.05);
  }

  100% {
    transform: scale(1);
  }
}
</style>
