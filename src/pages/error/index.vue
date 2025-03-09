<template>
    <div class="not-found">
        <div class="content">
            <h1 class="title">404</h1>
            <p class="message">Oops! 你访问的页面不存在</p>
            <el-button type="primary" @click="goHome">返回首页</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

const goHome = () => {
    router.push("/");
};
</script>

<style scoped lang="scss">
.not-found {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: linear-gradient(135deg, #f6f9fc, #eef1f5);
    text-align: center;
}

.content {
    animation: fadeIn 1s ease-in-out;
}

.title {
    font-size: 6rem;
    font-weight: bold;
    color: #2c3e50;
}

.message {
    font-size: 1.5rem;
    color: #7f8c8d;
    margin-bottom: 20px;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>