<template>
  <div class="settlement-form">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="validationRules"
      label-width="160px"
      size="default"
      @submit.prevent="handleSubmit"
    >
      <!-- Party Information -->
      <FormGroup
        title="Party Information"
        description="Plaintiff and defendant information in the settlement agreement"
        icon="UserFilled"
        variant="card"
        :columns="1"
      >
        <FormField
          label="Plaintiff Name"
          v-model="formData.plaintiffName"
          prop="plaintiffName"
          type="text"
          placeholder="e.g. James Doe, should be followed by individual designation"
          required
          description="Should be followed by an individual designation; Can add multiple"
          @change="(value) => handleFieldChange(value, 'plaintiffName')"
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
      </FormGroup>

      <!-- Case Information -->
      <FormGroup
        title="Case Information"
        description="Court and case details information"
        icon="ScaleToOriginal"
        variant="bordered"
        :columns="1"
      >
        <FormField
          label="Court Name"
          v-model="formData.courtName"
          prop="courtName"
          type="text"
          placeholder="e.g. Los Angeles Superior Court"
          required
        />

        <FormField
          label="Case Name (Official)"
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
          description="Need to set default as space"
        />
      </FormGroup>

      <!-- Settlement Amount -->
      <FormGroup
        title="Settlement Amount"
        description="Settlement amount information and payment arrangements"
        icon="Money"
        variant="card"
        :columns="1"
      >
        <FormField
          label="Settlement Numerical Amount (without $)"
          v-model="formData.settlementNumericalAmount"
          prop="settlementNumericalAmount"
          type="number"
          placeholder="50,000"
          :min="0"
          :precision="2"
          required
          @change="handleAmountChange"
        />

        <div class="amount-words-field">
          <FormField
            label="Settlement Written Amount (without Dollars)"
            v-model="formData.settlementWrittenAmount"
            prop="settlementWrittenAmount"
            type="text"
            placeholder="e.g. FIFTY THOUSAND"
            required
            description="Automatically generated based on numerical amount, can be manually edited"
          />
          <el-button
            v-if="formData.settlementNumericalAmount > 0"
            type="primary"
            size="small"
            @click="generateAmountWords"
            title="Regenerate based on numerical amount"
            style="margin-top: 8px; align-self: flex-start;"
          >
            <el-icon><Refresh /></el-icon>
            Regenerate
          </el-button>
        </div>

        <FormField
          label="Installment Payments"
          v-model="formData.installmentPayment"
          prop="installmentPayment"
          type="textarea"
          placeholder='e.g. $50,000 payable no later than March 1, 2020'
          :rows="4"
          description="Can add multiple installment payment, with semicolon separating each item. Can add number and date for each installment."
        />
      </FormGroup>

      <!-- Defense Counsel Information -->
      <FormGroup
        title="Defense Counsel Information"
        description="Defense attorney and law firm contact information"
        icon="Postcard"
        variant="default"
        :columns="1"
      >
        <FormField
          label="Defense Counsel Contact Method"
          v-model="formData.defenseContactMethod"
          prop="defenseContactMethod"
          type="select"
          placeholder="Select contact method"
          :options="contactMethodOptions"
          required
          description="Options: Email, Facsimile, used to send default notification"
          @change="handleContactMethodChange"
        />

        <FormField
          v-if="showContactInput"
          :label="contactInputLabel"
          v-model="contactInputValue"
          :prop="contactInputProp"
          :type="contactInputType"
          :placeholder="contactInputPlaceholder"
          required
          @change="handleContactInputChange"
        />

        <FormField
          label="Defense Counsel Name"
          v-model="formData.defenseCounselName"
          prop="defenseCounselName"
          type="text"
          placeholder="e.g. De Att"
          required
        />

        <FormField
          label="Defense Counsel Firm"
          v-model="formData.defenseCounselFirm"
          prop="defenseCounselFirm"
          type="text"
          placeholder="e.g. DA, PC"
          required
        />

        <FormField
          label="Defense Firm Address"
          v-model="formData.defenseFirmAddress"
          prop="defenseFirmAddress"
          type="textarea"
          placeholder="e.g. 123 Hill St, Los Angeles, CA 90018"
          :rows="3"
          required
        />
      </FormGroup>

      <!-- Grammar Helper -->
      <FormGroup
        title="Grammar Helper"
        description="Automatically generated grammar forms based on number of parties"
        icon="ChatDotRound"
        variant="bordered"
        :columns="1"
      >
        <FormField
          label="Plaintiff Plurality"
          :model-value="plaintiffPlurality"
          type="text"
          :is-calculated="true"
          :display-value="plaintiffPlurality"
          description="Plaintiff or Plaintiffs - automatically applied based on single or multiple plaintiffs"
        />

        <FormField
          label="Defendant Plurality"
          :model-value="defendantPlurality"
          type="text"
          :is-calculated="true"
          :display-value="defendantPlurality"
          description="Defendant or Defendants - automatically applied based on single or multiple defendants"
        />
      </FormGroup>

      <!-- Settlement Agreement Preview -->
      <FormGroup
        title="Settlement Agreement Preview"
        description="Settlement agreement format preview generated based on input information"
        icon="Document"
        variant="card"
        :columns="1"
      >
        <div class="agreement-preview">
          <h4>Settlement Agreement Key Points:</h4>
          <div class="preview-content">
            <div class="agreement-section">
              <strong>Case Information:</strong>
              <p>{{ formData?.caseName || 'To be entered case name' }}</p>
              <p>Case Number: {{ formData?.caseNumber || 'To be assigned' }}</p>
              <p>Court: {{ formData?.courtName || 'To be entered court name' }}</p>
            </div>

            <div class="agreement-section">
              <strong>Parties:</strong>
              <p>{{ plaintiffPlurality }}: {{ formData?.plaintiffName || 'To be entered plaintiff' }}</p>
              <p>{{ defendantPlurality }}: {{ formStore.formattedSettlementDefendantName || 'To be entered defendant' }}</p>
            </div>

            <div class="agreement-section">
              <strong>Settlement Amount:</strong>
              <p v-if="formData?.settlementNumericalAmount > 0">
                ${{ formData.settlementNumericalAmount.toLocaleString() }}
                ({{ formData?.settlementWrittenAmount || 'Written amount to be entered' }} DOLLARS)
              </p>
              <p v-else>To be entered settlement amount</p>
            </div>

            <div class="agreement-section" v-if="formData?.installmentPayment">
              <strong>Payment Arrangement:</strong>
              <div style="white-space: pre-line;">{{ formData.installmentPayment }}</div>
            </div>

            <div class="agreement-section">
              <strong>Defense Counsel Contact Information:</strong>
              <p>{{ formData?.defenseCounselName || 'To be entered counsel name' }}</p>
              <p>{{ formData?.defenseCounselFirm || 'To be entered firm' }}</p>
              <p style="white-space: pre-line;">{{ formData?.defenseFirmAddress || 'To be entered address' }}</p>
              <p v-if="formattedContactMethod">{{ formattedContactMethod }}</p>
            </div>
          </div>
        </div>
      </FormGroup>

      <!-- Execution Information -->
      <FormGroup
        title="Execution Information"
        description="Execution date and related information of the settlement agreement"
        icon="Calendar"
        variant="bordered"
        :columns="1"
      >
        <FormField
          label="Agreement Execution Date"
          :model-value="executedDate"
          type="text"
          :is-calculated="true"
          :display-value="executedDate"
          description="Settlement agreement signing execution date, automatically generated as current date"
        />

        <FormField
          label="Agreement Validity"
          :model-value="agreementValidity"
          type="text"
          :is-calculated="true"
          :display-value="agreementValidity"
        />
      </FormGroup>

      <!-- Form Statistics -->
      <FormGroup
        title="Form Statistics"
        description="Completion status and data statistics of the current form"
        icon="PieChart"
        variant="default"
        :columns="1"
      >
        <FormField
          label="Completion Progress"
          :model-value="completionPercentage"
          type="number"
          :is-calculated="true"
          :display-value="`${completionPercentage}%`"
        />

        <FormField
          label="Total Amount"
          :model-value="formData?.settlementNumericalAmount"
          type="number"
          :is-calculated="true"
          :display-value="`$${(formData?.settlementNumericalAmount || 0).toLocaleString()}`"
        />

        <FormField
          label="Form Status"
          :model-value="formStatus"
          type="text"
          :is-calculated="true"
          :display-value="formStatus"
        />
      </FormGroup>
    </el-form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Refresh } from '@element-plus/icons-vue'
