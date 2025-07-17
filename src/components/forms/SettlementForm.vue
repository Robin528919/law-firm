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
          v-model="formData.PlaintiffName"
          prop="PlaintiffName"
          type="text"
          placeholder="e.g. James Doe, should be followed by individual designation"
          required
          description="Should be followed by an individual designation; Can add multiple"
          @change="(value) => handleFieldChange(value, 'PlaintiffName')"
        />

        <!-- Defendant Name Complex Field -->
        <div class="defendant-name-group">
          <label class="field-group-label">Defendant Name</label>
          <DefendantNameField
            :defendant-name="formData.DefendantName"
            :defendant-state="formData.DefendantState"
            :defendant-entity-type="formData.DefendantEntityType"
            required
            @update:defendant-name="(value) => handleFieldChange(value, 'DefendantName')"
            @update:defendant-state="(value) => handleFieldChange(value, 'DefendantState')"
            @update:defendant-entity-type="(value) => handleFieldChange(value, 'DefendantEntityType')"
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
          v-model="formData.CourtName"
          prop="CourtName"
          type="text"
          placeholder="e.g. Los Angeles Superior Court"
          required
        />

        <FormField
          label="Case Name (Official)"
          v-model="formData.CaseName"
          prop="CaseName"
          type="text"
          placeholder="e.g. James Doe v. Chris Wu"
          required
        />

        <FormField
          label="Case Number"
          v-model="formData.CaseNumber"
          prop="CaseNumber"
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
          v-model="formData.SettlementNumericalAmount"
          prop="SettlementNumericalAmount"
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
            v-model="formData.SettlementWrittenAmount"
            prop="SettlementWrittenAmount"
            type="text"
            placeholder="e.g. FIFTY THOUSAND"
            required
            description="Automatically generated based on numerical amount, can be manually edited"
          />
          <el-button
            v-if="formData.SettlementNumericalAmount > 0"
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
          v-model="formData.InstallmentPayment"
          prop="InstallmentPayment"
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
          v-model="formData.DefenseContactMethod"
          prop="DefenseContactMethod"
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
          v-model="formData.DefenseCounselName"
          prop="DefenseCounselName"
          type="text"
          placeholder="e.g. De Att"
          required
        />

        <FormField
          label="Defense Counsel Firm"
          v-model="formData.DefenseCounselFirm"
          prop="DefenseCounselFirm"
          type="text"
          placeholder="e.g. DA, PC"
          required
        />

        <FormField
          label="Defense Firm Address"
          v-model="formData.DefenseFirmAddress"
          prop="DefenseFirmAddress"
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
          label="Plaintiff"
          v-model="formData.PlaintiffPlurality1"
          type="text"
          :is-calculated="true"
          description='"Plaintiff" or "Plaintiffs". Need to be automatically applied upon single plaintiff or multiple plaintiff'
        />

        <FormField
          label="Defendant"
          v-model="formData.DefendantPlurality1"
          type="text"
          :is-calculated="true"
          description='"Defendant" or "Defendants". Need to be automatically applied upon single defendant or multiple defendants.'
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
              <p>{{ formData?.CaseName || 'To be entered case name' }}</p>
              <p>Case Number: {{ formData?.CaseNumber || 'To be assigned' }}</p>
              <p>Court: {{ formData?.CourtName || 'To be entered court name' }}</p>
            </div>

            <div class="agreement-section">
              <strong>Parties:</strong>
              <p>{{ formData.PlaintiffPlurality1 }}: {{ formData?.PlaintiffName || 'To be entered plaintiff' }}</p>
              <p>{{ formData.DefendantPlurality1 }}: {{ formStore.formattedSettlementDefendantName || 'To be entered defendant' }}</p>
            </div>

            <div class="agreement-section">
              <strong>Settlement Amount:</strong>
              <p v-if="formData?.SettlementNumericalAmount > 0">
                ${{ formData.SettlementNumericalAmount.toLocaleString() }}
                ({{ formData?.SettlementWrittenAmount || 'Written amount to be entered' }} DOLLARS)
              </p>
              <p v-else>To be entered settlement amount</p>
            </div>

            <div class="agreement-section" v-if="formData?.InstallmentPayment">
              <strong>Payment Arrangement:</strong>
              <div style="white-space: pre-line;">{{ formData.InstallmentPayment }}</div>
            </div>

            <div class="agreement-section">
              <strong>Defense Counsel Contact Information:</strong>
              <p>{{ formData?.DefenseCounselName || 'To be entered counsel name' }}</p>
              <p>{{ formData?.DefenseCounselFirm || 'To be entered firm' }}</p>
              <p style="white-space: pre-line;">{{ formData?.DefenseFirmAddress || 'To be entered address' }}</p>
              <p v-if="formattedContactMethod">{{ formattedContactMethod }}</p>
            </div>
          </div>
        </div>
      </FormGroup>

      <!-- 测试数据工具 -->
      <TestDataTool
        :test-data="SETTLEMENT_TEST_DATA"
        :form-data="formData"
        :update-field="updateField"
        form-name="SETTLEMENT"
      />
    </el-form>
  </div>
</template>

