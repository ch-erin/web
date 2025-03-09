<template>
    <div class="range" ref="textContainer"></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

// 长文本内容
const longText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
  Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
  Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;

// 将长文本分割为小段
const chunkSize = 20; // 每段字符的长度
const chunks = longText.match(new RegExp(`.{1,${chunkSize}}`, "g")) || [];

// 容器引用
const textContainer = ref<HTMLElement | null>(null);

onMounted(() => {
    if (textContainer.value) {
        for (const chunk of chunks) {
            const textNode = document.createTextNode(chunk);
            textContainer.value.appendChild(textNode);
        }
    }
});
</script>

<style scoped lang="scss">
.range {
    border: 1px solid purple;
    padding: 10px;
    line-height: 1.5;
}
</style>