import FormGroup from '@/components/common/FormGroup.vue'
import FormField from '@/components/common/FormField.vue'
import DefendantNameField from '@/components/common/DefendantNameField.vue'
import { useFormStore } from '@/stores/formStore'
import {
  CONTACT_METHOD_OPTIONS,
  VALIDATION_RULES
} from '@/utils/constants'
import { getPlurality, convertAmountToWords, formatLegalDate } from '@/utils/calculations'

// 使用表单状态管理
const formStore = useFormStore()
const formRef = ref()

// 表单数据 - 直接使用 ref，支持双向绑定
const formData = formStore.settlementForm

// 联系方式选项
const contactMethodOptions = CONTACT_METHOD_OPTIONS

// 验证规则
const validationRules = {
  plaintiffName: [VALIDATION_RULES.required],
  defendantName: [VALIDATION_RULES.required],
  defendantState: [VALIDATION_RULES.required],
  defendantEntityType: [VALIDATION_RULES.required],
  courtName: [VALIDATION_RULES.required],
  caseName: [VALIDATION_RULES.required],
  settlementWrittenAmount: [VALIDATION_RULES.required],
  settlementNumericalAmount: [VALIDATION_RULES.required, VALIDATION_RULES.number],
  defenseContactMethod: [VALIDATION_RULES.required],
  defenseCounselName: [VALIDATION_RULES.required],
  defenseCounselFirm: [VALIDATION_RULES.required],
  defenseFirmAddress: [VALIDATION_RULES.required]
}

