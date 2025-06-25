<template>
  <div class="form-actions" :class="actionsClasses">
    <div class="actions-left">
      <!-- 左侧操作按钮 -->
      <slot name="left">
        <el-button 
          v-if="showReset"
          @click="handleReset"
          :disabled="disabled || isLoading"
          :loading="resetLoading"
        >
          <el-icon><RefreshLeft /></el-icon>
          Reset Form
        </el-button>
        
        <el-button 
          v-if="showClear"
          @click="handleClear"
          :disabled="disabled || isLoading"
          type="warning"
          plain
        >
          <el-icon><Delete /></el-icon>
          Clear Data
        </el-button>
      </slot>
    </div>

    <div class="actions-center">
      <!-- 中间状态显示 -->
      <slot name="center">
        <div v-if="showStatus" class="form-status">
          <div class="status-item">
            <el-icon class="status-icon" :class="statusIconClass">
              <component :is="statusIcon" />
            </el-icon>
            <span class="status-text">{{ statusText }}</span>
          </div>
          
          <div v-if="showProgress" class="progress-item">
            <el-progress 
              :percentage="progressPercentage" 
              :status="progressStatus"
              :stroke-width="6"
              text-inside
            />
          </div>
        </div>
      </slot>
    </div>

    <div class="actions-right">
      <!-- 右侧主要操作按钮 -->
      <slot name="right">
        <el-button 
          v-if="showSave"
          @click="handleSave"
          :disabled="disabled || !canSave"
          :loading="saveLoading"
          type="info"
        >
          <el-icon><FolderOpened /></el-icon>
          Save Draft
        </el-button>
        
        <el-button 
          v-if="showExport"
          @click="handleExport"
          :disabled="disabled || isLoading"
          :loading="exportLoading"
          type="success"
          plain
        >
          <el-icon><Download /></el-icon>
          Export Data
        </el-button>
        
        <el-button 
          v-if="showSubmit"
          @click="handleSubmit"
          :disabled="disabled || !canSubmit"
          :loading="submitLoading"
          type="primary"
        >
          <el-icon><Check /></el-icon>
          {{ submitText }}
        </el-button>
      </slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  RefreshLeft, Delete, FolderOpened, Download, Check,
  CircleCheckFilled, WarningFilled, CircleCloseFilled, Loading
} from '@element-plus/icons-vue'

// Props定义
const props = defineProps({
  // 按钮显示控制
  showReset: { type: Boolean, default: true },
  showClear: { type: Boolean, default: false },
  showSave: { type: Boolean, default: true },
  showExport: { type: Boolean, default: false },
  showSubmit: { type: Boolean, default: true },
  
  // 按钮状态
  disabled: { type: Boolean, default: false },
  canSave: { type: Boolean, default: true },
  canSubmit: { type: Boolean, default: true },
  
  // 加载状态
  isLoading: { type: Boolean, default: false },
  resetLoading: { type: Boolean, default: false },
  saveLoading: { type: Boolean, default: false },
  exportLoading: { type: Boolean, default: false },
  submitLoading: { type: Boolean, default: false },
  
  // 状态显示
  showStatus: { type: Boolean, default: true },
  statusType: { type: String, default: 'info' }, // success, warning, error, info
  statusText: { type: String, default: 'Ready' },
  
  // 进度显示
  showProgress: { type: Boolean, default: false },
  progressPercentage: { type: Number, default: 0 },
  progressStatus: { type: String, default: '' },
  
  // 文本定制
  submitText: { type: String, default: 'Submit Form' },
  
  // 样式变体
  variant: { type: String, default: 'default' }, // default, compact, floating
  
  // 位置
  position: { type: String, default: 'bottom' } // bottom, top, inline
})

// 事件定义
const emit = defineEmits([
  'reset', 'clear', 'save', 'export', 'submit'
])

// 计算属性
const actionsClasses = computed(() => ({
  [`variant-${props.variant}`]: true,
  [`position-${props.position}`]: true,
  'is-loading': props.isLoading
}))

