<template>
  <input class="v-input" type="text" :placeholder="propValue" />
</template>

<script setup lang="ts">
defineProps<{
  propValue: string;
  label: string;
  icon: string;
}>();
</script>

<style scoped>
.v-input {
  width: 100%;
  height: 100%;
  padding: 0 10px;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.5;
  text-align: left;
  color: #333333;
  background-color: #ffffff;
  border: 1px solid #cccccc;
  border-radius: 4px;
  outline: none;
}
</style>
