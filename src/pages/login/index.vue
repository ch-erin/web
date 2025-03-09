<template>
  <div class="login-container">
    <div class="login-card">
      <header class="card-header">
        <h1 class="app-title">Cherin - LowCode</h1>
      </header>

      <el-form ref="loginForm" :model="formData" :rules="validationRules" @submit.prevent="handleSubmit"
        class="auth-form">
        <div class="form-content">
          <!-- 用户名输入 -->
          <el-form-item prop="username">
            <el-input v-model="formData.username" placeholder="请输入用户名" size="large" :prefix-icon="User" clearable />
          </el-form-item>
          <!-- 密码输入 -->
          <el-form-item prop="password">
            <el-input v-model="formData.password" placeholder="请输入密码" type="password" size="large" :prefix-icon="Lock"
              show-password />
          </el-form-item>

          <!-- 提交按钮 -->
          <el-button native-type="submit" type="primary" size="large" class="submit-btn">
            立即登录
          </el-button>
        </div>
      </el-form>

      <footer class="card-footer">
        <span class="footer-text">新用户？</span>
        <!-- <router-link to="/register" class="action-link">创建账户</router-link> -->
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { User, Lock } from "@element-plus/icons-vue";
import { ElMessage, type FormInstance } from "element-plus";
import { useAuthStore } from "@/stores/auth";
import { validateCredentials } from "@/utils/auth/validators";
import router from "@/router";

// 状态管理
const authStore = useAuthStore();

// 表单相关
const loginForm = ref<FormInstance>();
const formData = ref({
  username: "",
  password: "",
});

// 验证规则
const validationRules = {
  username: [{ validator: validateCredentials.username, trigger: "blur" }],
  password: [{ validator: validateCredentials.password, trigger: "blur" }],
};

// 提交处理
const handleSubmit = async () => {
  try {
    await loginForm.value?.validate();
    await authStore.login(formData.value);
    gotoHome();
    ElMessage.success("欢迎回来！");
  } catch (error) {
    handleError(error);
  }
};

// 错误处理
const handleError = (error: unknown) => {
  const message =
    error instanceof Error ? error.message : "登录失败，请检查网络连接";
  ElMessage.error(message);
};

//登陆成功后跳转到首页
const gotoHome = () => {
  router.push("/");
};
</script>

<style lang="scss" scoped>
// 颜色
$primary: #409eff;
$primary-dark: #427cf8;
$secondary: #8b5cf6;
$gray-600: #4b5563;
$gray-800: #1f2937;
$white: #ffffff;

// 阴影
$shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
$shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
$shadow-lg: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
$shadow-outline: 0 0 0 3px rgb(59 130 246 / 0.5);

// 圆角
$rounded-sm: 0.375rem;
$rounded-md: 0.75rem;
$rounded-lg: 1.25rem;

// 间距
$spacing-1: 0.25rem;
$spacing-2: 0.5rem;
$spacing-3: 0.75rem;
$spacing-4: 1rem;
$spacing-5: 1.25rem;
$spacing-6: 1.5rem;

// 字体
$font-size-sm: 0.875rem;
$font-size-base: 1rem;
$font-size-lg: 1.25rem;
$font-size-xl: 1.5rem;
$font-size-2xl: 1.75rem;

// 过渡
$transition-duration: 0.2s;
$transition-timing: ease;

.login-container {
  height: 100vh;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, $primary 0%, $secondary 100%);
  padding: 1rem;
}

.login-card {
  width: 100%;
  max-width: 28rem;
  background: white;
  border-radius: 1.5rem;
  box-shadow: $shadow-lg;
  padding: 2.5rem;
  box-sizing: border-box;

  .card-header {
    text-align: center;
    margin-bottom: 2rem;

    .app-title {
      margin: 0;
      font-size: 1.75rem;
      font-weight: 600;
      color: $gray-800;
      letter-spacing: -0.025em;
    }
  }

  .auth-form {
    .form-content {
      display: grid;
      gap: 1.5rem;

      :deep(.el-input__wrapper) {
        border-radius: 0.75rem;
        padding: 0.875rem 1rem;
        box-shadow: $shadow-sm;
        border: #dadee4 solid 1px;

        &:hover {
          box-shadow: $shadow-md;
        }

        &.is-focus {
          box-shadow: $shadow-outline;
        }
      }
    }

    .submit-btn {
      width: 100%;
      border-radius: 0.75rem;
      padding: 1rem;
      font-weight: 500;
      letter-spacing: 0.025em;
      transition: all 0.2s ease;
      color: #000;
    }
  }

  .card-footer {
    margin-top: 2rem;
    text-align: center;
    font-size: 0.875rem;
    color: $gray-600;

    .action-link {
      color: $primary;
      font-weight: 500;
      margin-left: 0.5rem;
      text-decoration: none;

      &:hover {
        color: $primary-dark;
        text-decoration: underline;
      }
    }
  }
}
</style>
