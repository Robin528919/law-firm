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
        <!-- Plaintiff Names Array -->
        <el-form-item label="Plaintiff Names" prop="PlaintiffNames" required>
          <div class="array-field">
            <div v-for="(name, index) in formData.PlaintiffNames" :key="index" class="array-item">
              <el-input
                v-model="formData.PlaintiffNames[index]"
                :placeholder="`Plaintiff ${index + 1} name (e.g. JUSTINO VALERIANO JIMENEZ)`"
                @input="handlePlaintiffNamesChange"
              />
              <el-button
                v-if="formData.PlaintiffNames.length > 1"
                @click="removePlaintiffName(index)"
                type="danger"
                icon="Remove"
                size="small"
                text
                class="remove-btn"
              />
            </div>
            <el-button
              @click="addPlaintiffName"
              type="primary"
              icon="Plus"
              size="small"
              text
              class="add-btn"
            >
              Add Plaintiff
            </el-button>
          </div>
          <div class="field-description">Names of all plaintiffs in the case. Each name will be automatically formatted with ", an individual,"</div>
        </el-form-item>

        <FormField
          label="Case Number"
          v-model="formData.CaseNumber"
          prop="CaseNumber"
          type="text"
          placeholder="e.g. 20STCV09196"
          required
          description="Court case number"
        />

        <!-- Defendant Names Array -->
        <el-form-item label="Defendant Names" prop="DefendantNames" required>
          <div class="array-field">
            <div v-for="(name, index) in formData.DefendantNames" :key="index" class="array-item">
              <el-input
                v-model="formData.DefendantNames[index]"
                :placeholder="`Defendant ${index + 1} name (e.g. CASA LEADERS HP, INC)`"
                @input="handleDefendantNamesChange"
              />
              <el-button
                v-if="formData.DefendantNames.length > 1"
                @click="removeDefendantName(index)"
                type="danger"
                icon="Remove"
                size="small"
                text
                class="remove-btn"
              />
            </div>
            <el-button
              @click="addDefendantName"
              type="primary"
              icon="Plus"
              size="small"
              text
              class="add-btn"
            >
              Add Defendant
            </el-button>
          </div>
          <div class="field-description">Names of all defendants in the case</div>
        </el-form-item>

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

      <!-- 测试数据工具 -->
      <TestDataTool
        :test-data="REQUEST_FOR_PRODUCTION_TEST_DATA"
        :form-data="formData"
        :update-field="updateField"
        form-name="REQUEST FOR PRODUCTION"
        :special-handlers="specialHandlers"
      />
    </el-form>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import FormGroup from '@/components/common/FormGroup.vue'
import FormField from '@/components/common/FormField.vue'
import TestDataTool from '@/components/common/TestDataTool.vue'
import { useFormStore } from '@/stores/formStore'
import { VALIDATION_RULES, REQUEST_FOR_PRODUCTION_TEST_DATA, API_CONFIG } from '@/utils/constants'

// 使用表单状态管理
const formStore = useFormStore()
const formRef = ref()

// 表单数据 - 直接使用 ref，支持双向绑定
const formData = formStore.requestForProductionForm

// 计算字段
const calculations = computed(() => formStore.requestForProductionCalculations)

// Trial Date 相关状态
const trialDateMode = ref('notSet')
const trialDateValue = ref(null)

// 开发测试相关状态
const isDevelopmentMode = computed(() => {
  return API_CONFIG.ENVIRONMENT === 'development' || API_CONFIG.APP_ENV === 'development' || API_CONFIG.DEBUG
})