const statusIcon = computed(() => {
  const iconMap = {
    success: CircleCheckFilled,
    warning: WarningFilled,
    error: CircleCloseFilled,
    info: Loading
  }
  return iconMap[props.statusType] || Loading
})

const statusIconClass = computed(() => ({
  'status-success': props.statusType === 'success',
  'status-warning': props.statusType === 'warning',
  'status-error': props.statusType === 'error',
  'status-info': props.statusType === 'info'
}))

// 事件处理
const handleReset = async () => {
  try {
    await ElMessageBox.confirm(
      'Are you sure you want to reset the form? This will clear all filled data.',
      'Confirm Reset',
      {
        confirmButtonText: 'Reset',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }
    )
    emit('reset')
    ElMessage.success('Form has been reset')
  } catch {
    // 用户取消
  }
}

const handleClear = async () => {
  try {
    await ElMessageBox.confirm(
      'Are you sure you want to clear all data? This operation cannot be undone.',
      'Confirm Clear',
      {
        confirmButtonText: 'Clear',
        cancelButtonText: 'Cancel',
        type: 'error'
      }
    )
    emit('clear')
    ElMessage.success('Data has been cleared')
  } catch {
    // 用户取消
  }
}

const handleSave = () => {
  emit('save')
}

const handleExport = () => {
  emit('export')
}

const handleSubmit = () => {
  emit('submit')
}
</script>

<style scoped>
.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-lg) var(--spacing-xl);
  background: var(--background);
  border-top: 1px solid var(--border);
}

/* 位置变体 */
.position-bottom {
  position: sticky;
  bottom: 0;
  z-index: 50;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
}

.position-top {
  position: sticky;
  top: 0;
  z-index: 50;
  border-top: none;
  border-bottom: 1px solid var(--border);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.position-inline {
  position: static;
  box-shadow: none;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
}

/* 样式变体 */
.variant-compact {
  padding: var(--spacing-md) var(--spacing-lg);
}

.variant-compact .actions-left,
.variant-compact .actions-center,
.variant-compact .actions-right {
  gap: var(--spacing-sm);
}

.variant-floating {
  position: fixed;
  bottom: 24px;
  right: 24px;
  left: auto;
  width: auto;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  background: var(--background);
  border: 1px solid var(--border-light);
  padding: var(--spacing-md) var(--spacing-lg);
}

.variant-floating .actions-left,
.variant-floating .actions-center {
  display: none;
}

/* 操作区域 */
.actions-left,
.actions-center,
.actions-right {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.actions-left {
  flex: 1;
  justify-content: flex-start;
}

.actions-center {
  flex: 2;
  justify-content: center;
}

.actions-right {
  flex: 1;
  justify-content: flex-end;
}

/* 状态显示 */
.form-status {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
}

.status-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--font-sm);
}

.status-icon {
  font-size: 16px;
}

.status-success {
  color: var(--success-color);
}

.status-warning {
  color: var(--warning-color);
}

.status-error {
  color: var(--danger-color);
}

.status-info {
  color: var(--info-color);
  animation: spin 2s linear infinite;
}

.status-text {
  font-weight: 500;
}

.progress-item {
  width: 200px;
}

/* 加载状态 */
.is-loading {
  pointer-events: none;
}

.is-loading::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  z-index: 10;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .form-actions {
    flex-direction: column;
    gap: var(--spacing-md);
    padding: var(--spacing-md);
  }
  
  .actions-left,
  .actions-center,
  .actions-right {
    width: 100%;
    justify-content: center;
  }
  
  .actions-center {
    order: -1;
  }
  
  .variant-floating {
    position: fixed;
    bottom: 16px;
    left: 16px;
    right: 16px;
    width: auto;
  }
  
  .variant-floating .actions-center {
    display: none;
  }
  
  .variant-floating .actions-right {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .actions-left,
  .actions-right {
    flex-direction: column;
    gap: var(--spacing-sm);
  }
  
  .form-actions .el-button {
    width: 100%;
  }
}

/* 动画 */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 按钮间距调整 */
.form-actions .el-button + .el-button {
  margin-left: 0;
}
</style> 