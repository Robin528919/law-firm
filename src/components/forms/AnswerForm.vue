<template>
  <div class="answer-form">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="validationRules"
      label-width="160px"
      size="default"
      @submit.prevent="handleSubmit"
    >
      <!-- Basic Information -->
      <FormGroup
        title="Basic Information"
        description="Basic information for court reply documents"
        icon="Document"
        variant="card"
        :columns="1"
      >
        <el-form-item label="Letter Date" prop="letterDate">
          <el-date-picker 
            v-model="formData.letterDate" 
            type="date" 
            placeholder="e.g. June 23, 2025" 
            style="width: 100%" 
            value-format="YYYY-MM-DD"
            format="YYYY-MM-DD"
          />
        </el-form-item>
        
        <el-form-item label="Last Date to Respond" prop="respDate">
          <el-date-picker 
            v-model="formData.respDate" 
            type="date" 
            placeholder="e.g. June 30, 2025" 
            style="width: 100%" 
            value-format="YYYY-MM-DD"
            format="YYYY-MM-DD"
          />
        </el-form-item>
      </FormGroup>

      <!-- Case Information -->
      <FormGroup
        title="Case Information"
        description="Detailed information of the related case"
        icon="FolderOpened"
        variant="bordered"
        :columns="1"
      >
        <FormField
          label="Case Name"
          v-model="formData.caseName"
          prop="caseName"
          type="text"
          placeholder="e.g. James Doe v. Chris Wu"
          required
        />
        
        <FormField
          label="Case Number"
          v-model="formData.caseNumber"
          prop="caseNumber"
          type="text"
          placeholder="e.g. LASC123456"
          required
        />
        
        <!-- Defendant Name Complex Field -->
        <div class="defendant-name-group">
          <label class="field-group-label">Defendant Name</label>
          <DefendantNameField
            :defendant-name="formData.defendantName"
            :defendant-state="formData.defendantState"
            :defendant-entity-type="formData.defendantEntityType"
            required
            @update:defendant-name="(value) => handleFieldChange(value, 'defendantName')"
            @update:defendant-state="(value) => handleFieldChange(value, 'defendantState')"
            @update:defendant-entity-type="(value) => handleFieldChange(value, 'defendantEntityType')"
          />
        </div>
        
        <FormField
          label="Affirmative Defense Number Subject to Demurrer"
          v-model="formData.adNumber"
          prop="adNumber"
          type="text"
          placeholder="e.g. First through Twentieth"
          required
          description="Enter the range of affirmative defense numbers subject to demurrer"
        />
      </FormGroup>

      <!-- Opposing Counsel Information -->
      <FormGroup
        title="Opposing Counsel Information"
        description="Detailed information of opposing counsel and law firm"
        icon="Avatar"
        variant="card"
        :columns="1"
      >
        <FormField
          label="Opposing Counsel's Name"
          v-model="formData.ocName"
          prop="ocName"
          type="textarea"
          placeholder="e.g. Amy Doe\nBryant Doe"
          :rows="3"
          required
          description="Allow line break for multiple counsel names"
        />
        
        <FormField
          label="Opposing Firm Name"
          v-model="formData.ocFirm"
          prop="ocFirm"
          type="text"
          placeholder="e.g. ABC, PC"
          required
        />
        
        <FormField
          label="Opposing Firm Address"
          v-model="formData.ocAddress"
          prop="ocAddress"
          type="textarea"
          placeholder="e.g. 123 Grand Ave, Los Angeles, CA 90019"
          :rows="4"
          required
          description="Allow line break for complete mailing address"
        />
      </FormGroup>

      <!-- Formatted Preview -->
      <FormGroup
        title="Formatted Preview"
        description="Standardized format preview generated based on input information"
        icon="View"
        variant="default"
        :columns="1"
      >
        <div class="preview-section">
          <h4>Letter Header Information:</h4>
          <div class="preview-content">
            <p><strong>Date:</strong> {{ formattedLetterDate }}</p>
            <p><strong>Case:</strong> {{ formData?.caseName || 'To be entered' }}</p>
            <p><strong>Case Number:</strong> {{ formData?.caseNumber || 'To be entered' }}</p>
          </div>
          
          <h4 style="margin-top: 20px;">Opposing Counsel Information:</h4>
          <div class="preview-content">
            <div v-if="formData?.ocName" style="white-space: pre-line;">
              {{ formData.ocName }}
            </div>
            <div v-else class="placeholder-text">Opposing Counsel's Name - To be entered</div>
            
            <div v-if="formData?.ocFirm" style="margin-top: 8px;">
              {{ formData.ocFirm }}
            </div>
            <div v-else class="placeholder-text">Law Firm - To be entered</div>
            
            <div v-if="formData?.ocAddress" style="margin-top: 8px; white-space: pre-line;">
              {{ formData.ocAddress }}
            </div>
            <div v-else class="placeholder-text">Firm Address - To be entered</div>
          </div>
          
          <h4 style="margin-top: 20px;">Key Information:</h4>
          <div class="preview-content">
            <p><strong>Defendant:</strong> {{ formStore.formattedAnswerDefendantName || 'To be entered' }}</p>
            <p><strong>Affirmative Defense Number:</strong> {{ formData?.adNumber || 'To be entered' }}</p>
            <p><strong>Response Deadline:</strong> {{ formattedRespDate }}</p>
          </div>
        </div>
      </FormGroup>

      <!-- Form Statistics -->
      <FormGroup
        title="Form Statistics"
        description="Completion status and data statistics of the current form"
        icon="DataAnalysis"
        variant="bordered"
        :columns="1"
      >
        <FormField
          label="Required Fields Completion"
          :model-value="completionPercentage"
          type="number"
          :is-calculated="true"
          :display-value="`${completionPercentage}%`"
        />
        
        <FormField
          label="Form Status"
          :model-value="formStatus"
          type="text"
          :is-calculated="true"
          :display-value="formStatus"
        />
        
        <FormField
          label="Total Fields"
          :model-value="totalFields"
          type="number"
          :is-calculated="true"
          :display-value="`${totalFields} fields`"
        />
        
        <FormField
          label="Filled Fields"
          :model-value="filledFields"
          type="number"
          :is-calculated="true"
          :display-value="`${filledFields} fields`"
        />
      </FormGroup>
    </el-form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import FormGroup from '@/components/common/FormGroup.vue'
