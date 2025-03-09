<template>
    <table class="v-table">
        <tbody>
            <tr v-for="(item, index) in propValue.data" :key="index" :class="{
                stripe: propValue.stripe && index % 2,
                bold: propValue.thBold && index === 0,
            }">
                <td v-for="(e, i) in item" :key="i">{{ e }}</td>
            </tr>
        </tbody>
    </table>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps({
    propValue: {
        type: Object,
        default: () => ({
            data: [],
            stripe: false,
            thBold: false,
        }),
    },
});

const tableData = ref([
    ['Header 1', 'Header 2', 'Header 3'],
    ['Row 1, Col 1', 'Row 1, Col 2', 'Row 1, Col 3'],
    ['Row 2, Col 1', 'Row 2, Col 2', 'Row 2, Col 3'],
]);

if (!props.propValue.data || props.propValue.data.length === 0) {
    props.propValue.data = tableData.value;
}
</script>

<style lang="scss" scoped>
.v-table {
    border-collapse: collapse;
    table-layout: fixed;
    word-break: break-all;
    word-wrap: break-word;

    td {
        border: 1px solid #ebeef5;
        height: 40px;
        width: 60px;
        padding: 10px;
    }

    .bold {
        font-weight: bold;
    }

    .stripe {
        background-color: #fafafa;
    }
}
</style>