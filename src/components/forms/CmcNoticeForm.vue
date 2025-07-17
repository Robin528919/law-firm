<template>
  <div class="cmc-notice-form">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="validationRules"
      label-position="top"
      label-width="120px"
      size="default"
      status-icon
      scroll-to-error
    >
      <!-- 基础信息 -->
      <FormGroup
        title="Basic Information"
        description="Case and party information for CMC notice"
        icon="Document"
        variant="card"
        :columns="2"
      >
        <FormField
          label="Plaintiff Name"
          v-model="formData.PlaintiffName"
          prop="PlaintiffName"
          type="text"
          placeholder="e.g. LEOBARDO SALAZAR"
          required
          description="Full name of the plaintiff"
        />

        <FormField
          label="Defendant Name"
          v-model="formData.DefendantName"
          prop="DefendantName"
          type="text"
          placeholder="e.g. SAND BUILDING MATERIALS, INC."
          required
          description="Full name of the defendant"
        />

        <FormField
          label="Case Number"
          v-model="formData.CaseNumber"
          prop="CaseNumber"
          type="text"
          placeholder="e.g. BC595011"
          required
          description="Court case number"
        />

        <FormField
          label="Judge Name"
          v-model="formData.JudgeName"
          prop="JudgeName"
          type="text"
          placeholder="e.g. Hon. Gregory Keosian"
          required
          description="Presiding judge name"
        />
      </FormGroup>

      <!-- 听证会信息 -->
      <FormGroup
        title="Hearing Information"
        description="Date, time and department details for the hearing"
        icon="Calendar"
        variant="bordered"
        :columns="2"
      >
        <FormField
          label="Hearing Department"
          v-model="formData.HearingDept"
          prop="HearingDept"
          type="text"
          placeholder="e.g. Dept. 61"
          required
          description="Court department for hearing"
        />

        <el-form-item label="Hearing Date" prop="HearingDate">
          <el-date-picker
              v-model="formData.HearingDate"
              type="date"
              placeholder="Select hearing date"
              style="width: 100%;"
              value-format="YYYY-MM-DD"
              format="MMMM D, YYYY"
          />
          <div class="field-description">Date of the CMC hearing</div>
        </el-form-item>

        <el-form-item label="Hearing Time" prop="HearingTime">
          <el-time-select
              v-model="formData.HearingTime"
              start="08:00"
              step="00:30"
              end="17:00"
              placeholder="Select hearing time"
              style="width: 100%;"
              format="h:mm A"
          />
          <div class="field-description">Time of the CMC hearing</div>
        </el-form-item>

        <el-form-item label="Complaint Filing Date" prop="ComplaintFilingDate">
          <el-date-picker
              v-model="formData.ComplaintFilingDate"
              type="date"
              placeholder="Select complaint filing date"
              style="width: 100%;"
              value-format="YYYY-MM-DD"
              format="MMMM D, YYYY"
          />
          <div class="field-description">Date when complaint was filed or expected to be filed</div>
        </el-form-item>
      </FormGroup>

      <!-- 法院信息 -->
      <FormGroup
        title="Court Information"
        description="Court location and jurisdiction details"
        icon="Building"
        variant="bordered"
        :columns="1"
      >
        <FormField
          label="Court Location"
          v-model="formData.CourtLocation"
          prop="CourtLocation"
          type="text"
          placeholder="e.g. COUNTY OF LOS ANGELES"
          required
          description="Court county or jurisdiction (all capital letters)"
        />

        <FormField
          label="Court Name"
          v-model="formData.CourtName"
          prop="CourtName"
          type="text"
          placeholder="e.g. STANLEY MOSK COURTHOUSE"
          required
          description="Name of the courthouse"
        />

        <FormField
          label="Court Address"
          v-model="formData.CourtAddress"
          prop="CourtAddress"
          type="textarea"
          placeholder="e.g. 111 North Hill Street, Room 307 Los Angeles, CA 90012"
          required
          description="Full address of the courthouse"
          :rows="2"
        />
      </FormGroup>

      <!-- 日期信息 -->
      <FormGroup
        title="Date Information"
        description="Trial date and letter date information"
        icon="Calendar"
        variant="card"
        :columns="2"
      >
        <!-- Trial Date 特殊处理：切换按钮 -->
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

        <el-form-item label="Letter Date" prop="LetterDate">
          <el-date-picker
              v-model="formData.LetterDate"
              type="date"
              placeholder="Select letter date (optional)"
              style="width: 100%;"
              value-format="YYYY-MM-DD"
              format="MMMM D, YYYY"
          />
          <div class="field-description">Date of the letter (optional)</div>
        </el-form-item>

        <el-form-item label="Executed Date" prop="ExecutedDate">
          <el-date-picker
              v-model="formData.ExecutedDate"
              type="date"
              placeholder="Select execution date"
              style="width: 100%;"
              value-format="YYYY-MM-DD"
              format="MMMM D, YYYY"
          />
          <div class="field-description">Date when document was executed</div>
        </el-form-item>
      </FormGroup>

      <!-- 服务信息 -->
      <FormGroup
        title="Service Information"
        description="Service and counsel information"
        icon="User"
        variant="bordered"
        :columns="1"
      >
        <FormField
          label="Service Info"
          v-model="formData.ServiceInfo"
          prop="ServiceInfo"
          type="textarea"
          placeholder="e.g. LAW OFFICES OF ROGER C. HSU&#10;175. S. Lake Ave., Ste. 210&#10;Pasadena, CA 91101"
          required
          description="Counsel name, firm name, address, phone, fax, email etc."
          :rows="4"
        />

        <FormField
          label="Server Name"
          v-model="formData.ServerName"
          prop="ServerName"
          type="text"
          placeholder="e.g. Jennifer Ontiveros"
          required
          description="Name of the person who will serve the document"
        />
      </FormGroup>

      <!-- 自动计算字段 -->
      <FormGroup
        title="Auto-Generated Fields"
        description="Automatically generated fields based on input data"
        icon="Calculator"
        variant="card"
        :columns="1"
      >
        <FormField
          label="Plaintiff Plurality"
          :model-value="calculations.plaintiffPlurality1"
          type="text"
          :is-calculated="true"
          :display-value="calculations.plaintiffPlurality1"
          description="Plaintiff or Plaintiffs - automatically determined based on number of plaintiffs"
        />

        <FormField
          label="Executed Date (Auto)"
          :model-value="calculations.executedDate"
          type="text"
          :is-calculated="true"
          :display-value="calculations.executedDate"
          description="Current date in legal format"
        />
      </FormGroup>

      <!-- 测试数据工具 -->
      <TestDataTool
        :test-data="CMC_NOTICE_TEST_DATA"
        :form-data="formData"
        :update-field="updateField"
        form-name="CMC NOTICE"
        :exclude-fields="['ExecutedDate']"
      />
    </el-form>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import FormGroup from '@/components/common/FormGroup.vue'