// 动态联系方式输入
const showContactInput = computed(() => {
  return formData.value?.defenseContactMethod && formData.value.defenseContactMethod !== ''
})

const contactInputLabel = computed(() => {
  return formData.value?.defenseContactMethod === 'email' ? 'Email Address' : 'Fax Number'
})

const contactInputType = computed(() => {
  return formData.value?.defenseContactMethod === 'email' ? 'email' : 'text'
})

const contactInputPlaceholder = computed(() => {
  return formData.value?.defenseContactMethod === 'email'
    ? 'Enter email address'
    : 'Enter fax number (format: 123-456-7890)'
})

const contactInputProp = computed(() => {
  return formData.value?.defenseContactMethod === 'email' ? 'defenseEmail' : 'defenseFax'
})

const contactInputValue = computed({
  get: () => {
    return formData.value?.defenseContactMethod === 'email'
      ? formData.value.defenseEmail || ''
      : formData.value.defenseFax || ''
  },
  set: (value) => {
    const field = formData.value?.defenseContactMethod === 'email' ? 'defenseEmail' : 'defenseFax'
    formStore.updateSettlementForm(field, value)
  }
})

// 格式化的联系方式显示
const formattedContactMethod = computed(() => {
  if (!formData.value?.defenseContactMethod) return ''

  const method = formData.value.defenseContactMethod
  const value = method === 'email' ? formData.value.defenseEmail : formData.value.defenseFax

  if (!value) return ''

  const methodText = method === 'email' ? 'Email' : 'Facsimile'
  return `${methodText} to "${value}"`
})

// 复数形式
const plaintiffPlurality = computed(() => {
  const plurality = getPlurality(formData.value?.plaintiffName || '')
  return plurality.form1
})

const defendantPlurality = computed(() => {
  const plurality = getPlurality(formStore.formattedSettlementDefendantName || '')
  return plurality.form1Defendant
})

// 表单统计
const totalRequiredFields = computed(() => {
  return Object.keys(validationRules).length
})

