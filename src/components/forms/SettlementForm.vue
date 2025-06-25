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
      <!-- 当事人信息 -->
      <FormGroup
        title="当事人信息"
        description="和解协议中的原告和被告信息"
        icon="UserFilled"
        variant="card"
        :columns="2"
      >
        <FormField
          label="原告姓名"
          v-model="formData.plaintiffName"
          prop="plaintiffName"
          type="text"
          placeholder="请输入原告姓名，多个原告用逗号分隔"
          required
          :tooltip="FIELD_TOOLTIPS.plaintiffName"
          @change="(value) => handleFieldChange(value, 'plaintiffName')"
        />
        
        <FormField
          label="被告姓名"
          v-model="formData.defendantName"
          prop="defendantName"
          type="text"
          placeholder="请输入被告姓名，多个被告用逗号分隔"
          required
          :tooltip="FIELD_TOOLTIPS.defendantName"
          @change="(value) => handleFieldChange(value, 'defendantName')"
        />
      </FormGroup>

      <!-- 案件信息 -->
      <FormGroup
        title="案件信息"
        description="相关案件的法院和案件详细信息"
        icon="ScaleToOriginal"
        variant="bordered"
        :columns="2"
      >
        <FormField
          label="法院名称"
          v-model="formData.courtName"
          prop="courtName"
          type="text"
          placeholder="例如：Los Angeles Superior Court"
          required
        />
        
        <FormField
          label="案件名称(官方)"
          v-model="formData.caseName"
          prop="caseName"
          type="text"
          placeholder="例如：James Doe v. Chris Wu"
          required
        />
        
        <FormField
          label="案件号"
          v-model="formData.caseNumber"
          prop="caseNumber"
          type="text"
          placeholder="如暂无案件号请留空"
          :tooltip="FIELD_TOOLTIPS.caseNumber"
        />
      </FormGroup>

      <!-- 和解金额 -->
      <FormGroup
        title="和解金额"
        description="和解协议的金额信息和付款安排"
        icon="Money"
        variant="card"
        :columns="2"
      >
        <FormField
          label="和解金额(数字)"
          v-model="formData.settlementNumericalAmount"
          prop="settlementNumericalAmount"
          type="number"
          placeholder="请输入和解金额"
          :min="0"
          :precision="2"
          required
          @change="handleAmountChange"
        />
        
        <FormField
          label="和解金额(大写)"
          v-model="formData.settlementWrittenAmount"
          prop="settlementWrittenAmount"
          type="text"
          placeholder="例如：FIFTY THOUSAND"
          required
          description="请输入金额的英文大写形式（不含&quot;Dollars&quot;）"
        />
        
        <FormField
          label="分期付款详情"
          v-model="formData.installmentPayment"
          prop="installmentPayment"
          type="textarea"
          placeholder="例如：$25,000 payable no later than March 1, 2020; $25,000 payable no later than June 1, 2020"
          :rows="4"
          description="可添加多个分期付款安排，用分号分隔"
        />
      </FormGroup>

      <!-- 辩护律师信息 -->
      <FormGroup
        title="辩护律师信息"
        description="被告方律师和律师事务所的联系信息"
        icon="Postcard"
        variant="default"
        :columns="2"
      >
        <FormField
          label="联系方式"
          v-model="formData.defenseContactMethod"
          prop="defenseContactMethod"
          type="select"
          placeholder="请选择联系方式"
          :options="contactMethodOptions"
          required
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
          label="辩护律师姓名"
          v-model="formData.defenseCounselName"
          prop="defenseCounselName"
          type="text"
          placeholder="请输入辩护律师姓名"
          required
        />
        
        <FormField
          label="辩护律师事务所"
          v-model="formData.defenseCounselFirm"
          prop="defenseCounselFirm"
          type="text"
          placeholder="请输入辩护律师事务所名称"
          required
        />
        
        <FormField
          label="辩护事务所地址"
          v-model="formData.defenseFirmAddress"
          prop="defenseFirmAddress"
          type="textarea"
          placeholder="请输入辩护律师事务所的完整地址"
          :rows="3"
          required
        />
      </FormGroup>

      <!-- 语法助手 -->
      <FormGroup
        title="语法助手"
        description="根据当事人数量自动生成的语法形式"
        icon="ChatDotRound"
        variant="bordered"
        :columns="2"
      >
        <FormField
          label="原告复数形式"
          :model-value="plaintiffPlurality"
          type="text"
          :is-calculated="true"
          :display-value="plaintiffPlurality"
        />
        
        <FormField
          label="被告复数形式"
          :model-value="defendantPlurality"
          type="text"
          :is-calculated="true"
          :display-value="defendantPlurality"
        />
      </FormGroup>

      <!-- 和解协议预览 -->
      <FormGroup
        title="和解协议预览"
        description="根据输入信息生成的和解协议格式预览"
        icon="Document"
        variant="card"
        :columns="1"
      >
        <div class="agreement-preview">
          <h4>和解协议要点：</h4>
          <div class="preview-content">
            <div class="agreement-section">
              <strong>案件信息：</strong>
              <p>{{ formData.caseName || '待输入案件名称' }}</p>
              <p>案件号：{{ formData.caseNumber || '待分配' }}</p>
              <p>法院：{{ formData.courtName || '待输入法院名称' }}</p>
            </div>
            
            <div class="agreement-section">
              <strong>当事人：</strong>
              <p>{{ plaintiffPlurality }}：{{ formData.plaintiffName || '待输入原告' }}</p>
              <p>{{ defendantPlurality }}：{{ formData.defendantName || '待输入被告' }}</p>
            </div>
            
            <div class="agreement-section">
              <strong>和解金额：</strong>
              <p v-if="formData.settlementNumericalAmount > 0">
                ${{ formData.settlementNumericalAmount.toLocaleString() }} 
                ({{ formData.settlementWrittenAmount || '大写金额待输入' }} DOLLARS)
              </p>
              <p v-else>待输入和解金额</p>
            </div>
            
            <div class="agreement-section" v-if="formData.installmentPayment">
              <strong>付款安排：</strong>
              <div style="white-space: pre-line;">{{ formData.installmentPayment }}</div>
            </div>
            
            <div class="agreement-section">
              <strong>律师联系信息：</strong>
              <p>{{ formData.defenseCounselName || '待输入律师姓名' }}</p>
              <p>{{ formData.defenseCounselFirm || '待输入事务所' }}</p>
              <p style="white-space: pre-line;">{{ formData.defenseFirmAddress || '待输入地址' }}</p>
              <p v-if="formattedContactMethod">{{ formattedContactMethod }}</p>
            </div>
          </div>
        </div>
      </FormGroup>

      <!-- 表单统计 -->
      <FormGroup
        title="表单统计"
        description="当前表单的完成状态和数据统计"
        icon="PieChart"
        variant="default"
        :columns="3"
      >
        <FormField
          label="完成进度"
          :model-value="completionPercentage"
          type="number"
          :is-calculated="true"
          :display-value="`${completionPercentage}%`"
        />
        
        <FormField
          label="总金额"
          :model-value="formData.settlementNumericalAmount"
          type="number"
          :is-calculated="true"
          :display-value="`$${(formData.settlementNumericalAmount || 0).toLocaleString()}`"
        />
        
        <FormField
          label="表单状态"
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
import FormGroup from '@/components/common/FormGroup.vue'
import FormField from '@/components/common/FormField.vue'
import { useFormStore } from '@/stores/formStore'
import { 
  CONTACT_METHOD_OPTIONS, 
  FIELD_TOOLTIPS,
  VALIDATION_RULES 
} from '@/utils/constants'
import { getPlurality } from '@/utils/calculations'

