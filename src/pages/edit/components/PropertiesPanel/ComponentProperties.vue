<template>
  <div class="component-properties">
    <div class="panel-content" v-if="selectedComponent">
      <!-- 基本信息 -->
      <el-collapse v-model="activeCollapse" accordion>
        <!-- 基本属性 -->
        <el-collapse-item title="基本属性" name="basic">
          <div class="property-group">
            <div class="property-item">
              <label>组件ID</label>
              <el-input
                v-model="selectedComponent.id"
                disabled
                size="small"
              />
            </div>
            <div class="property-item">
              <label>组件类型</label>
              <el-input
                v-model="selectedComponent.name"
                disabled
                size="small"
              />
            </div>
            <div class="property-item" v-if="selectedComponent.attrs?.propValue !== undefined">
              <label>显示文本</label>
              <el-input
                v-model="selectedComponent.attrs.propValue"
                @input="updateComponentAttr('propValue', $event)"
                size="small"
              />
            </div>
          </div>
        </el-collapse-item>

        <!-- 样式属性 -->
        <el-collapse-item title="样式属性" name="style">
          <div class="property-group">
            <!-- 位置和大小 -->
            <div class="property-section">
              <h4>位置和大小</h4>
              <div class="property-row">
                <div class="property-item">
                  <label>宽度</label>
                  <el-input
                    v-model="localStyle.width"
                    @blur="updateStyle"
                    size="small"
                    placeholder="auto"
                  />
                </div>
                <div class="property-item">
                  <label>高度</label>
                  <el-input
                    v-model="localStyle.height"
                    @blur="updateStyle"
                    size="small"
                    placeholder="auto"
                  />
                </div>
              </div>
              <div class="property-row">
                <div class="property-item">
                  <label>X坐标</label>
                  <el-input
                    v-model="localStyle.left"
                    @blur="updateStyle"
                    size="small"
                  />
                </div>
                <div class="property-item">
                  <label>Y坐标</label>
                  <el-input
                    v-model="localStyle.top"
                    @blur="updateStyle"
                    size="small"
                  />
                </div>
              </div>
            </div>

            <!-- 文字样式 -->
            <div class="property-section">
              <h4>文字样式</h4>
              <div class="property-item">
                <label>字体大小</label>
                <el-input
                  v-model="localStyle.fontSize"
                  @blur="updateStyle"
                  size="small"
                />
              </div>
              <div class="property-item">
                <label>字体颜色</label>
                <el-color-picker
                  v-model="localStyle.color"
                  @change="updateStyle"
                  size="small"
                />
              </div>
              <div class="property-item">
                <label>文字对齐</label>
                <el-select
                  v-model="localStyle.textAlign"
                  @change="updateStyle"
                  size="small"
                >
                  <el-option label="左对齐" value="left" />
                  <el-option label="居中" value="center" />
                  <el-option label="右对齐" value="right" />
                </el-select>
              </div>
            </div>

            <!-- 背景和边框 -->
            <div class="property-section">
              <h4>背景和边框</h4>
              <div class="property-item">
                <label>背景颜色</label>
                <el-color-picker
                  v-model="localStyle.backgroundColor"
                  @change="updateStyle"
                  size="small"
                  show-alpha
                />
              </div>
              <div class="property-item">
                <label>边框宽度</label>
                <el-input
                  v-model="localStyle.borderWidth"
                  @blur="updateStyle"
                  size="small"
                />
              </div>
              <div class="property-item">
                <label>边框颜色</label>
                <el-color-picker
                  v-model="localStyle.borderColor"
                  @change="updateStyle"
                  size="small"
                />
              </div>
              <div class="property-item">
                <label>圆角</label>
                <el-input
                  v-model="localStyle.borderRadius"
                  @blur="updateStyle"
                  size="small"
                />
              </div>
            </div>
          </div>
        </el-collapse-item>

        <!-- 高级属性 -->
        <el-collapse-item title="高级属性" name="advanced">
          <div class="property-group">
            <div class="property-item">
              <label>层级 (z-index)</label>
              <el-input-number
                v-model="localZIndex"
                @change="updateZIndex"
                size="small"
                :min="1"
                :max="9999"
              />
            </div>
            <div class="property-item">
              <label>旋转角度</label>
              <el-input
                v-model="localRotate"
                @blur="updateRotate"
                size="small"
                placeholder="0deg"
              />
            </div>
            <div class="property-item">
              <label>是否锁定</label>
              <el-switch
                v-model="selectedComponent.isLock"
                @change="updateLockStatus"
              />
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>

    <div class="no-selection" v-else>
      <el-empty description="请选择一个组件">
        <template #image>
          <el-icon size="60" color="#c0c4cc">
            <Select />
          </el-icon>
        </template>
      </el-empty>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, reactive } from 'vue';
