<template>
  <div class="v-text">
    {{ propValue }}
  </div>
</template>

<script setup lang="ts">
defineProps<{
  propValue: string;
  label: string;
}>();
</script>

<style scoped>
.v-text {
  width: 100%;
  padding: 5px 10px;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.5;
  text-align: left;
  color: #333333;
  background-color: #f5f5f5;
  border: 1px solid #dddddd;
  border-radius: 4px;
}
</style>
