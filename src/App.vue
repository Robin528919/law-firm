<template>
  <AppLayout>
    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 表单选择器 -->
      <FormSelector />
      
      <!-- 当前表单内容 -->
      <div class="form-content" v-if="formStore.currentFormType">
        <!-- 起诉/损害赔偿表单 -->
        <ComplaintForm v-if="formStore.currentFormType === 'complaint'" ref="complaintFormRef" />
        
        <!-- 回复表单 -->
        <AnswerForm v-if="formStore.currentFormType === 'answer'" ref="answerFormRef" />
        
        <!-- 和解协议表单 -->
        <SettlementForm v-if="formStore.currentFormType === 'settlement'" ref="settlementFormRef" />
        
        <!-- 表单操作按钮 -->
        <FormActions 
          variant="default"
          :show-save="true"
          :show-export="true"
          :show-submit="true"
          :loading="formStore.isLoading"
          :progress="currentFormProgress"
          @reset="handleReset"
          @clear="handleClear"
          @save="handleSave"
          @export="handleExport"
          @submit="handleSubmit"
        />
      </div>
      
      <!-- 未选择表单时的提示 -->
      <div class="no-form-selected" v-else>
        <el-empty description="请选择一个表单类型开始使用">
          <template #image>
            <el-icon size="120" color="var(--primary-color)">
              <DocumentCopy />
            </el-icon>
          </template>
          <el-button type="primary" @click="showFormSelector">选择表单类型</el-button>
        </el-empty>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { DocumentCopy } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import AppLayout from '@/components/common/AppLayout.vue'
import FormSelector from '@/components/common/FormSelector.vue'
import FormActions from '@/components/common/FormActions.vue'
import ComplaintForm from '@/components/forms/ComplaintForm.vue'
import AnswerForm from '@/components/forms/AnswerForm.vue'
import SettlementForm from '@/components/forms/SettlementForm.vue'
import { useFormStore } from '@/stores/formStore'

// 使用表单状态管理
const formStore = useFormStore()

// 表单引用
const complaintFormRef = ref()
const answerFormRef = ref()
const settlementFormRef = ref()

// 当前表单的完成进度
const currentFormProgress = computed(() => {
  switch (formStore.currentFormType) {
    case 'complaint':
      return calculateComplaintProgress()
    case 'answer':
      return calculateAnswerProgress()
    case 'settlement':
      return calculateSettlementProgress()
    default:
      return 0
  }
})

// 计算起诉表单进度
const calculateComplaintProgress = () => {
  const requiredFields = [
    'plaintiffName', 'plaintiffJob', 'defendantName', 'courtLocation', 
    'courtName', 'complaintFilingDate', 'selectedCauses', 'plaintiffResidence',
    'defendantBusinessType', 'defendantBusinessAddress', 'employmentStartDate',
    'employmentEndDate', 'hourlyRate', 'unpaidHours', 'weeklyHours',
    'payPeriodInterval', 'iwcOrder', 'payPeriods'
  ]
  
  const filledFields = requiredFields.filter(field => {
    const value = formStore.complaintForm[field]
    if (Array.isArray(value)) return value.length > 0
    if (typeof value === 'string') return value.trim() !== ''
    return value !== null && value !== undefined && value !== 0
  }).length
  
  return Math.round((filledFields / requiredFields.length) * 100)
}

// 计算回复表单进度
const calculateAnswerProgress = () => {
  const requiredFields = [
    'letterDate', 'ocName', 'ocFirm', 'ocAddress', 'caseName',
    'caseNumber', 'defendantName', 'adNumber', 'respDate'
  ]
  
  const filledFields = requiredFields.filter(field => {
    const value = formStore.answerForm[field]
    if (typeof value === 'string') return value.trim() !== ''
    return value !== null && value !== undefined
  }).length
  
  return Math.round((filledFields / requiredFields.length) * 100)
}

