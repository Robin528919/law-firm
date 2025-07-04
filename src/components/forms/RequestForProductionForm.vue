<template>
  <div class="request-for-production-form">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="validationRules"
      label-width="160px"
      label-position="top"
      size="default"
      @submit.prevent="handleSubmit"
    >
      <!-- 基本信息组 -->
      <FormGroup
        title="Basic Information"
        description="Basic case and party information"
        icon="User"
        variant="card"
        :columns="1"
      >
        <FormField
          label="Plaintiff Name"
          v-model="formData.PlaintiffName"
          prop="PlaintiffName"
          type="text"
          placeholder="e.g. JUSTINO VALERIANO JIMENEZ"
          required
          description="Name of the plaintiff in the case"
        />

        <FormField
          label="Case Number"
          v-model="formData.CaseNumber"
          prop="CaseNumber"
          type="text"
          placeholder="e.g. 20STCV09196"
          required
          description="Court case number"
        />

        <FormField
          label="Defendant Name"
          v-model="formData.DefendantName"
          prop="DefendantName"
          type="text"
          placeholder="e.g. CASA LEADERS HP, INC"
          required
          description="Name of the defendant in the case"
        />

        <FormField
          label="Judge Name"
          v-model="formData.JudgeName"
          prop="JudgeName"
          type="text"
          placeholder="e.g. Hon. Rafael A. Ongkeko, Dept. '73'"
          required
          description="Name of the assigned judge"
        />
      </FormGroup>

      <!-- 案件日期组 -->
      <FormGroup
        title="Case Dates"
        description="Important dates related to the case"
        icon="Calendar"
        variant="bordered"
        :columns="1"
      >
        <el-form-item label="Complaint Filing Date" prop="ComplaintFilingDate">
          <el-date-picker
            v-model="formData.ComplaintFilingDate"
            type="date"
            placeholder="Select complaint filing date"
            style="width: 100%"
            value-format="YYYY-MM-DD"
            format="MMMM D, YYYY"
          />
        </el-form-item>

        <el-form-item label="Letter Date" prop="LetterDate">
          <el-date-picker
            v-model="formData.LetterDate"
            type="date"
            placeholder="Select letter date"
            style="width: 100%"
            value-format="YYYY-MM-DD"
            format="MMMM D, YYYY"
          />
        </el-form-item>

        <el-form-item label="Trial Date" prop="TrialDate">
          <div class="trial-date-field">
            <el-radio-group v-model="trialDateMode" @change="handleTrialDateModeChange" size="small">
              <el-radio-button :value="'date'">Set Date</el-radio-button>
              <el-radio-button :value="'notSet'">Not Set</el-radio-button>
            </el-radio-group>
            
            <el-date-picker
                v-if="trialDateMode === 'date'"
                v-model="trialDateValue"
                type="date"
                placeholder="Select trial date"
                style="width: 100%; margin-top: 8px;"
                value-format="MMMM D, YYYY"
                format="MMMM D, YYYY"
                @change="handleTrialDateChange"
            />
            
            <div v-else class="not-set-display">
              Trial Date: Not Set
            </div>
          </div>
        </el-form-item>

        <el-form-item label="Executed Date" prop="ExecutedDate">
          <el-date-picker
            v-model="formData.ExecutedDate"
            type="date"
            placeholder="Select executed date"
            style="width: 100%"
            value-format="YYYY-MM-DD"
            format="MMMM D, YYYY"
          />
        </el-form-item>
      </FormGroup>

      <!-- 对方律师信息组 -->
      <FormGroup
        title="Opposing Counsel Information"
        description="Information about opposing counsel and law firm"
        icon="Avatar"
        variant="card"
        :columns="1"
      >
        <FormField
          label="Opposing Counsel's Name"
          v-model="formData.OCName"
          prop="OCName"
          type="text"
          placeholder="e.g. Abraham Sandoval"
          required
          description="Name of the opposing counsel"
        />

        <FormField
          label="Opposing Firm Name"
          v-model="formData.OCFirm"
          prop="OCFirm"
          type="text"
          placeholder="e.g. SANDOVAL LAW, APC"
          required
          description="Name of the opposing law firm"
        />
      </FormGroup>
    </el-form>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import FormGroup from '@/components/common/FormGroup.vue'
import FormField from '@/components/common/FormField.vue'
import { useFormStore } from '@/stores/formStore'
import { VALIDATION_RULES } from '@/utils/constants'

// 使用表单状态管理
const formStore = useFormStore()
const formRef = ref()

// 表单数据 - 直接使用 ref，支持双向绑定
const formData = formStore.requestForProductionForm

// Trial Date 相关状态
const trialDateMode = ref('notSet')
const trialDateValue = ref(null)

// 验证规则
const validationRules = {
  PlaintiffName: [VALIDATION_RULES.required],
  CaseNumber: [VALIDATION_RULES.required],
  DefendantName: [VALIDATION_RULES.required],
  JudgeName: [VALIDATION_RULES.required],
  ComplaintFilingDate: [VALIDATION_RULES.required, VALIDATION_RULES.date],
  LetterDate: [VALIDATION_RULES.required, VALIDATION_RULES.date],
  ExecutedDate: [VALIDATION_RULES.required, VALIDATION_RULES.date],
  OCName: [VALIDATION_RULES.required],
  OCFirm: [VALIDATION_RULES.required]
}

// 初始化 Trial Date 状态
watch(() => formData.TrialDate, (newValue) => {
  if (newValue === 'Not Set' || !newValue) {
    trialDateMode.value = 'notSet'
    trialDateValue.value = null
  } else {
    trialDateMode.value = 'date'
    trialDateValue.value = newValue
  }
}, { immediate: true })

// Trial Date 模式变更处理
const handleTrialDateModeChange = (mode) => {
  if (mode === 'notSet') {
    formStore.updateRequestForProductionForm('TrialDate', 'Not Set')
    trialDateValue.value = null
  } else {
    formStore.updateRequestForProductionForm('TrialDate', trialDateValue.value)
  }
}

// Trial Date 值变更处理
const handleTrialDateChange = (value) => {
  formStore.updateRequestForProductionForm('TrialDate', value)
}

// 表单提交处理
const handleSubmit = () => {
  // 表单提交逻辑在父组件中处理
}

// 表单验证方法
const validate = async () => {
  if (!formRef.value) return false
  try {
    await formRef.value.validate()
    return true
  } catch (error) {
    console.log('Request for Production 表单验证失败:', error)
    return false
  }
}

// 重置表单方法
const resetForm = () => {
  formStore.resetForm('requestForProduction')
  trialDateMode.value = 'notSet'
  trialDateValue.value = null
}

// 暴露方法给父组件
defineExpose({
  validate,
  resetForm
})
</script>

<style scoped>
.request-for-production-form {
  max-width: 100%;
  margin: 0 auto;
}

.trial-date-field {
  width: 100%;
}

.not-set-display {
  padding: 8px 12px;
  background-color: var(--el-fill-color-light);
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  margin-top: 8px;
  color: var(--el-text-color-regular);
}
</style> 