import FormField from '@/components/common/FormField.vue'
import { useFormStore } from '@/stores/formStore'
import {
  VALIDATION_RULES,
  API_CONFIG,
  CMC_NOTICE_TEST_DATA
} from '@/utils/constants'

// 使用表单状态管理
const formStore = useFormStore()
const formRef = ref()

// 表单数据 - 直接使用 ref，支持双向绑定
const formData = formStore.cmcNoticeForm

// 计算字段
const calculations = computed(() => formStore.cmcNoticeCalculations)

// 开发测试相关状态
const isDevelopmentMode = computed(() => {
  return API_CONFIG.ENVIRONMENT === 'development' || API_CONFIG.APP_ENV === 'development' || API_CONFIG.DEBUG
})
const fillingTestData = ref(false)

// Trial Date 相关状态
const trialDateMode = ref('notSet')
const trialDateValue = ref(null)

// 验证规则
const validationRules = {
  PlaintiffName: [VALIDATION_RULES.required],
  DefendantName: [VALIDATION_RULES.required],
  CourtLocation: [VALIDATION_RULES.required],
  CourtName: [VALIDATION_RULES.required],
  CaseNumber: [VALIDATION_RULES.required],
  JudgeName: [VALIDATION_RULES.required],
  HearingDept: [VALIDATION_RULES.required],
  HearingDate: [VALIDATION_RULES.required, VALIDATION_RULES.date],
  HearingTime: [VALIDATION_RULES.required],
  ComplaintFilingDate: [VALIDATION_RULES.required, VALIDATION_RULES.date],
  TrialDate: [VALIDATION_RULES.required],
  CourtAddress: [VALIDATION_RULES.required],
  ServiceInfo: [VALIDATION_RULES.required],
  ExecutedDate: [VALIDATION_RULES.required, VALIDATION_RULES.date],
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
    formStore.updateCmcNoticeForm('TrialDate', 'Not Set')
    trialDateValue.value = null
  } else {
    formStore.updateCmcNoticeForm('TrialDate', trialDateValue.value)
  }
}

// Trial Date 值变更处理
const handleTrialDateChange = (value) => {
  formStore.updateCmcNoticeForm('TrialDate', value)
}

// 监听表单数据变化，自动保存
watch(
  () => formStore.cmcNoticeForm,
  () => {
    // 这里可以实现自动保存逻辑
  },
  { deep: true }
)

// 表单提交
const handleSubmit = async () => {
  try {
    const valid = await formRef.value.validate()
    if (valid) {
      // 处理表单提交逻辑
      console.log('表单验证通过，可以提交')
    }
  } catch (error) {
    console.log('表单验证失败:', error)
  }
}

// 填充测试数据方法
const fillTestData = async () => {
  fillingTestData.value = true

  try {
    // 填充所有测试数据
    Object.keys(CMC_NOTICE_TEST_DATA).forEach(key => {
      formStore.updateCmcNoticeForm(key, CMC_NOTICE_TEST_DATA[key])
    })

    // 处理 Trial Date 特殊逻辑
    const testTrialDate = CMC_NOTICE_TEST_DATA.TrialDate
    if (testTrialDate === 'Not Set' || !testTrialDate) {
      trialDateMode.value = 'notSet'
      trialDateValue.value = null
    } else {
      trialDateMode.value = 'date'
      trialDateValue.value = testTrialDate
    }

    // 短暂延迟模拟加载过程
    await new Promise(resolve => setTimeout(resolve, 300))

    console.log('CMC Notice 测试数据已填充:', formStore.cmcNoticeForm)

  } catch (error) {
    console.error('填充测试数据时出错:', error)
  } finally {
    fillingTestData.value = false
  }
}

// 暴露方法给父组件
defineExpose({
  validate: () => formRef.value?.validate(),
  resetForm: () => formRef.value?.resetFields(),
  fillTestData,
  formRef
})
</script>

<style scoped>
.cmc-notice-form {
  width: 100%;
}

.trial-date-field {
  width: 100%;
}

.trial-date-field .el-radio-group {
  margin-bottom: 8px;
}

.not-set-display {
  padding: 8px 0;
  color: var(--el-text-color-regular);
  font-style: italic;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .cmc-notice-form :deep(.el-form-item__label) {
    font-size: 14px;
  }
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