import FormField from '@/components/common/FormField.vue'
import DefendantNameField from '@/components/common/DefendantNameField.vue'
import { useFormStore } from '@/stores/formStore'
import { VALIDATION_RULES } from '@/utils/constants'
import { formatLegalDate } from '@/utils/calculations'

// 使用表单状态管理
const formStore = useFormStore()
const formRef = ref()

// 表单数据 - 直接使用 ref，支持双向绑定
const formData = formStore.answerForm

// 验证规则
const validationRules = {
  letterDate: [VALIDATION_RULES.required, VALIDATION_RULES.date],
  ocName: [VALIDATION_RULES.required],
  ocFirm: [VALIDATION_RULES.required],
  ocAddress: [VALIDATION_RULES.required],
  caseName: [VALIDATION_RULES.required],
  caseNumber: [VALIDATION_RULES.required],
  defendantName: [VALIDATION_RULES.required],
  defendantState: [VALIDATION_RULES.required],
  defendantEntityType: [VALIDATION_RULES.required],
  adNumber: [VALIDATION_RULES.required],
  respDate: [VALIDATION_RULES.required, VALIDATION_RULES.date]
}

// 格式化日期
const formattedLetterDate = computed(() => {
  return formData.value?.letterDate ? formatLegalDate(formData.value.letterDate) : '待选择'
})

const formattedRespDate = computed(() => {
  return formData.value?.respDate ? formatLegalDate(formData.value.respDate) : '待选择'
})

// 表单统计
const totalFields = computed(() => {
  return formData.value ? Object.keys(formData.value).length : 0
})

const filledFields = computed(() => {
  return formData.value ? Object.values(formData.value).filter(value => {
    if (typeof value === 'string') return value.trim() !== ''
    return value !== null && value !== undefined
  }).length : 0
})

const completionPercentage = computed(() => {
  const percentage = totalFields.value > 0 ? Math.round((filledFields.value / totalFields.value) * 100) : 0
  return Math.min(percentage, 100)
})

const formStatus = computed(() => {
  const percentage = completionPercentage.value
  if (percentage === 100) return 'Completed'
  if (percentage >= 80) return 'Near Completion'
  if (percentage >= 50) return 'Half Complete'
  if (percentage >= 20) return 'Started'
  return 'Not Started'
})

// 字段变更处理
const handleFieldChange = (value, field) => {
  if (field) {
    formStore.updateAnswerForm(field, value)
  }
}

// 表单提交
const handleSubmit = async () => {
  try {
    const valid = await formRef.value.validate()
    if (valid) {
      console.log('回复表单验证通过，可以提交')
    }
  } catch (error) {
    console.log('回复表单验证失败:', error)
  }
}

// 暴露方法给父组件
defineExpose({
  validate: () => formRef.value?.validate(),
  resetForm: () => formRef.value?.resetFields(),
  formRef
})
</script>

<style scoped>
.answer-form {
  width: 100%;
}

.preview-section {
  background: var(--background-light);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  border: 1px solid var(--border);
}

.preview-section h4 {
  color: var(--primary-color);
  font-size: var(--font-md);
  font-weight: 600;
  margin: 0 0 var(--spacing-md) 0;
  display: flex;
  align-items: center;
}

.preview-section h4::before {
  content: '';
  width: 3px;
  height: 16px;
  background: var(--primary-color);
  margin-right: var(--spacing-sm);
  border-radius: var(--radius-sm);
}

.preview-content {
  background: var(--background);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  border: 1px solid var(--border-light);
  font-family: 'Courier New', monospace;
  font-size: var(--font-sm);
  line-height: 1.6;
}

.preview-content p {
  margin: 0 0 var(--spacing-xs) 0;
}

.preview-content strong {
  color: var(--text-primary);
  font-weight: 600;
}

.placeholder-text {
  color: var(--text-light);
  font-style: italic;
}

/* Defendant Name Group */
.defendant-name-group {
  margin-bottom: var(--spacing-lg);
  grid-column: 1 / -1; /* 跨越整个网格 */
}

.field-group-label {
  display: block;
  font-size: var(--font-sm);
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
}

.field-group-label::after {
  content: ' *';
  color: var(--danger-color);
  font-weight: bold;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .answer-form :deep(.el-form-item__label) {
    font-size: 14px;
  }
  
  .preview-content {
    font-size: var(--font-xs);
  }
}
</style> 