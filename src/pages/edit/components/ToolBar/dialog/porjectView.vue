<template>
    <el-dialog v-model="dialogVisible" :title="operationType === 'create' ? '新建项目' : '编辑项目'" width="500px"
        :before-close="handleClose" class="project-dialog">
        <el-form label-width="100px">
            <el-form-item label="项目名称">
                <el-input v-model="projectName" placeholder="请输入项目名称" clearable></el-input>
            </el-form-item>
            <el-form-item label="项目介绍">
                <el-input type="textarea" v-model="projectDescription" placeholder="请输入项目介绍" :rows="3"
                    clearable></el-input>
            </el-form-item>

            <el-form-item v-if="operationType === 'update'" style="display: none;">
                <el-input v-model="projectName" placeholder="项目 ID" clearable></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="closeDialog">取消</el-button>
                <el-button type="primary" @click="confirmProject">确认</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import { ref, defineProps, defineEmits, watch } from 'vue';
import { ElMessageBox } from 'element-plus';
import { useProjectsStore } from '@/stores/projects';
import { useCanvasStore } from '@/stores/canvasData';

const projectStore = useProjectsStore();
const canvasStore = useCanvasStore();

const props = defineProps({
    modelValue: Boolean,
    initialProjectName: {
        type: String,
        default: ''
    },
    initialProjectDescription: {
        type: String,
        default: ''
    },
    projectId: {
        type: String,
        default: ''
    },
    operationType: {
        type: String,
        default: 'create' // 'create' 或 'update'
    }
});

const emit = defineEmits(['update:modelValue', 'confirm']);

const dialogVisible = ref(props.modelValue);
const projectName = ref(props.initialProjectName);
const projectDescription = ref(props.initialProjectDescription);

watch(() => props.modelValue, (newVal) => {
    dialogVisible.value = newVal;
});

watch(dialogVisible, (newVal) => {
    emit('update:modelValue', newVal);
});

const handleClose = (done: () => void) => {
    ElMessageBox.confirm('确定要关闭此对话框吗？', '确认操作', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    })
        .then(() => {
            done();
            closeDialog();
        })
        .catch(() => { });
};

const closeDialog = () => {
    dialogVisible.value = false;
};

const confirmProject = () => {
    if (!projectName.value.trim()) {
        ElMessageBox.alert('项目名称不能为空', '提示', {
            type: 'error'
        });
        return;
    }

    const componentData = canvasStore.getJsonData();

    if (props.operationType === 'create') {
        projectStore.addProject({
            name: projectName.value,
            description: projectDescription.value,
            componentData
        });
    } else if (props.operationType === 'update') {
        projectStore.updateProject(props.projectId, {
            name: projectName.value,
            description: projectDescription.value,
            componentData
        });
    }

    emit('confirm', {
        projectName: projectName.value,
        projectDescription: projectDescription.value
    });

    closeDialog();
};
</script>

<style scoped lang="scss">
.project-dialog {
    .el-form-item {
        margin-bottom: 16px;
    }

    .el-input,
    .el-textarea {
        width: 100%;
    }
}

.dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding-top: 10px;
    border-top: 1px solid #eaeaea;
}
</style>