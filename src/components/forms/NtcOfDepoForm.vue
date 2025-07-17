<template>
  <div class="ntc-of-depo-form">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="validationRules"
      label-width="160px"
      label-position="top"
      size="default"
      @submit.prevent="handleSubmit"
    >
      <!-- 基本案件信息组 -->
      <FormGroup
        title="Basic Case Information"
        description="Basic case and party information"
        icon="Document"
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
          label="Court Name"
          v-model="formData.CourtName"
          prop="CourtName"
          type="text"
          placeholder="e.g. STANLEY MOSK COURTHOUSE"
          required
          description="Name of the court"
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
          label="Judge Name"
          v-model="formData.JudgeName"
          prop="JudgeName"
          type="text"
          placeholder="e.g. Hon. Rafael A. Ongkeko, Dept. '73'"
          required
          description="Name of the assigned judge"
        />
      </FormGroup>

      <!-- 听证信息组 -->
      <FormGroup
        title="Hearing Information"
        description="Hearing schedule details"
        icon="Calendar"
        variant="bordered"
        :columns="1"
      >
        <el-form-item label="Hearing Date" prop="HearingDate">
          <el-date-picker
            v-model="formData.HearingDate"
            type="date"
            placeholder="Select hearing date"
            style="width: 100%"
            value-format="YYYY-MM-DD"
            format="MMMM D, YYYY"
          />
        </el-form-item>

        <el-form-item label="Hearing Time" prop="HearingTime">
          <el-time-select
            v-model="formData.HearingTime"
            start="08:00"
            step="00:30"
            end="17:00"
            placeholder="Select hearing time"
            format="h:mm A"
            value-format="h:mm A"
            style="width: 100%"
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
      </FormGroup>

      <!-- 日期信息组 -->
      <FormGroup
        title="Date Information"
        description="Important dates related to the case"
        icon="Clock"
        variant="card"
        :columns="1"
      >
        <el-form-item label="Complaint Filing Date" prop="ComplaintFilingDate">
          <el-date-picker
            v-model="formData.ComplaintFilingDate"
            type="date"
            placeholder="Select complaint filing date or expected filing date"
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

      <!-- 其他信息组 -->
      <FormGroup
        title="Additional Information"
        description="Additional details and server information"
        icon="Setting"
        variant="bordered"
        :columns="1"
      >
        <FormField
          label="Request Number"
          v-model="formData.RequestNumber"
          prop="RequestNumber"
          type="number"
          placeholder="e.g. 1"
          :min="1"
          :precision="0"
          required
          description="Request number (based on total request count for ordering)"
        />

        <FormField
          label="Server Name"
          v-model="formData.ServerName"
          prop="ServerName"
          type="text"
          placeholder="e.g. John Doe"
          required
          description="Name of the person who will serve the document"
        />
      </FormGroup>

      <!-- 自动生成字段组 -->
      <FormGroup
        title="Auto-Generated Fields"
        description="Automatically generated fields based on input data"
        icon="Calculator"
        variant="card"
        :columns="1"
      >
        <FormField
          label="Plaintiff Plurality 1"
          :model-value="calculations.plaintiffPlurality1"
          type="text"
          :is-calculated="true"
          :display-value="calculations.plaintiffPlurality1"
          description="Plaintiff or Plaintiffs - automatically determined based on number of plaintiffs"
        />

        <FormField
          label="Defendant Plurality 1"
          :model-value="calculations.defendantPlurality1"
          type="text"
          :is-calculated="true"
          :display-value="calculations.defendantPlurality1"
          description="Defendant or Defendants - automatically determined based on number of defendants"
        />
      </FormGroup>

      <!-- 测试数据工具 -->
      <TestDataTool
        :test-data="NTC_OF_DEPO_TEST_DATA"
        :form-data="formData"
        :update-field="updateField"
        form-name="NTC OF DEPO"
        :special-handlers="specialHandlers"
      />
    </el-form>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import FormGroup from '@/components/common/FormGroup.vue'
import FormField from '@/components/common/FormField.vue'
import TestDataTool from '@/components/common/TestDataTool.vue'
import { useFormStore } from '@/stores/formStore'
import { VALIDATION_RULES, NTC_OF_DEPO_TEST_DATA, API_CONFIG } from '@/utils/constants'

// 使用表单状态管理
const formStore = useFormStore()
const formRef = ref()

// 表单数据 - 直接使用 ref，支持双向绑定
const formData = formStore.ntcOfDepoForm

// 计算字段
const calculations = computed(() => formStore.ntcOfDepoCalculations)

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
  CourtName: [VALIDATION_RULES.required],
  CaseNumber: [VALIDATION_RULES.required],
  JudgeName: [VALIDATION_RULES.required],
  HearingDate: [VALIDATION_RULES.required, VALIDATION_RULES.date],
  HearingTime: [VALIDATION_RULES.required],
  ComplaintFilingDate: [VALIDATION_RULES.required, VALIDATION_RULES.date],
  LetterDate: [VALIDATION_RULES.required, VALIDATION_RULES.date],
  ExecutedDate: [VALIDATION_RULES.required, VALIDATION_RULES.date],
  RequestNumber: [VALIDATION_RULES.required, VALIDATION_RULES.number],
  ServerName: [VALIDATION_RULES.required]
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
    formStore.updateNtcOfDepoForm('TrialDate', 'Not Set')
    trialDateValue.value = null
  } else {
    formStore.updateNtcOfDepoForm('TrialDate', trialDateValue.value)
  }
}

// Trial Date 值变更处理
const handleTrialDateChange = (value) => {
  formStore.updateNtcOfDepoForm('TrialDate', value)
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
  formStore.updateNtcOfDepoForm('PlaintiffPlurality1', calculations.value.plaintiffPlurality1)
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
  formStore.updateNtcOfDepoForm('DefendantPlurality1', calculations.value.defendantPlurality1)
}

// 监听名称数组变化，自动更新复数字段
watch(() => formData.PlaintiffNames, () => {
  formStore.updateNtcOfDepoForm('PlaintiffPlurality1', calculations.value.plaintiffPlurality1)
}, { deep: true, immediate: true })

watch(() => formData.DefendantNames, () => {
  formStore.updateNtcOfDepoForm('DefendantPlurality1', calculations.value.defendantPlurality1)
}, { deep: true, immediate: true })

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
    console.log('NTC of Depo 表单验证失败:', error)
    return false
  }
}

// TestDataTool 相关方法
const updateField = (field, value) => {
  formStore.updateNtcOfDepoForm(field, value)
}

// 特殊字段处理器
const specialHandlers = {
  PlaintiffNames: (value) => {
    // 处理数组字段
    formData.PlaintiffNames = [...value]
    formStore.updateNtcOfDepoForm('PlaintiffPlurality1', calculations.value.plaintiffPlurality1)
  },
  DefendantNames: (value) => {
    // 处理数组字段
    formData.DefendantNames = [...value]
    formStore.updateNtcOfDepoForm('DefendantPlurality1', calculations.value.defendantPlurality1)
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
  formStore.resetForm('ntcOfDepo')
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
.ntc-of-depo-form {
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
</style> 