// 使用表单状态管理
const formStore = useFormStore()
const formRef = ref()

// 表单数据
const formData = computed({
  get: () => formStore.settlementForm,
  set: (value) => {
    // 这里可以添加额外的处理逻辑
  }
})

// 联系方式选项
const contactMethodOptions = CONTACT_METHOD_OPTIONS

// 验证规则
const validationRules = {
  plaintiffName: [VALIDATION_RULES.required],
  defendantName: [VALIDATION_RULES.required],
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
  return formData.value.defenseContactMethod && formData.value.defenseContactMethod !== ''
})

const contactInputLabel = computed(() => {
  return formData.value.defenseContactMethod === 'email' ? '邮箱地址' : '传真号码'
})

const contactInputType = computed(() => {
  return formData.value.defenseContactMethod === 'email' ? 'email' : 'text'
})

const contactInputPlaceholder = computed(() => {
  return formData.value.defenseContactMethod === 'email' 
    ? '请输入邮箱地址' 
    : '请输入传真号码 (格式: 123-456-7890)'
})

const contactInputProp = computed(() => {
  return formData.value.defenseContactMethod === 'email' ? 'defenseEmail' : 'defenseFax'
})

const contactInputValue = computed({
  get: () => {
    return formData.value.defenseContactMethod === 'email' 
      ? formData.value.defenseEmail || ''
      : formData.value.defenseFax || ''
  },
  set: (value) => {
    const field = formData.value.defenseContactMethod === 'email' ? 'defenseEmail' : 'defenseFax'
    formStore.updateSettlementForm(field, value)
  }
})

// 格式化的联系方式显示
const formattedContactMethod = computed(() => {
  if (!formData.value.defenseContactMethod) return ''
  
  const method = formData.value.defenseContactMethod
  const value = method === 'email' ? formData.value.defenseEmail : formData.value.defenseFax
  
  if (!value) return ''
  
  const methodText = method === 'email' ? 'Email' : 'Facsimile'
  return `${methodText} to "${value}"`
})

// 复数形式
const plaintiffPlurality = computed(() => {
  const plurality = getPlurality(formData.value.plaintiffName)
  return plurality.form1
})

const defendantPlurality = computed(() => {
  const plurality = getPlurality(formData.value.defendantName)
  return plurality.form1Defendant
})

// 表单统计
const totalRequiredFields = computed(() => {
  return Object.keys(validationRules).length
})

const filledRequiredFields = computed(() => {
  return Object.keys(validationRules).filter(field => {
    const value = formData.value[field]
    if (typeof value === 'string') return value.trim() !== '' && value !== ' '
    if (typeof value === 'number') return value > 0
    return value !== null && value !== undefined
  }).length
})

const completionPercentage = computed(() => {
  return totalRequiredFields.value > 0 
    ? Math.round((filledRequiredFields.value / totalRequiredFields.value) * 100)
    : 0
})

const formStatus = computed(() => {
  const percentage = completionPercentage.value
  if (percentage === 100) return '已完成'
  if (percentage >= 80) return '接近完成'
  if (percentage >= 50) return '半数完成'
  if (percentage >= 20) return '已开始'
  return '未开始'
})

// 字段变更处理
const handleFieldChange = (value, field) => {
  if (field) {
    formStore.updateSettlementForm(field, value)
  }
}

const handleAmountChange = (value) => {
  formStore.updateSettlementForm('settlementNumericalAmount', value)
  // 这里可以添加自动生成大写金额的逻辑
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