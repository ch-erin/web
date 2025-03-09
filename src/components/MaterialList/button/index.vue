<template>
  <button class="v-button">
    {{ propValue }}
  </button>
</template>

<script setup lang="ts">
defineProps<{
  propValue: string;
  label: string;
  icon: string;
}>();
</script>

<style scoped>
.v-button {
  width: 90%;
  padding: 0 20px;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.5;
  text-align: center;
  color: #ffffff;
  background-color: #409eff;
  border: 1px solid #0a76e9;
  outline: none;
}
</style>