<script setup>
import { ref, computed, watchEffect } from 'vue'
import { Refresh } from '@element-plus/icons-vue'
import FormGroup from '@/components/common/FormGroup.vue'
import FormField from '@/components/common/FormField.vue'
import DefendantNameField from '@/components/common/DefendantNameField.vue'
import TestDataTool from '@/components/common/TestDataTool.vue'
import { useFormStore } from '@/stores/formStore'
import {
  CONTACT_METHOD_OPTIONS,
  VALIDATION_RULES,
  SETTLEMENT_TEST_DATA
} from '@/utils/constants'
import { getPlurality, convertAmountToWords, formatLegalDate } from '@/utils/calculations'

// 使用表单状态管理
const formStore = useFormStore()
const formRef = ref()

// 表单数据 - 直接使用 ref，支持双向绑定
const formData = computed(() => formStore.settlementForm)

// 表单字段更新方法
const updateField = (field, value) => {
  formStore.updateSettlementForm(field, value)
}

// 联系方式选项
const contactMethodOptions = CONTACT_METHOD_OPTIONS

// 验证规则
const validationRules = {
  PlaintiffName: [VALIDATION_RULES.required],
  DefendantName: [VALIDATION_RULES.required],
  DefendantState: [VALIDATION_RULES.required],
  DefendantEntityType: [VALIDATION_RULES.required],
  CourtName: [VALIDATION_RULES.required],
  CaseName: [VALIDATION_RULES.required],
  SettlementWrittenAmount: [VALIDATION_RULES.required],
  SettlementNumericalAmount: [VALIDATION_RULES.required, VALIDATION_RULES.number],
  DefenseContactMethod: [VALIDATION_RULES.required],
  DefenseCounselName: [VALIDATION_RULES.required],
  DefenseCounselFirm: [VALIDATION_RULES.required],
  DefenseFirmAddress: [VALIDATION_RULES.required]
}

// 动态联系方式输入
const showContactInput = computed(() => {
  return formData.value?.DefenseContactMethod && formData.value.DefenseContactMethod !== ''
})

const contactInputLabel = computed(() => {
  return formData.value?.DefenseContactMethod === 'email' ? 'Email Address' : 'Fax Number'
})

const contactInputType = computed(() => {
  return formData.value?.DefenseContactMethod === 'email' ? 'email' : 'text'
})

const contactInputPlaceholder = computed(() => {
  return formData.value?.DefenseContactMethod === 'email'
    ? 'Enter email address'
    : 'Enter fax number (format: 123-456-7890)'
})

const contactInputProp = computed(() => {
  return formData.value?.DefenseContactMethod === 'email' ? 'DefenseEmail' : 'DefenseFax'
})

const contactInputValue = computed({
  get: () => {
    return formData.value?.DefenseContactMethod === 'email'
      ? formData.value.DefenseEmail || ''
      : formData.value.DefenseFax || ''
  },
  set: (value) => {
    const field = formData.value?.DefenseContactMethod === 'email' ? 'DefenseEmail' : 'DefenseFax'
    formStore.updateSettlementForm(field, value)
  }
})

// 格式化的联系方式显示
const formattedContactMethod = computed(() => {
  if (!formData.value?.DefenseContactMethod) return ''

  const method = formData.value.DefenseContactMethod
  const value = method === 'email' ? formData.value.DefenseEmail : formData.value.DefenseFax

  if (!value) return ''

  const methodText = method === 'email' ? 'Email' : 'Facsimile'
  return `${methodText} to "${value}"`
})

// 监听原告和被告名称变化，自动更新复数形式
watchEffect(() => {
  const plaintiffPlurality = getPlurality(formData.value?.PlaintiffName || '')
  formStore.updateSettlementForm('PlaintiffPlurality1', plaintiffPlurality.form1)

  const defendantPlurality = getPlurality(formStore.formattedSettlementDefendantName || '')
  formStore.updateSettlementForm('DefendantPlurality1', defendantPlurality.form1Defendant)
})

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

// 字段变更处理
const handleFieldChange = (value, field) => {
  if (field) {
    formStore.updateSettlementForm(field, value)
  }
}

const handleAmountChange = (value) => {
  formStore.updateSettlementForm('SettlementNumericalAmount', value)
  // 自动生成大写金额
  if (value && value > 0) {
    const wordsAmount = convertAmountToWords(value)
    formStore.updateSettlementForm('SettlementWrittenAmount', wordsAmount)
  } else {
    formStore.updateSettlementForm('SettlementWrittenAmount', '')
  }
}

const handleContactMethodChange = (value) => {
  formStore.updateSettlementForm('DefenseContactMethod', value)
  // 清空之前的联系方式输入
  formStore.updateSettlementForm('DefenseEmail', '')
  formStore.updateSettlementForm('DefenseFax', '')
}

const handleContactInputChange = (value) => {
  contactInputValue.value = value
}

const generateAmountWords = () => {
  const amount = formData.value?.SettlementNumericalAmount
  if (amount && amount > 0) {
    const wordsAmount = convertAmountToWords(amount)
    formStore.updateSettlementForm('SettlementWrittenAmount', wordsAmount)
  }
}
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
