<template>
    <div>
        <el-input></el-input>
    </div>
</template>

<script setup lang="ts">

const retry = async (fn: () => Promise<any>, retries: number = 3) => {
    let attempts = 0;
    while (attempts < retries) {
        try {
            const result = await fn();
            return result;
        } catch (e) {
            attempts++;
            console.log(`Attempt ${attempts} failed. Retrying...`);
            if (attempts === retries) throw e;
        }
    }
}



</script>

<style scoped lang="scss"></style>