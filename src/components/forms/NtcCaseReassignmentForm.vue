<template>
  <div class="ntc-case-reassignment-form">
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
        description="Case and party information for case reassignment notice"
        icon="Document"
        variant="card"
        :columns="1"
      >
        <FormField
          label="Plaintiff Name"
          v-model="formData.PlaintiffName"
          prop="PlaintiffName"
          type="text"
          placeholder="e.g. ANA BERTHA CAMPOS"
          required
          description="Full name of the plaintiff"
        />

        <FormField
          label="Defendant Name"
          v-model="formData.DefendantName"
          prop="DefendantName"
          type="text"
          placeholder="e.g. NATALIA GRANADOS, SUPER ANTOJITOS MEXICANOS"
          required
          description="Full name of the defendant"
        />

        <FormField
          label="Plaintiff Plurality"
          v-model="formData.PlaintiffPlurality1"
          prop="PlaintiffPlurality1"
          type="text"
          placeholder="e.g. Plaintiffs, Maria Cardenas"
          description="Plaintiff plurality form (can be manually overridden)"
        />

        <FormField
          label="Case Number"
          v-model="formData.CaseNumber"
          prop="CaseNumber"
          type="text"
          placeholder="e.g. 21STCV19888"
          required
          description="Court case number"
        />
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
          label="Judge Name"
          v-model="formData.JudgeName"
          prop="JudgeName"
          type="text"
          placeholder="e.g. Hon. Joseph Lipner"
          required
          description="Current presiding judge name"
        />

        <FormField
          label="Hearing Department"
          v-model="formData.HearingDept"
          prop="HearingDept"
          type="text"
          placeholder="e.g. Dept. 72"
          required
          description="Court department for hearing"
        />
      </FormGroup>

      <!-- 日期信息 -->
      <FormGroup
        title="Date Information"
        description="Important dates related to case and reassignment"
        icon="Calendar"
        variant="card"
        :columns="1"
      >
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

        <el-form-item label="Reassign Date" prop="ReassignDate">
          <el-date-picker
              v-model="formData.ReassignDate"
              type="date"
              placeholder="Select letter date"
              style="width: 100%;"
              value-format="YYYY-MM-DD"
              format="MMMM D, YYYY"
          />
          <div class="field-description">Date of the letter</div>
        </el-form-item>
        <el-form-item label="Letter Date" prop="LetterDate">
          <el-date-picker
              v-model="formData.LetterDate"
              type="date"
              placeholder="Select letter date"
              style="width: 100%;"
              value-format="YYYY-MM-DD"
              format="MMMM D, YYYY"
          />
          <div class="field-description">Date of the letter</div>
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

      <!-- 法官信息 -->
      <FormGroup
        title="Judge Information"
        description="Previous and current judge details"
        icon="User"
        variant="bordered"
        :columns="1"
      >
        <FormField
          label="Previous Judge Name"
          v-model="formData.PreviousJudgeName"
          prop="PreviousJudgeName"
          type="text"
          placeholder="e.g. Curtis Kin"
          required
          description="Name of the previous judge before reassignment"
        />
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
          label="Defendant Plurality"
          :model-value="calculations.defendantPlurality1"
          type="text"
          :is-calculated="true"
          :display-value="calculations.defendantPlurality1"
          description="Defendant or Defendants - automatically determined based on number of defendants"
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
        :test-data="NTC_CASE_REASSIGNMENT_TEST_DATA"
        :form-data="formData"
        :update-field="updateField"
        form-name="NTC CASE REASSIGNMENT"
        :exclude-fields="['ExecutedDate']"
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
import {
  VALIDATION_RULES,
  NTC_CASE_REASSIGNMENT_TEST_DATA
} from '@/utils/constants'

// 使用表单状态管理
const formStore = useFormStore()
const formRef = ref()

// 表单数据 - 直接使用 ref，支持双向绑定
const formData = formStore.ntcCaseReassignmentForm

// 计算字段
const calculations = computed(() => formStore.ntcCaseReassignmentCalculations)

// Trial Date 相关状态
const trialDateMode = ref('notSet')
const trialDateValue = ref(null)

// 验证规则
const validationRules = {
  PlaintiffName: [VALIDATION_RULES.required],
  DefendantName: [VALIDATION_RULES.required],
  CaseNumber: [VALIDATION_RULES.required],
  CourtLocation: [VALIDATION_RULES.required],
  CourtName: [VALIDATION_RULES.required],
  JudgeName: [VALIDATION_RULES.required],
  HearingDept: [VALIDATION_RULES.required],
  ComplaintFilingDate: [VALIDATION_RULES.required, VALIDATION_RULES.date],
  TrialDate: [VALIDATION_RULES.required],
  PreviousJudgeName: [VALIDATION_RULES.required],
  ReassignDate: [VALIDATION_RULES.required],
  LetterDate: [VALIDATION_RULES.required, VALIDATION_RULES.date],
  ServiceInfo: [VALIDATION_RULES.required],
  ServerName: [VALIDATION_RULES.required],
  ExecutedDate: [VALIDATION_RULES.required, VALIDATION_RULES.date]
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
    formStore.updateNtcCaseReassignmentForm('TrialDate', 'Not Set')
    trialDateValue.value = null
  } else {
    formStore.updateNtcCaseReassignmentForm('TrialDate', trialDateValue.value)
  }
}

// Trial Date 值变更处理
const handleTrialDateChange = (value) => {
  formStore.updateNtcCaseReassignmentForm('TrialDate', value)
}

// 监听表单数据变化，自动保存
watch(
  () => formStore.ntcCaseReassignmentForm,
  () => {
    // 这里可以实现自动保存逻辑
  },
  { deep: true }
)
// TestDataTool 相关方法
const updateField = (field, value) => {
  formStore.updateNtcCaseReassignmentForm(field, value)
}

defineExpose({
  validate: () => formRef.value?.validate(),
  resetForm: () => formRef.value?.resetFields(),
  formRef
})
</script>

<style scoped>
.ntc-case-reassignment-form {
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
  .ntc-case-reassignment-form :deep(.el-form-item__label) {
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
