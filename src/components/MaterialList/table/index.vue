<template>
    <div class="v-table-container" :style="elementStyle">
        <el-table
            :data="tableData"
            :style="tableStyle"
            :height="elementStyle.height"
            :border="tableBorder"
            :stripe="tableStripe"
            :size="tableSize"
        >
            <el-table-column
                v-for="column in columns"
                :key="column.prop"
                :prop="column.prop"
                :label="column.label"
                :width="column.width"
                :align="column.align"
            />
        </el-table>
    </div>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue';

interface Column {
  prop: string;
  label: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

interface Props {
  propValue?: any[];
  columns?: Column[];
  border?: boolean;
  stripe?: boolean;
  size?: 'large' | 'default' | 'small';
  element?: {
    style?: Record<string, any>;
  };
}

const props = withDefaults(defineProps<Props>(), {
  propValue: () => [
    { name: '张三', age: 25, city: '北京' },
    { name: '李四', age: 30, city: '上海' },
    { name: '王五', age: 28, city: '广州' }
  ],
  columns: () => [
    { prop: 'name', label: '姓名', width: '120px', align: 'center' },
    { prop: 'age', label: '年龄', width: '100px', align: 'center' },
    { prop: 'city', label: '城市', width: '120px', align: 'center' }
  ],
  border: true,
  stripe: false,
  size: 'default'
});

const { propValue, columns, border, stripe, size, element } = toRefs(props);

const tableData = computed(() => propValue.value);
const tableBorder = computed(() => border.value);
const tableStripe = computed(() => stripe.value);
const tableSize = computed(() => size.value);

const elementStyle = computed(() => ({
  width: '400px',
  height: '300px',
  ...element?.value?.style
}));

const tableStyle = computed(() => ({
  width: '100%',
  fontSize: element?.value?.style?.fontSize || '14px'
}));
</script>

<style scoped lang="scss">
.v-table-container {
  display: flex;
  flex-direction: column;
  overflow: hidden;

  :deep(.el-table) {
    flex: 1;
  }
}
</style>