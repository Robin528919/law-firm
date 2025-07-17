<template>
  <div class="srogs01-overtime-form">
    <el-form
        ref="formRef"
        :model="formData"
        :rules="validationRules"
        label-width="200px"
        size="default"
    >
      <!-- 基础案件信息 -->
      <FormGroup
          title="Basic Case Information"
          description="Basic case information for SROGS01 overtime documents"
          icon="Document"
          variant="card"
          :columns="1"
      >
        <FormField
            label="Plaintiff Name"
            v-model="formData.PlaintiffName"
            prop="PlaintiffName"
            type="text"
            placeholder="e.g. PERSON 1, NIMIA, ROSARIO"
            required
        />

        <FormField
            label="Defendant Name"
            v-model="formData.DefendantName"
            prop="DefendantName"
            type="text"
            placeholder="e.g. COMPANY. INC"
            required
        />

        <FormField
            label="Case Number"
            v-model="formData.CaseNumber"
            prop="CaseNumber"
            type="text"
            placeholder="e.g. BC647042"
            required
        />

        <FormField
            label="Judge Name"
            v-model="formData.JudgeName"
            prop="JudgeName"
            type="text"
            placeholder="e.g. Hon. Elizabeth Feffer"
            required
        />

        <FormField
            label="Hearing Department"
            v-model="formData.HearingDept"
            prop="HearingDept"
            type="text"
            placeholder="e.g. Dept. '39'"
            required
        />
      </FormGroup>

      <!-- 法院和案件日期信息 -->
      <FormGroup
          title="Court and Date Information"
          description="Court information and important dates"
          icon="Calendar"
          variant="card"
          :columns="1"
      >
        <el-form-item label="Complaint Filing Date" prop="ComplaintFilingDate">
          <el-date-picker
              v-model="formData.ComplaintFilingDate"
              type="date"
              placeholder="Select complaint filing date"
              style="width: 100%"
              value-format="MMMM D, YYYY"
              format="MMMM D, YYYY"
          />
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

        <FormField
            label="Court Name"
            v-model="formData.CourtName"
            prop="CourtName"
            type="text"
            placeholder="e.g. STANLEY MOSK COURTHOUSE"
            required
        />

        <FormField
            label="Court Location (County)"
            v-model="formData.CourtLocation"
            prop="CourtLocation"
            type="text"
            placeholder="e.g. COUNTY OF LOS ANGELES (All Capital)"
            required
            description="Please use all capital letters"
        />
      </FormGroup>

      <!-- 雇佣关系信息 -->
      <FormGroup
          title="Employment Information"
          description="Employment relationship and workplace address information"
          icon="OfficeBuilding"
          variant="card"
          :columns="1"
      >
        <FormField
            label="Defendant's Business Address"
            v-model="formData.DefendantBusinessAddress"
            prop="DefendantBusinessAddress"
            type="textarea"
            placeholder="Detailed business address where plaintiff worked"
            :rows="3"
            required
            description="Where the plaintiff worked"
        />

        <el-form-item label="Employment Start Date" prop="EmploymentStartDate">
          <el-date-picker
              v-model="formData.EmploymentStartDate"
              type="date"
              placeholder="Select employment start date"
              style="width: 100%"
              value-format="MMMM D, YYYY"
              format="MMMM D, YYYY"
          />
        </el-form-item>

        <el-form-item label="Employment End Date" prop="EmploymentEndDate">
          <el-date-picker
              v-model="formData.EmploymentEndDate"
              type="date"
              placeholder="Select employment end date"
              style="width: 100%"
              value-format="MMMM D, YYYY"
              format="MMMM D, YYYY"
          />
        </el-form-item>
      </FormGroup>

      <!-- 复数形式字段 -->
      <FormGroup
          title="Plurality Forms"
          description="Party plurality forms (partially auto-calculated)"
          icon="Users"
          variant="bordered"
          :columns="1"
      >
        <FormField
            label="Plaintiff Plurality"
            v-model="computedPlaintiffPlurality1"
            prop="PlaintiffPlurality1"
            type="text"
            placeholder="Auto-calculated"
            disabled
            description="Auto-calculated based on plaintiff name"
        />

        <FormField
            label="Defendant Plurality 1"
            v-model="computedDefendantPlurality1"
            prop="DefendantPlurality1"
            type="text"
            placeholder="Auto-calculated"
            disabled
            description="Auto-calculated based on defendant name"
        />

        <FormField
            label="Defendant Plurality 2"
            v-model="computedDefendantPlurality2"
            prop="DefendantPlurality2"
            type="text"
            placeholder="Auto-calculated"
            disabled
            description="'Defendant is' or 'Defendants are' auto-determined by singular/plural"
        />
      </FormGroup>

      <!-- 执行和服务信息 -->
      <FormGroup
          title="Execution and Service Information"
          description="Execution date and service information"
          icon="Message"
          variant="card"
          :columns="1"
      >
        <FormField
            label="Executed Date"
            v-model="computedExecutedDate"
            prop="ExecutedDate"
            type="text"
            placeholder="Auto-calculated as current date"
            disabled
            description="Auto-calculated as current date"
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

        <FormField
            label="Service Info"
            v-model="formData.ServiceInfo"
            prop="ServiceInfo"
            type="textarea"
            placeholder="Counsel name, firm name, address, phone, fax, email, etc."
            :rows="4"
            required
            description="Include counsel name, firm name, address, phone, fax, email, etc."
        />
      </FormGroup>

            <!-- 测试数据工具 -->
      <TestDataTool
        :test-data="SROGS01_OVERTIME_TEST_DATA"
        :form-data="formData"
        :update-field="updateField"
        form-name="SROGS01 OVERTIME"
        :exclude-fields="['ExecutedDate', 'PlaintiffPlurality1', 'DefendantPlurality1', 'DefendantPlurality2']"
      />
    </el-form>
  </div>