const filledRequiredFields = computed(() => {
  return formData.value ? Object.keys(validationRules).filter(field => {
    const value = formData.value[field]
    if (typeof value === 'string') return value.trim() !== '' && value !== ' '
    if (typeof value === 'number') return value > 0
    return value !== null && value !== undefined
  }).length : 0
})

const completionPercentage = computed(() => {
  return totalRequiredFields.value > 0
    ? Math.round((filledRequiredFields.value / totalRequiredFields.value) * 100)
    : 0
})

const formStatus = computed(() => {
  const percentage = completionPercentage.value
  if (percentage === 100) return 'Completed'
  if (percentage >= 80) return 'Near Completion'
  if (percentage >= 50) return 'Half Complete'
  if (percentage >= 20) return 'Started'
  return 'Not Started'
})

// 自动日期字段
const executedDate = computed(() => {
  return formatLegalDate(new Date())
})

const agreementValidity = computed(() => {
  const percentage = completionPercentage.value
  if (percentage === 100) return 'Valid Agreement'
  if (percentage >= 80) return 'Near Complete'
  return 'To be Improved'
})

// 字段变更处理
const handleFieldChange = (value, field) => {
  if (field) {
    formStore.updateSettlementForm(field, value)
  }
}

const handleAmountChange = (value) => {
  formStore.updateSettlementForm('settlementNumericalAmount', value)
  // 自动生成大写金额
  if (value && value > 0) {
    const wordsAmount = convertAmountToWords(value)
    formStore.updateSettlementForm('settlementWrittenAmount', wordsAmount)
  } else {
    formStore.updateSettlementForm('settlementWrittenAmount', '')
  }
}

const handleContactMethodChange = (value) => {
  formStore.updateSettlementForm('defenseContactMethod', value)
  // 清空之前的联系方式输入
  formStore.updateSettlementForm('defenseEmail', '')
  formStore.updateSettlementForm('defenseFax', '')
}

const handleContactInputChange = (value) => {
  contactInputValue.value = value
}

const generateAmountWords = () => {
  const amount = formData.value?.settlementNumericalAmount
  if (amount && amount > 0) {
    const wordsAmount = convertAmountToWords(amount)
    formStore.updateSettlementForm('settlementWrittenAmount', wordsAmount)
  }
}

// 表单提交
const handleSubmit = async () => {
  try {
    const valid = await formRef.value.validate()
    if (valid) {
      console.log('和解协议表单验证通过，可以提交')
    }
  } catch (error) {
    console.log('和解协议表单验证失败:', error)
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
.settlement-form {
  width: 100%;
}

.agreement-preview {
  background: var(--background-light);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  border: 1px solid var(--border);
}

.agreement-preview h4 {
  color: var(--primary-color);
  font-size: var(--font-lg);
  font-weight: 600;
  margin: 0 0 var(--spacing-lg) 0;
  display: flex;
  align-items: center;
}

.agreement-preview h4::before {
  content: '';
  width: 4px;
  height: 20px;
  background: var(--primary-color);
  margin-right: var(--spacing-md);
  border-radius: var(--radius-sm);
}

.preview-content {
  background: var(--background);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  border: 1px solid var(--border-light);
  font-family: 'Times New Roman', serif;
  line-height: 1.7;
}

.agreement-section {
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--border-light);
}

.agreement-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.agreement-section strong {
  color: var(--primary-color);
  font-weight: 600;
  display: block;
  margin-bottom: var(--spacing-sm);
}

.agreement-section p {
  margin: 0 0 var(--spacing-xs) 0;
  color: var(--text-primary);
}

.amount-words-field {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.amount-words-field .el-button {
  width: fit-content;
  background: linear-gradient(135deg, var(--primary-color), var(--primary-color-light));
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.amount-words-field .el-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
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
  .settlement-form :deep(.el-form-item__label) {
    font-size: 14px;
  }

  .preview-content {
    font-size: var(--font-sm);
    padding: var(--spacing-md);
  }
}
</style>
