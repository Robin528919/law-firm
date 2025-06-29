<template>
  <AppLayout>
    <!-- Main content area -->
    <div class="main-content">
      <!-- Form selector -->
      <FormSelector/>

      <!-- Current form content -->
      <div class="form-content" v-if="formStore.currentFormType">
        <!-- Complaint/Damages form -->
        <ComplaintForm v-if="formStore.currentFormType === 'complaint'" ref="complaintFormRef"/>

        <!-- Answer form -->
        <AnswerForm v-if="formStore.currentFormType === 'answer'" ref="answerFormRef"/>

        <!-- Settlement agreement form -->
        <SettlementForm v-if="formStore.currentFormType === 'settlement'" ref="settlementFormRef"/>

        <!-- Form action buttons -->
        <FormActions
            variant="default"
            :show-save="false"
            :show-export="false"
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

      <!-- Prompt when no form is selected -->
      <div class="no-form-selected" v-else>
        <el-empty description="Please select a form type to get started">
          <template #image>
            <el-icon size="120" color="var(--primary-color)">
              <DocumentCopy/>
            </el-icon>
          </template>
          <el-button type="primary" @click="showFormSelector">Select Form Type</el-button>
        </el-empty>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import {ref, computed} from 'vue'
import {DocumentCopy} from '@element-plus/icons-vue'
import {ElMessage, ElMessageBox} from 'element-plus'
import AppLayout from '@/components/common/AppLayout.vue'
import FormSelector from '@/components/common/FormSelector.vue'
import FormActions from '@/components/common/FormActions.vue'
import ComplaintForm from '@/components/forms/ComplaintForm.vue'
import AnswerForm from '@/components/forms/AnswerForm.vue'
import SettlementForm from '@/components/forms/SettlementForm.vue'
import {useFormStore} from '@/stores/formStore'
import {API_CONFIG} from '@/utils/constants'

// Use form state management
const formStore = useFormStore()

// Form references
const complaintFormRef = ref()
const answerFormRef = ref()
const settlementFormRef = ref()

// Current form completion progress
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

// Calculate complaint form progress
const calculateComplaintProgress = () => {
  const requiredFields = [
    'plaintiffName', 'plaintiffJob', 'defendantName', 'defendantState', 'defendantEntityType',
    'courtLocation', 'courtName', 'complaintFilingDate', 'selectedCauses', 'plaintiffResidence',
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

// Calculate answer form progress
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

// Calculate settlement agreement form progress
const calculateSettlementProgress = () => {
  const requiredFields = [
    'plaintiffName', 'defendantName', 'defendantState', 'defendantEntityType', 'courtName', 'caseName',
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

// Get current form reference
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

// Show form selector
const showFormSelector = () => {
  ElMessage.info('Please select a form type above')
}

// Form operation handlers
const handleReset = async () => {
  if (!formStore.currentFormType) return

  try {
    await ElMessageBox.confirm(
        'Are you sure you want to reset the current form? This will clear all filled data.',
        'Confirm Reset',
        {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning',
        }
    )

    const formRef = getCurrentFormRef()
    if (formRef && formRef.resetForm) {
      formRef.resetForm()
    }

    formStore.resetCurrentForm()
    ElMessage.success('Form has been reset')
  } catch {
    // User cancelled operation
  }
}

const handleClear = async () => {
  if (!formStore.currentFormType) return

  try {
    await ElMessageBox.confirm(
        'Are you sure you want to clear all data in the current form? This operation cannot be undone.',
        'Confirm Clear',
        {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning',
        }
    )

    formStore.clearCurrentForm()
    ElMessage.success('Data has been cleared')
  } catch {
    // User cancelled operation
  }
}

const handleSave = () => {
  if (!formStore.currentFormType) return

  try {
    formStore.saveFormData()
    ElMessage.success('Draft has been saved to local storage')
  } catch (error) {
    ElMessage.error('Save failed: ' + error.message)
  }
}

const handleExport = () => {
  if (!formStore.currentFormType) return

  try {
    formStore.exportFormDataWithDownload()
    ElMessage.success('Data exported successfully')
  } catch (error) {
    ElMessage.error('Export failed: ' + error.message)
  }
}

const handleSubmit = async () => {
  if (!formStore.currentFormType) return

  // 检查邮箱地址
  if (!formStore.submissionEmail || !formStore.submissionEmail.trim()) {
    ElMessage.error('Please enter your email address before submitting')
    return
  }

  const progress = currentFormProgress.value
  if (progress < 100) {
    ElMessage.warning(`Form completion is ${progress}%. It is recommended to complete all required fields before submitting.`)
    return
  }

  // 验证表单
  const formRef = getCurrentFormRef()
  if (formRef && formRef.validate) {
    try {
      const valid = await formRef.validate()
      if (valid) {
        // 准备提交数据，包含邮箱地址
        const submissionData = {
          submissionEmail: formStore.submissionEmail,
          formType: formStore.currentFormType,
          formData: formStore.getCurrentFormData(),
          timestamp: new Date().toISOString()
        }

        ElMessage.success('Form submitted successfully!')
        // 发送POST请求
        console.log('提交数据', submissionData)
        try {
          const webhookUrl = API_CONFIG.getWebhookUrl()
          console.log('当前环境:', API_CONFIG.ENVIRONMENT, '使用地址:', webhookUrl)
          const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(submissionData)
          })
          if (response.ok) {
            console.log('表单提交成功')
          } else {
            console.log('表单提交失败，服务器返回错误', response.status, await response.text())
          }
        } catch (err) {
          console.log('表单提交失败，网络错误:', err)
        }
      }
    } catch (error) {
      ElMessage.error('Form validation failed, please check required fields')
      console.log('Validation error:', error)
    }
  } else {
    // 准备提交数据，包含邮箱地址
    const submissionData = {
      submissionEmail: formStore.submissionEmail,
      formType: formStore.currentFormType,
      formData: formStore.getCurrentFormData(),
      timestamp: new Date().toISOString()
    }

    ElMessage.success('Form submitted successfully!')
    console.log('Submitted data:', submissionData)
  }
}
</script>

<style scoped>
.main-content {
  width: 900px;
  margin: 0 auto;
  padding: var(--spacing-lg);
  background: var(--background);
  width: 100%;
}

.form-content {
  margin-top: var(--spacing-xl);
  animation: slideIn 0.3s ease-out;
  width: 900px;
  margin-left: auto;
  margin-right: auto;
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
@media (max-width: 968px) {
  .main-content {
    max-width: 100%;
    margin: 0;
    padding: var(--spacing-md);
  }

  .form-content {
    max-width: 100%;
    margin-left: 0;
    margin-right: 0;
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: var(--spacing-md);
  }

  .no-form-selected :deep(.el-icon) {
    font-size: 80px !important;
  }
}
</style>
