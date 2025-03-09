<template>
    <div class="json-view">
        <div class="json-header">
            <button class="copy-button" @click="copyJson">复制 JSON</button>
        </div>
        <pre>{{ formattedJson }}</pre>
    </div>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue';
import { ElMessage } from 'element-plus'
const props = defineProps({
    jsonData: {
        type: String,
        default: '{}'
    }
});

const formattedJson = computed(() => {
    try {
        const parsedJson = JSON.parse(props.jsonData);
        return JSON.stringify(parsedJson, null, 2);
    } catch (error) {
        return props.jsonData;
    }
});

const copyJson = async () => {
    try {
        await navigator.clipboard.writeText(formattedJson.value);
        ElMessage({
            message: `json已复制`,
            type: 'success'
        });
    } catch (error) {
        ElMessage({
            message: `复制失败`,
            type: 'error'
        });
    }
};
</script>

<style scoped>
.json-view {
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    padding: 10px;
    border-radius: 4px;
    overflow: auto;
}

.json-header {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 10px;
}

.copy-button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 5px 10px;
    cursor: pointer;
    border-radius: 4px;
    font-size: 14px;
}

.copy-button:hover {
    background-color: #0056b3;
}

pre {
    font-family: 'Courier New', Courier, monospace;
    white-space: pre-wrap;
}
</style>