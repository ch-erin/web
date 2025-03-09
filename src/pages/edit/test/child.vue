<template>
    <div>
        <!-- 添加按钮 -->
        <button @click="addItem">添加项</button>
        <!-- 移除按钮 -->
        <button @click="removeItem">移除项</button>

        <!-- 使用 transition-group 包裹列表 -->
        <transition-group name="list" tag="ul" class="list">
            <!-- 遍历列表项 -->
            <li v-for="(item, index) in list" :key="item.id">
                {{ item.text }}
            </li>
        </transition-group>
    </div>
</template>

<script>
export default {
    data() {
        return {
            list: [
                { id: 1, text: "列表项 1" },
                { id: 2, text: "列表项 2" },
                { id: 3, text: "列表项 3" }
            ]
        };
    },
    methods: {
        addItem() {
            // 添加一个新项到列表中
            const newItem = {
                id: Date.now(), // 使用时间戳作为唯一 ID
                text: `列表项 ${this.list.length + 1}`
            };
            this.list.push(newItem);
        },
        removeItem() {
            // 移除最后一个列表项
            if (this.list.length > 0) {
                this.list.pop();
            }
        }
    }
};
</script>

<style>
/* 定义 transition-group 的动画效果 */
.list-enter-active,
.list-leave-active {
    transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
    opacity: 0;
    transform: translateX(30px);
    /* 新项从右侧进入，移除项向右滑出 */
}

/* 列表样式 */
.list {
    list-style-type: none;
    padding: 0;
}

.list li {
    background: #f0f0f0;
    margin: 5px 0;
    padding: 10px;
    border-radius: 5px;
}
</style>