import { useCanvasStore } from '@/stores/canvasData';
import { Select } from '@element-plus/icons-vue';

const canvasStore = useCanvasStore();
const activeCollapse = ref(['basic', 'style']);

// 获取当前选中的组件
const selectedComponent = computed(() => canvasStore.curComponent);

// 本地样式数据，用于编辑
const localStyle = reactive({
  width: '',
  height: '',
  left: '',
  top: '',
  fontSize: '',
  color: '',
  backgroundColor: '',
  borderWidth: '',
  borderColor: '',
  borderRadius: '',
  textAlign: 'center'
});

const localZIndex = ref(1);
const localRotate = ref('0deg');

// 监听选中组件变化，同步样式数据
watch(selectedComponent, (newComponent) => {
  if (newComponent && newComponent.style) {
    Object.assign(localStyle, {
      width: newComponent.style.width || '',
      height: newComponent.style.height || '',
      left: newComponent.style.left || '',
      top: newComponent.style.top || '',
      fontSize: newComponent.style.fontSize || '',
      color: newComponent.style.color || '',
      backgroundColor: newComponent.style.backgroundColor || '',
      borderWidth: newComponent.style.borderWidth || '',
      borderColor: newComponent.style.borderColor || '',
      borderRadius: newComponent.style.borderRadius || '',
      textAlign: newComponent.style.textAlign || 'center'
    });

    localZIndex.value = parseInt(newComponent.style.zIndex) || 1;

    // 解析旋转角度
    const transform = newComponent.style.transform || '';
    const rotateMatch = transform.match(/rotate\(([^)]+)\)/);
    localRotate.value = rotateMatch ? rotateMatch[1] : '0deg';
  }
}, { immediate: true });

// 更新组件样式
const updateStyle = () => {
  if (!selectedComponent.value) return;

  const updatedStyle = {
    ...selectedComponent.value.style,
    ...localStyle
  };

  canvasStore.updateStyle({
    id: selectedComponent.value.id,
    style: updatedStyle
  });
};

// 更新组件属性
const updateComponentAttr = (key: string, value: any) => {
  if (!selectedComponent.value) return;

  const updatedComponent = {
    ...selectedComponent.value,
    attrs: {
      ...selectedComponent.value.attrs,
      [key]: value
    }
  };

  canvasStore.updateStyle(updatedComponent);
};

// 更新层级
const updateZIndex = (value: number) => {
  if (!selectedComponent.value) return;

  const updatedStyle = {
    ...selectedComponent.value.style,
    zIndex: value
  };

  canvasStore.updateStyle({
    id: selectedComponent.value.id,
    style: updatedStyle
  });
};

// 更新旋转角度
const updateRotate = () => {
  if (!selectedComponent.value) return;

  const updatedStyle = {
    ...selectedComponent.value.style,
    transform: `rotate(${localRotate.value})`
  };

  canvasStore.updateStyle({
    id: selectedComponent.value.id,
    style: updatedStyle
  });
};

// 更新锁定状态
const updateLockStatus = (isLocked: boolean) => {
  if (!selectedComponent.value) return;

  canvasStore.updateStyle({
    id: selectedComponent.value.id,
    isLock: isLocked
  });
};
</script>

<style scoped lang="scss">
.component-properties {
  height: 100%;

  .panel-content {
    padding: 16px;
    height: 100%;
    overflow-y: auto;
  }

  .property-group {
    .property-section {
      margin-bottom: 20px;

      h4 {
        margin: 0 0 12px 0;
        font-size: 14px;
        font-weight: 500;
        color: #4e5969;
        border-bottom: 1px solid #e8e9eb;
        padding-bottom: 8px;
      }
    }

    .property-row {
      display: flex;
      gap: 12px;
    }

    .property-item {
      margin-bottom: 16px;
      flex: 1;

      label {
        display: block;
        margin-bottom: 6px;
        font-size: 12px;
        color: #4e5969;
        font-weight: 500;
      }

      .el-input,
      .el-select,
      .el-input-number {
        width: 100%;
      }
    }
  }

  .no-selection {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #86909c;
  }
}

:deep(.el-collapse) {
  border: none;

  .el-collapse-item__header {
    background: #f8f9fa;
    border: none;
    padding: 0 16px;
    height: 40px;
    font-weight: 500;
    font-size: 14px;
  }

  .el-collapse-item__wrap {
    border: none;
  }

  .el-collapse-item__content {
    padding: 16px;
  }
}
</style>