</template>

<script setup>
import {ref, computed, watch} from 'vue'
import FormGroup from '@/components/common/FormGroup.vue'
import FormField from '@/components/common/FormField.vue'
import TestDataTool from '@/components/common/TestDataTool.vue'
import {useFormStore} from '@/stores/formStore'
import {VALIDATION_RULES, SROGS01_OVERTIME_TEST_DATA} from '@/utils/constants'
import {formatLegalDate} from '@/utils/calculations'

// 使用表单状态管理
const formStore = useFormStore()
const formRef = ref()

// 表单数据 - 直接使用 ref，支持双向绑定
const formData = computed(() => formStore.srogs01OvertimeForm)

// 表单字段更新方法
const updateField = (field, value) => {
  formStore.updateSrogs01OvertimeForm(field, value)
}

// Trial Date 相关状态
const trialDateMode = ref('notSet')
const trialDateValue = ref(null)

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
    formStore.updateSrogs01OvertimeForm('TrialDate', 'Not Set')
    trialDateValue.value = null
  } else {
    formStore.updateSrogs01OvertimeForm('TrialDate', trialDateValue.value)
  }
}

// Trial Date 值变更处理
const handleTrialDateChange = (value) => {
  formStore.updateSrogs01OvertimeForm('TrialDate', value)
}

// 验证规则
const validationRules = {
  PlaintiffName: [VALIDATION_RULES.required],
  DefendantName: [VALIDATION_RULES.required],
  CaseNumber: [VALIDATION_RULES.required],
  JudgeName: [VALIDATION_RULES.required],
  HearingDept: [VALIDATION_RULES.required],
  ComplaintFilingDate: [VALIDATION_RULES.required, VALIDATION_RULES.date],
  TrialDate: [VALIDATION_RULES.required],
  DefendantBusinessAddress: [VALIDATION_RULES.required],
  CourtName: [VALIDATION_RULES.required],
  CourtLocation: [VALIDATION_RULES.required],
  EmploymentStartDate: [VALIDATION_RULES.required, VALIDATION_RULES.date],
  EmploymentEndDate: [VALIDATION_RULES.required, VALIDATION_RULES.date],
  ServerName: [VALIDATION_RULES.required],
  ServiceInfo: [VALIDATION_RULES.required]
}

// 计算属性 - 从store获取计算字段
const computedPlaintiffPlurality1 = computed(() => {
  return formStore.srogs01OvertimeCalculations.plaintiffPlurality1
})

const computedDefendantPlurality1 = computed(() => {
  return formStore.srogs01OvertimeCalculations.defendantPlurality1
})

const computedDefendantPlurality2 = computed(() => {
  return formStore.srogs01OvertimeCalculations.defendantPlurality2
})

const computedExecutedDate = computed(() => {
  return formStore.srogs01OvertimeCalculations.executedDate
})



// 字段变更处理
const handleFieldChange = (value, field) => {
  if (field) {
    formStore.updateSrogs01OvertimeForm(field, value)
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
.srogs01-overtime-form {
  width: 100%;
}

.test-tools {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}

.test-info {
  opacity: 0.7;
  font-size: 12px;
}

.trial-date-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.not-set-display {
  color: #888;
  margin-top: 8px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .srogs01-overtime-form :deep(.el-form-item__label) {
    font-size: 14px;
  }
}
</style>
