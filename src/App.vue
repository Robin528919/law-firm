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

        <!-- Demurrer form -->
        <DemurrerForm v-if="formStore.currentFormType === 'demurrer'" ref="demurrerFormRef"/>

        <!-- Motion to Strike form -->
        <MotionToStrikeForm v-if="formStore.currentFormType === 'motionToStrike'" ref="motionToStrikeFormRef"/>

        <!-- Request for Production form -->
        <RequestForProductionForm v-if="formStore.currentFormType === 'requestForProduction'" ref="requestForProductionFormRef"/>

        <!-- PMP Depo form -->
        <PmpDepoForm v-if="formStore.currentFormType === 'pmpDepo'" ref="pmpDepoFormRef"/>

        <!-- NTC of Depo form -->
        <NtcOfDepoForm v-if="formStore.currentFormType === 'ntcOfDepo'" ref="ntcOfDepoFormRef"/>

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
import DemurrerForm from '@/components/forms/DemurrerForm.vue'
import MotionToStrikeForm from '@/components/forms/MotionToStrikeForm.vue'
import RequestForProductionForm from '@/components/forms/RequestForProductionForm.vue'
import PmpDepoForm from '@/components/forms/PmpDepoForm.vue'
import NtcOfDepoForm from '@/components/forms/NtcOfDepoForm.vue'
import {useFormStore} from '@/stores/formStore'
import {API_CONFIG} from '@/utils/constants'
import {formatLegalDate} from '@/utils/calculations'

// Use form state management
const formStore = useFormStore()

// Form references
const complaintFormRef = ref()
const answerFormRef = ref()
const settlementFormRef = ref()
const demurrerFormRef = ref()
const motionToStrikeFormRef = ref()
const requestForProductionFormRef = ref()
const pmpDepoFormRef = ref()
const ntcOfDepoFormRef = ref()

// Current form completion progress
const currentFormProgress = computed(() => {
  switch (formStore.currentFormType) {
    case 'complaint':
      return calculateComplaintProgress()
    case 'answer':
      return calculateAnswerProgress()
    case 'settlement':
      return calculateSettlementProgress()
    case 'demurrer':
      return calculateDemurrerProgress()
    case 'motionToStrike':
      return calculateMotionToStrikeProgress()
    case 'requestForProduction':
      return calculateRequestForProductionProgress()
    case 'pmpDepo':
      return calculatePmpDepoProgress()
    case 'ntcOfDepo':
      return calculateNtcOfDepoProgress()
    default:
      return 0
  }
})

// Calculate complaint form progress
const calculateComplaintProgress = () => {
  const requiredFields = [
    'PlaintiffName', 'PlaintiffJob', 'DefendantName', 'DefendantState', 'DefendantEntityType',
    'CourtLocation', 'CourtName', 'ComplaintFilingDate', 'SelectedCauses', 'PlaintiffResidence',
    'DefendantBusinessType', 'DefendantBusinessAddress', 'EmploymentStartDate',
    'EmploymentEndDate', 'HourlyRate', 'UnpaidHours', 'WeeklyHours',
    'PayPeriodInterval', 'IwcOrder', 'PayPeriods'
  ]

  const filledFields = requiredFields.filter(field => {
    const value = formStore.complaintForm[field]
    if (field === 'SelectedCauses') {
      // 检查是否至少选择了一个案由
      return Object.values(value || {}).some(v => v?.selected === true)
    }
    if (Array.isArray(value)) return value.length > 0
    if (typeof value === 'string') return value.trim() !== ''
    return value !== null && value !== undefined && value !== 0
  }).length

  return Math.round((filledFields / requiredFields.length) * 100)
}

// Calculate answer form progress
const calculateAnswerProgress = () => {
  const requiredFields = [
    'LetterDate', 'OCName', 'OCFirm', 'OCAddress', 'CaseName',
    'CaseNumber', 'DefendantName', 'ADNumber', 'RespDate'
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
    'PlaintiffName', 'DefendantName', 'DefendantState', 'DefendantEntityType', 'CourtName', 'CaseName',
    'SettlementWrittenAmount', 'SettlementNumericalAmount', 'DefenseContactMethod',
    'DefenseCounselName', 'DefenseCounselFirm', 'DefenseFirmAddress'
  ]

  const filledFields = requiredFields.filter(field => {
    const value = formStore.settlementForm[field]
    if (typeof value === 'string') return value.trim() !== '' && value !== ' '
    if (typeof value === 'number') return value > 0
    return value !== null && value !== undefined
  }).length

  return Math.round((filledFields / requiredFields.length) * 100)
}

