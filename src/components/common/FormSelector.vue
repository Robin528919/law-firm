<template>
  <div class="form-selector">
    <div class="selector-header">
      <h2 class="selector-title">
        <el-icon class="title-icon"><Menu /></el-icon>
        Select Form Type
      </h2>
      <p class="selector-description">Please select the type of legal document you want to create. The system will automatically load the corresponding form fields and calculation logic.</p>
    </div>
    
    <div class="selector-content">
      <el-select
        v-model="currentFormType"
        @change="handleFormTypeChange"
        placeholder="Please select form type"
        size="large"
        style="width: 100%"
        :disabled="isChanging"
      >
        <el-option
          v-for="formType in FORM_TYPES"
          :key="formType.value"
          :label="formType.label"
          :value="formType.value"
        >
          <div class="option-content">
            <div class="option-title">{{ formType.label }}</div>
            <div class="option-description">{{ formType.description }}</div>
          </div>
        </el-option>
      </el-select>
      

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessageBox } from 'element-plus'
import { Menu } from '@element-plus/icons-vue'
import { useFormStore } from '@/stores/formStore'
import { FORM_TYPES } from '@/utils/constants'

const formStore = useFormStore()
const isChanging = ref(false)

// 当前表单类型
const currentFormType = computed({
  get: () => formStore.currentFormType,
  set: (value) => formStore.setCurrentFormType(value)
})



// 表单类型变更处理
const handleFormTypeChange = async (newType) => {
  if (isChanging.value) return
  
  isChanging.value = true
  
  try {
    // 检查当前表单是否有数据
    const currentData = getCurrentFormData()
    const hasData = Object.values(currentData).some(value => {
      if (typeof value === 'string') return value.trim() !== '' && value !== ' '
      if (typeof value === 'number') return value !== 0
      if (Array.isArray(value)) return value.length > 0
      return value !== null
    })
    
    if (hasData) {
      await ElMessageBox.confirm(
        'Switching form type will clear current data. Do you want to continue?',
        'Confirm Switch',
        {
          confirmButtonText: 'Switch',
          cancelButtonText: 'Cancel',
          type: 'warning',
          customClass: 'form-switch-dialog'
        }
      )
    }
    
    // 切换表单类型
    formStore.setCurrentFormType(newType)
    
  } catch {
    // 用户取消，恢复原来的选择
    // 这里不需要手动恢复，因为computed会自动处理
  } finally {
    isChanging.value = false
  }
}

// 获取当前表单数据
const getCurrentFormData = () => {
  switch (currentFormType.value) {
    case 'complaint':
      return formStore.complaintForm.value // 修复：获取ref的value
    case 'answer':
      return formStore.answerForm.value // 修复：获取ref的value
    case 'settlement':
      return formStore.settlementForm.value // 修复：获取ref的value
    case 'demurrer':
      return formStore.demurrerForm.value // 添加demurrer支持
    default:
      return {}
  }
}
</script>

<style scoped>
.selector-header {
  margin-bottom: 24px;
}

.selector-title {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.title-icon {
  margin-right: 8px;
  color: var(--primary-color);
}

.option-content {
  padding: 4px 0;
}

.option-title {
  font-weight: 600;
  color: var(--text-primary);
}

.option-description {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 2px;
}



/* 自定义对话框样式 */
:global(.form-switch-dialog .el-message-box) {
  border-radius: var(--radius-lg);
}
</style> 