// 验证规则
const validationRules = {
  PlaintiffNames: [
    {
      required: true,
      validator: (rule, value, callback) => {
        if (!value || !Array.isArray(value) || value.filter(name => name.trim()).length === 0) {
          callback(new Error('At least one plaintiff name is required'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  DefendantNames: [
    {
      required: true,
      validator: (rule, value, callback) => {
        if (!value || !Array.isArray(value) || value.filter(name => name.trim()).length === 0) {
          callback(new Error('At least one defendant name is required'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  CaseNumber: [VALIDATION_RULES.required],
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

// 原告姓名数组处理方法
const addPlaintiffName = () => {
  formData.PlaintiffNames.push('')
}

const removePlaintiffName = (index) => {
  if (formData.PlaintiffNames.length > 1) {
    formData.PlaintiffNames.splice(index, 1)
    handlePlaintiffNamesChange()
  }
}

const handlePlaintiffNamesChange = () => {
  // 触发复数计算更新（如果存在）
  if (calculations.value && calculations.value.plaintiffPlurality1) {
    formStore.updateRequestForProductionForm('PlaintiffPlurality1', calculations.value.plaintiffPlurality1)
  }
}

// 被告姓名数组处理方法
const addDefendantName = () => {
  formData.DefendantNames.push('')
}

const removeDefendantName = (index) => {
  if (formData.DefendantNames.length > 1) {
    formData.DefendantNames.splice(index, 1)
    handleDefendantNamesChange()
  }
}

const handleDefendantNamesChange = () => {
  // 触发复数计算更新（如果存在）
  if (calculations.value && calculations.value.defendantPlurality1) {
    formStore.updateRequestForProductionForm('DefendantPlurality1', calculations.value.defendantPlurality1)
  }
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

// TestDataTool 相关方法
const updateField = (field, value) => {
  formStore.updateRequestForProductionForm(field, value)
}

// 特殊字段处理器
const specialHandlers = {
  PlaintiffNames: (value) => {
    // 处理数组字段
    if (Array.isArray(formData.PlaintiffNames)) {
      formData.PlaintiffNames = [...value]
    } else {
      // 将数组转换为逗号分隔的字符串以兼容当前格式
      formData.PlaintiffName = value.join(', ')
    }
  },
  DefendantNames: (value) => {
    // 处理数组字段
    if (Array.isArray(formData.DefendantNames)) {
      formData.DefendantNames = [...value]
    } else {
      // 将数组转换为逗号分隔的字符串以兼容当前格式
      formData.DefendantName = value.join(', ')
    }
  },
  TrialDate: (value) => {
    // 处理 Trial Date 特殊逻辑
    if (value === 'Not Set' || !value) {
      trialDateMode.value = 'notSet'
      trialDateValue.value = null
      updateField('TrialDate', 'Not Set')
    } else {
      trialDateMode.value = 'date'
      trialDateValue.value = value
      updateField('TrialDate', value)
    }
  }
}

// 重置表单方法
const resetForm = () => {
  formStore.resetForm('requestForProduction')
  trialDateMode.value = 'notSet'
  trialDateValue.value = null
  // 确保数组字段正确重置
  if (!formData.PlaintiffNames || formData.PlaintiffNames.length === 0) {
    formData.PlaintiffNames = ['']
  }
  if (!formData.DefendantNames || formData.DefendantNames.length === 0) {
    formData.DefendantNames = ['']
  }
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

/* Test tools styles */
.test-tools {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
}

.test-info {
  color: var(--el-text-color-regular);
  font-size: 12px;
  background-color: var(--el-fill-color-lighter);
  padding: 6px 10px;
  border-radius: 4px;
  border: 1px solid var(--el-border-color-lighter);
}

.test-tools .el-button {
  background-color: var(--el-color-warning-light-7);
  border-color: var(--el-color-warning-light-5);
}

.test-tools .el-button:hover {
  background-color: var(--el-color-warning-light-5);
  border-color: var(--el-color-warning);
}

/* Array field styles */
.array-field {
  width: 100%;
}

.array-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.array-item .el-input {
  flex: 1;
}

.remove-btn {
  color: var(--el-color-danger);
  padding: 4px 8px;
  min-width: auto;
}

.remove-btn:hover {
  background-color: var(--el-color-danger-light-9);
}

.add-btn {
  color: var(--el-color-primary);
  padding: 4px 8px;
  margin-top: 4px;
}

.add-btn:hover {
  background-color: var(--el-color-primary-light-9);
}

.field-description {
  font-size: 12px;
  color: var(--el-text-color-regular);
  margin-top: 4px;
  line-height: 1.4;
}
</style> 