// Calculate demurrer form progress
const calculateDemurrerProgress = () => {
  const requiredFields = [
    'PlaintiffName', 'DefendantName', 'CourtLocation', 'CourtName', 'CourtAddress',
    'HearingDate', 'HearingTime', 'HearingDept', 'ResID', 'CaseNumber',
    'JudgeName', 'ComplaintFilingDate', 'AnswerFilingDate', 'ExecutedDate',
    'CaseType', 'SelectedCauses', 'ChosenAD', 'MnCDate', 'MnCRespDate'
  ]

  const filledFields = requiredFields.filter(field => {
    const value = formStore.demurrerForm[field]
    if (Array.isArray(value)) return value.length > 0
    if (typeof value === 'string') return value.trim() !== ''
    return value !== null && value !== undefined
  }).length

  return Math.round((filledFields / requiredFields.length) * 100)
}

// Calculate motion to strike form progress
const calculateMotionToStrikeProgress = () => {
  const requiredFields = [
    'PlaintiffName', 'DefendantName', 'CourtLocation', 'CourtName', 'CourtAddress',
    'HearingDate', 'HearingTime', 'HearingDept', 'ResID', 'ComplaintFilingDate',
    'CaseType', 'SelectedCauses', 'AnswerFilingDate', 'ExecutedDate', 
    'ChosenAD', 'MnCDate', 'MnCRespDate'
  ]

  const filledFields = requiredFields.filter(field => {
    const value = formStore.motionToStrikeForm[field]
    if (Array.isArray(value)) return value.length > 0
    if (typeof value === 'string') return value.trim() !== ''
    return value !== null && value !== undefined
  }).length

  return Math.round((filledFields / requiredFields.length) * 100)
}

// Calculate request for production form progress
const calculateRequestForProductionProgress = () => {
  const requiredFields = [
    'PlaintiffNames', 'CaseNumber', 'DefendantNames', 'JudgeName',
    'ComplaintFilingDate', 'LetterDate', 'ExecutedDate', 
    'OCName', 'OCFirm'
  ]

  const filledFields = requiredFields.filter(field => {
    const value = formStore.requestForProductionForm[field]
    if (Array.isArray(value)) return value.filter(name => name.trim()).length > 0
    if (typeof value === 'string') return value.trim() !== ''
    return value !== null && value !== undefined
  }).length

  return Math.round((filledFields / requiredFields.length) * 100)
}

// Calculate pmp depo form progress
const calculatePmpDepoProgress = () => {
  const requiredFields = [
    'PlaintiffName', 'CaseNumber', 'DefendantName', 'OCName', 
    'OCFirm', 'OCAddress', 'MnCDate', 'LetterDate'
  ]

  const filledFields = requiredFields.filter(field => {
    const value = formStore.pmpDepoForm[field]
    if (typeof value === 'string') return value.trim() !== ''
    return value !== null && value !== undefined
  }).length

  return Math.round((filledFields / requiredFields.length) * 100)
}