// 计算和解协议表单进度
const calculateSettlementProgress = () => {
  const requiredFields = [
    'plaintiffName', 'defendantName', 'courtName', 'caseName',
    'settlementWrittenAmount', 'settlementNumericalAmount', 'defenseContactMethod',
    'defenseCounselName', 'defenseCounselFirm', 'defenseFirmAddress'
  ]
  
  const filledFields = requiredFields.filter(field => {
    const value = formStore.settlementForm[field]
    if (typeof value === 'string') return value.trim() !== '' && value !== ' '
    if (typeof value === 'number') return value > 0
    return value !== null && value !== undefined
  }).length
  
  return Math.round((filledFields / requiredFields.length) * 100)
}

// 获取当前表单引用
const getCurrentFormRef = () => {
  switch (formStore.currentFormType) {
    case 'complaint':
      return complaintFormRef.value
    case 'answer':
      return answerFormRef.value
    case 'settlement':
      return settlementFormRef.value
    default:
      return null
  }
}

// 显示表单选择器
const showFormSelector = () => {
  ElMessage.info('请在上方选择表单类型')
}

// 表单操作处理
const handleReset = async () => {
  if (!formStore.currentFormType) return
  
  try {
    await ElMessageBox.confirm(
      '确定要重置当前表单吗？这将清空所有已填写的数据。',
      '确认重置',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    
    const formRef = getCurrentFormRef()
    if (formRef && formRef.resetForm) {
      formRef.resetForm()
    }
    
    formStore.resetCurrentForm()
    ElMessage.success('表单已重置')
  } catch {
    // 用户取消操作
  }
}

const handleClear = async () => {
  if (!formStore.currentFormType) return
  
  try {
    await ElMessageBox.confirm(
      '确定要清空当前表单的所有数据吗？此操作不可撤销。',
      '确认清空',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    
    formStore.clearCurrentForm()
    ElMessage.success('数据已清空')
  } catch {
    // 用户取消操作
  }
}

const handleSave = () => {
  if (!formStore.currentFormType) return
  
  try {
    formStore.saveFormData()
    ElMessage.success('草稿已保存到本地存储')
  } catch (error) {
    ElMessage.error('保存失败：' + error.message)
  }
}

const handleExport = () => {
  if (!formStore.currentFormType) return
  
  try {
    formStore.exportFormDataWithDownload()
    ElMessage.success('数据导出成功')
  } catch (error) {
    ElMessage.error('导出失败：' + error.message)
  }
}

const handleSubmit = async () => {
  if (!formStore.currentFormType) return
  
  const progress = currentFormProgress.value
  if (progress < 100) {
    ElMessage.warning(`表单完成度为 ${progress}%，建议完成所有必填项后再提交`)
    return
  }
  
  // 验证表单
  const formRef = getCurrentFormRef()
  if (formRef && formRef.validate) {
    try {
      const valid = await formRef.validate()
      if (valid) {
        ElMessage.success('表单提交成功！')
        console.log('提交的表单数据：', formStore.getCurrentFormData())
      }
    } catch (error) {
      ElMessage.error('表单验证失败，请检查必填项')
      console.log('验证错误：', error)
    }
  } else {
    ElMessage.success('表单提交成功！')
    console.log('提交的表单数据：', formStore.getCurrentFormData())
  }
}
</script>

<style scoped>
.main-content {
  padding: var(--spacing-lg);
  background: var(--background);
}

.form-content {
  margin-top: var(--spacing-xl);
  animation: slideIn 0.3s ease-out;
}

.no-form-selected {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  margin-top: var(--spacing-xl);
}

.no-form-selected :deep(.el-empty__description) {
  font-size: var(--font-lg);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-lg);
}

/* 进入动画 */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-content {
    padding: var(--spacing-md);
  }
  
  .no-form-selected :deep(.el-icon) {
    font-size: 80px !important;
  }
}
</style>