// Calculate ntc of depo form progress
const calculateNtcOfDepoProgress = () => {
  const requiredFields = [
    'PlaintiffNames', 'DefendantNames', 'CourtName', 'CaseNumber', 'JudgeName',
    'HearingDate', 'HearingTime', 'ComplaintFilingDate', 'LetterDate', 
    'ExecutedDate', 'RequestNumber', 'ServerName'
  ]

  const filledFields = requiredFields.filter(field => {
    const value = formStore.ntcOfDepoForm[field]
    if (Array.isArray(value)) return value.filter(name => name.trim()).length > 0
    if (typeof value === 'string') return value.trim() !== ''
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
    case 'demurrer':
      return demurrerFormRef.value
    case 'motionToStrike':
      return motionToStrikeFormRef.value
    case 'requestForProduction':
      return requestForProductionFormRef.value
    case 'pmpDepo':
      return pmpDepoFormRef.value
    case 'ntcOfDepo':
      return ntcOfDepoFormRef.value
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
    // 继续执行，不阻止提交
  }

  // 准备提交数据，包含邮箱地址和计算字段
  let formData = formStore.getCurrentFormData()
  
  // 对于 Complaint 表单，需要合并计算字段
  if (formStore.currentFormType === 'complaint') {
    const calculations = formStore.complaintCalculations
    
    // 将计算字段映射为规格表中的字段名并合并到formData中
    const calculatedFields = {
      // 复数形式字段
      PlaintiffPlurality1: calculations.plaintiffPlurality1,
      PlaintiffPlurality2: calculations.plaintiffPlurality2, 
      DefendantPlurality1: calculations.defendantPlurality1,
      DefendantPlurality2: calculations.defendantPlurality2,
      
      // 基础计算字段
      DOE: calculations.doe,
      OvertimeHoursTotal: calculations.overtimeHoursTotal,
      '1.5OvertimeHours': calculations.oneAndHalfOvertimeHours,
      
      // 损害赔偿字段
      WageStatementPenalty: calculations.wageStatementPenalty,
      DamageUnpaidWages: calculations.damageUnpaidWages,
      DamageMealBreaks: calculations.damageMealBreaks,
      DamageRestBreaks: calculations.damageRestBreaks,
      DamageOvertime: calculations.damageOvertime,
      DamageWaitingTime: calculations.damageWaitingTime,
      DamageTotal: calculations.damageTotal,
      
      // 利息字段
      InterestPeriod: calculations.interestPeriod,
      PreJudgmentInterest: calculations.preJudgmentInterest,
      DamageTotalIncludingInterest: calculations.damageTotalIncludingInterest,
      
      // 日期和状态字段
      ExecutedDate: calculations.executedDate,
      CauseNumber: calculations.causeNumber,
      '3SOL': calculations.sol3,
      '4SOL': calculations.sol4,
      OvertimeStatus: calculations.overtimeStatus
    }
    
    // 合并输入字段和计算字段
    formData = { ...formData, ...calculatedFields }
    
    // 将输入的日期字段也转换为美式格式
    if (formData.ComplaintFilingDate) {
      formData.ComplaintFilingDate = formatLegalDate(formData.ComplaintFilingDate)
    }
    if (formData.EmploymentStartDate) {
      formData.EmploymentStartDate = formatLegalDate(formData.EmploymentStartDate)
    }
    if (formData.EmploymentEndDate) {
      formData.EmploymentEndDate = formatLegalDate(formData.EmploymentEndDate)
    }
  }

  const submissionData = {
    submissionEmail: formStore.submissionEmail,
    formType: formStore.currentFormType,
    formData: formData,
    timestamp: new Date().toISOString()
  }

  // 验证表单（非阻塞）
  const formRef = getCurrentFormRef()
  if (formRef && formRef.validate) {
    try {
      await formRef.validate()
      console.log('表单验证通过')
    } catch (error) {
      console.log('表单验证失败，但仍然提交:', error)
      ElMessage.warning('Some fields may be incomplete, but form will be submitted')
    }
  }

  // 发送POST请求
  ElMessage.success('Form submitted successfully!')
  
  // 使用新的调试配置输出详细信息
  API_CONFIG.log('=== 表单提交信息 ===')
  API_CONFIG.log('环境信息:', {
    MODE: API_CONFIG.ENVIRONMENT,
    APP_ENV: API_CONFIG.APP_ENV,
    APP_NAME: API_CONFIG.APP_NAME,
    DEBUG: API_CONFIG.DEBUG
  })
  API_CONFIG.log('提交数据:', submissionData)
  
  try {
    const webhookUrl = API_CONFIG.getWebhookUrl()
    API_CONFIG.log('Webhook URL:', webhookUrl)
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(submissionData)
    })
    
    if (response.ok) {
      API_CONFIG.log('表单提交成功', response.status)
      ElMessage.success(`Form submitted to server successfully! (${API_CONFIG.APP_ENV})`)
    } else {
      const errorText = await response.text()
      API_CONFIG.log('表单提交失败，服务器返回错误', response.status, errorText)
      ElMessage.error(`Server error occurred during submission (${response.status})`)
    }
  } catch (err) {
    API_CONFIG.log('表单提交失败，网络错误:', err)
    ElMessage.error('Network error occurred during submission')
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
