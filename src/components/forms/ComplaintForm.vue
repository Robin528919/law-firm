<template>
  <div class="complaint-form">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="validationRules"
      label-width="auto"
      label-position="top"
      size="default"
      @submit.prevent="handleSubmit"
    >
      <!-- Basic Information -->
      <FormGroup
        title="Basic Information"
        description="Basic party and court information for the complaint case"
        icon="User"
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
          description="Multiple plaintiffs separated by commas. Each name should be followed by an individual designation"
          @change="(value) => handleFieldChange(value, 'PlaintiffName')"
          @blur="handlePlaintiffNameBlur"
        />

        <FormField
          label="Plaintiff's Job"
          v-model="formData.PlaintiffJob"
          prop="PlaintiffJob"
          type="text"
          placeholder="e.g. Chef"
          required
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

        <FormField
          label="Court Location (County)"
          v-model="formData.CourtLocation"
          prop="CourtLocation"
          type="text"
          placeholder="e.g. LOS ANGELES (All Capital)"
          required
          description="Enter county name in all capital letters"
        />

        <FormField
          label="Court Name"
          v-model="formData.CourtName"
          prop="CourtName"
          type="text"
          placeholder="e.g. STANLEY MOSK COURTHOUSE"
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

        <FormField
          label="Judge Name"
          v-model="formData.JudgeName"
          prop="JudgeName"
          type="text"
          placeholder="e.g. Michael Doe"
        />

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
      </FormGroup>

      <!-- Choose Causes of Action -->
      <FormGroup
        title="Choose Causes of Action"
        description="Select applicable causes of action, multiple selections allowed"
        icon="DocumentChecked"
        variant="bordered"
        :columns="1"
      >
        <el-form-item label="Causes of Action" prop="SelectedCauses" required>
          <div class="causes-checkbox-group">
            <el-checkbox
              v-for="cause in CAUSES_OF_ACTION"
              :key="cause.value"
              v-model="formData.SelectedCauses[cause.value].selected"
              :label="cause.value"
              class="cause-checkbox"
              @change="handleCauseChange"
            >
              <span class="cause-label">
                {{ cause.label }}
                <span v-if="formData.SelectedCauses[cause.value].order" class="cause-order">
                  ({{ formData.SelectedCauses[cause.value].order }})
                </span>
              </span>
            </el-checkbox>
          </div>
        </el-form-item>
      </FormGroup>

      <!-- Address Information -->
      <FormGroup
        title="Address Information"
        description="Residence and workplace address information of the parties"
        icon="LocationFilled"
        variant="default"
        :columns="1"
      >
        <FormField
          label="Plaintiff Residence (County, State)"
          v-model="formData.PlaintiffResidence"
          prop="PlaintiffResidence"
          type="text"
          placeholder="e.g. Los Angeles, California"
          required
        />

        <FormField
          label="Defendant Business Type"
          v-model="formData.DefendantBusinessType"
          prop="DefendantBusinessType"
          type="text"
          placeholder="e.g. restaurant"
          required
        />

        <FormField
          label="Defendant's Detailed Business Address"
          v-model="formData.DefendantBusinessAddress"
          prop="DefendantBusinessAddress"
          type="textarea"
          placeholder="e.g. 123 Broadway, Los Angeles, CA 90016 (Where the plaintiff worked)"
          :rows="3"
          required
          description="Enter the detailed business address where the plaintiff worked"
        />
      </FormGroup>

      <!-- Employment Information -->
      <FormGroup
        title="Employment Information"
        description="Plaintiff's employment period and working conditions information"
        icon="Briefcase"
        variant="card"
        :columns="1"
      >
        <el-form-item label="Start Date of the Employment" prop="EmploymentStartDate">
          <el-date-picker
            v-model="formData.EmploymentStartDate"
            type="date"
            placeholder="e.g. May 1, 2022"
            style="width: 100%"
            value-format="YYYY-MM-DD"
            format="MMMM D, YYYY"
          />
        </el-form-item>

        <el-form-item label="End Date of the Employment" prop="EmploymentEndDate">
          <el-date-picker
            v-model="formData.EmploymentEndDate"
            type="date"
            placeholder="e.g. June 23, 2024"
            style="width: 100%"
            value-format="YYYY-MM-DD"
            format="MMMM D, YYYY"
          />
        </el-form-item>

        <FormField
          label="Plaintiff's Hourly Rate"
          v-model="formData.HourlyRate"
          prop="HourlyRate"
          type="number"
          placeholder="25"
          :min="0"
          :precision="2"
          required
          description="Need to be used to calculate unpaid wages, overtime, etc"
          @change="(value) => handleFieldChange(value, 'HourlyRate')"
        />

        <FormField
          label="Unpaid Hours"
          v-model="formData.UnpaidHours"
          prop="UnpaidHours"
          type="number"
          placeholder="300"
          :min="0"
          :precision="1"
          required
          @change="(value) => handleFieldChange(value, 'UnpaidHours')"
        />

        <FormField
          label="How Many Actual Hours Did the Plaintiff Work Per Week"
          v-model="formData.WeeklyHours"
          prop="WeeklyHours"
          type="number"
          placeholder="80"
          :min="0"
          :precision="1"
          required
          @change="(value) => handleFieldChange(value, 'WeeklyHours')"
        />

        <FormField
          label="How Many 2 * Overtime Hours Did the Plaintiff Work Per Week"
          v-model="formData.DoubleOvertimeHours"
          prop="DoubleOvertimeHours"
          type="number"
          placeholder="5"
          :min="0"
          :precision="1"
          @change="(value) => handleFieldChange(value, 'DoubleOvertimeHours')"
        />
      </FormGroup>

      <!-- Other Information -->
      <FormGroup
        title="Other Information"
        description="Pay period, IWC order and other related information"
        icon="Setting"
        variant="bordered"
        :columns="1"
      >
        <FormField
          label="Pay Period Interval"
          v-model="formData.PayPeriodInterval"
          prop="PayPeriodInterval"
          type="select"
          placeholder="Select pay period interval"
          :options="PAY_PERIOD_OPTIONS"
          required
          description="Options: Daily, Weekly, Bi-Weekly, Monthly, Bi-Monthly, Quarterly"
        />

        <FormField
          label="What is the Applicable IWC Order (Number)"
          v-model="formData.IwcOrder"
          prop="IwcOrder"
          type="number"
          placeholder="5"
          :min="1"
          :precision="0"
          required
        />

        <FormField
          label="Payperiods"
          v-model="formData.PayPeriods"
          prop="PayPeriods"
          type="number"
          placeholder="20"
          :min="1"
          :precision="0"
          required
          @change="(value) => handleFieldChange(value, 'PayPeriods')"
        />

        <FormField
          label="How Many Missed Meal Breaks Per Week"
          v-model="formData.MissedMealBreaks"
          prop="MissedMealBreaks"
          type="number"
          placeholder="5"
          :min="0"
          :precision="0"
          @change="(value) => handleFieldChange(value, 'MissedMealBreaks')"
        />

        <FormField
          label="How Many Missed Rest Breaks Per Week"
          v-model="formData.MissedRestBreaks"
          prop="MissedRestBreaks"
          type="number"
          placeholder="5"
          :min="0"
          :precision="0"
          @change="(value) => handleFieldChange(value, 'MissedRestBreaks')"
        />

        <FormField
          label="What is the Type of Unpaid Expense"
          v-model="formData.BusinessExpenseType"
          prop="BusinessExpenseType"
          type="text"
          placeholder="e.g. Gas"
        />

        <FormField
          label="What is the Amount of Unreimbursed Business Expense"
          v-model="formData.BusinessExpenseAmount"
          prop="BusinessExpenseAmount"
          type="number"
          placeholder="1,000"
          :min="0"
          :precision="2"
          @change="(value) => handleFieldChange(value, 'BusinessExpenseAmount')"
        />
      </FormGroup>

      <!-- Automatic Calculations -->
      <FormGroup
        title="Automatic Calculation Results"
        description="Legal-related data automatically calculated based on the above information"
        icon="Calculator"
        variant="card"
        :columns="1"
      >
        <FormField
          label="Number of Weeks Employed (DOE)"
          :model-value="calculations.doe"
          type="number"
          :is-calculated="true"
          :display-value="`${calculations.doe} weeks`"
          description="Automatically calculated based on employment dates and filing date"
        />

        <FormField
          label="1.5x Overtime Hours"
          :model-value="calculations.oneAndHalfOvertimeHours"
          type="number"
          :is-calculated="true"
          :display-value="`${calculations.oneAndHalfOvertimeHours} hours/week`"
        />

        <FormField
          label="Total Overtime Hours"
          :model-value="calculations.overtimeHoursTotal"
          type="number"
          :is-calculated="true"
          :display-value="`${calculations.overtimeHoursTotal} hours/week`"
        />

        <FormField
          label="Overtime Status"
          :model-value="calculations.overtimeStatus"
          type="text"
          :is-calculated="true"
          :display-value="calculations.overtimeStatus"
        />

        <FormField
          label="Damage Unpaid Wages"
          :model-value="calculations.damageUnpaidWages"
          type="number"
          :is-calculated="true"
          :display-value="`$${calculations.damageUnpaidWages.toLocaleString()}`"
          description="Automatically calculated by Unpaid Hours * Hourly Rate"
        />

        <FormField
          label="Damage Meal Breaks"
          :model-value="calculations.damageMealBreaks"
          type="number"
          :is-calculated="true"
          :display-value="`$${calculations.damageMealBreaks.toLocaleString()}`"
          description="Automatically calculated by Missed Meal Breaks * DOE * Hourly Rate"
        />

        <FormField
          label="Damage Rest Breaks"
          :model-value="calculations.damageRestBreaks"
          type="number"
          :is-calculated="true"
          :display-value="`$${calculations.damageRestBreaks.toLocaleString()}`"
          description="Automatically calculated by Missed Rest Breaks * DOE * Hourly Rate"
        />

        <FormField
          label="Damage Overtime"
          :model-value="calculations.damageOvertime"
          type="number"
          :is-calculated="true"
          :display-value="`$${calculations.damageOvertime.toLocaleString()}`"
          description="Automatically calculated by 1.5x Hours * Rate * DOE * 1.5 + 2x Hours * Rate * DOE * 2"
        />

        <FormField
          label="Damage Waiting Time"
          :model-value="calculations.damageWaitingTime"
          type="number"
          :is-calculated="true"
          :display-value="`$${calculations.damageWaitingTime.toLocaleString()}`"
          description="Automatically calculated by Hourly Rate * 8 * 30"
        />

        <FormField
          label="Wage Statement Penalty"
          :model-value="calculations.wageStatementPenalty"
          type="number"
          :is-calculated="true"
          :display-value="`$${calculations.wageStatementPenalty.toLocaleString()}`"
          description="If < 4000, 50 + Pay Periods * 100, otherwise 4000"
        />

        <FormField
          label="Damage Total"
          :model-value="calculations.damageTotal"
          type="number"
          :is-calculated="true"
          :display-value="`$${calculations.damageTotal.toLocaleString()}`"
          class="total-damage-field"
          description="Sum of all damage amounts"
        />

        <FormField
          label="Pre-Judgment Interest"
          :model-value="calculations.preJudgmentInterest"
          type="number"
          :is-calculated="true"
          :display-value="`$${calculations.preJudgmentInterest.toFixed(2)}`"
          description="Damage Total * Interest Period * 10% / 12"
        />
      </FormGroup>

      <!-- Grammar Helper -->
      <FormGroup
        title="Grammar Helper"
        description="Automatically generated grammar forms based on number of parties"
        icon="ChatDotRound"
        variant="default"
        :columns="1"
      >
        <FormField
          label="Plaintiff Plurality 1"
          :model-value="calculations.plaintiffPlurality1"
          type="text"
          :is-calculated="true"
          :display-value="calculations.plaintiffPlurality1"
          description="Plaintiff or Plaintiffs - automatically applied based on single or multiple plaintiffs"
        />

        <FormField
          label="Plaintiff Plurality 2"
          :model-value="calculations.plaintiffPlurality2"
          type="text"
          :is-calculated="true"
          :display-value="calculations.plaintiffPlurality2"
          description="Plaintiff is or Plaintiffs are - automatically applied based on single or multiple plaintiffs"
        />

        <FormField
          label="Defendant Plurality 1"
          :model-value="calculations.defendantPlurality1"
          type="text"
          :is-calculated="true"
          :display-value="calculations.defendantPlurality1"
          description="Defendant or Defendants - automatically applied based on single or multiple defendants"
        />

        <FormField
          label="Defendant Plurality 2"
          :model-value="calculations.defendantPlurality2"
          type="text"
          :is-calculated="true"
          :display-value="calculations.defendantPlurality2"
          description="Defendant is or Defendants are - automatically applied based on single or multiple defendants"
        />
      </FormGroup>

      <!-- Important Dates -->
      <FormGroup
        title="Important Dates"
        description="Statute of limitations and execution dates calculated based on filing date"
        icon="Calendar"
        variant="bordered"
        :columns="1"
      >
        <FormField
          label="Executed Date"
          :model-value="calculations.executedDate"
          type="text"
          :is-calculated="true"
          :display-value="calculations.executedDate"
          description="Today's date in June 15, 2025 format"
        />

        <FormField
          label="Cause Number"
          :model-value="calculations.causeNumber"
          type="text"
          :is-calculated="true"
          :display-value="calculations.causeNumber"
          description="In the format of FIRST, SECOND, THIRD"
        />

        <FormField
          label="3-Year Statute of Limitations"
          :model-value="calculations.sol3"
          type="text"
          :is-calculated="true"
          :display-value="calculations.sol3"
          description="Complaint Filing Date - 3 years in June 16, 2025 format"
        />

        <FormField
          label="4-Year Statute of Limitations"
          :model-value="calculations.sol4"
          type="text"
          :is-calculated="true"
          :display-value="calculations.sol4"
          description="Complaint Filing Date - 4 years in June 16, 2025 format"
        />
      </FormGroup>

      <!-- 测试数据工具 -->
      <TestDataTool
        :test-data="COMPLAINT_TEST_DATA"
        :form-data="formData"
        :update-field="updateField"
        form-name="COMPLAINT"
        :special-handlers="specialHandlers"
      />
    </el-form>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import FormGroup from '@/components/common/FormGroup.vue'
import FormField from '@/components/common/FormField.vue'
import DefendantNameField from '@/components/common/DefendantNameField.vue'
import TestDataTool from '@/components/common/TestDataTool.vue'
import { useFormStore } from '@/stores/formStore'
import {
  CAUSES_OF_ACTION,
  PAY_PERIOD_OPTIONS,
  VALIDATION_RULES,
  API_CONFIG,
  COMPLAINT_TEST_DATA,
  updateCausesOrder,
  generateSelectedCausesLabels
} from '@/utils/constants'

// 使用表单状态管理
const formStore = useFormStore()
const formRef = ref()

// 表单数据 - 直接使用 ref，支持双向绑定
const formData = formStore.complaintForm

// 计算字段
const calculations = computed(() => formStore.complaintCalculations)

// 开发测试相关状态
const isDevelopmentMode = computed(() => {
  return API_CONFIG.ENVIRONMENT === 'development' || API_CONFIG.APP_ENV === 'development' || API_CONFIG.DEBUG
})

// 验证规则
const validationRules = {
  PlaintiffName: [VALIDATION_RULES.required],
  PlaintiffJob: [VALIDATION_RULES.required],
  DefendantName: [VALIDATION_RULES.required],
  DefendantState: [VALIDATION_RULES.required],
  DefendantEntityType: [VALIDATION_RULES.required],
  CourtLocation: [VALIDATION_RULES.required],
  CourtName: [VALIDATION_RULES.required],
  ComplaintFilingDate: [VALIDATION_RULES.required, VALIDATION_RULES.date],
  SelectedCauses: [
    {
      required: true,
      validator: (rule, value, callback) => {
        const hasSelected = Object.values(value || {}).some(v => v?.selected === true)
        if (!hasSelected) {
          callback(new Error('Please select at least one cause of action'))
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
  ],
  PlaintiffResidence: [VALIDATION_RULES.required],
  DefendantBusinessType: [VALIDATION_RULES.required],
  DefendantBusinessAddress: [VALIDATION_RULES.required],
  EmploymentStartDate: [VALIDATION_RULES.required, VALIDATION_RULES.date],
  EmploymentEndDate: [VALIDATION_RULES.required, VALIDATION_RULES.date],
  HourlyRate: [VALIDATION_RULES.required, VALIDATION_RULES.number],
  UnpaidHours: [VALIDATION_RULES.required, VALIDATION_RULES.number],
  WeeklyHours: [VALIDATION_RULES.required, VALIDATION_RULES.number],
  PayPeriodInterval: [VALIDATION_RULES.required],
  IwcOrder: [VALIDATION_RULES.required, VALIDATION_RULES.number],
  PayPeriods: [VALIDATION_RULES.required, VALIDATION_RULES.number]
}

// 字段变更处理（其他字段仍需要）
const handleFieldChange = (value, field) => {
  // 更新对应的字段
  if (field) {
    formStore.updateComplaintForm(field, value)
  }
}

// 处理案由选择变更
const handleCauseChange = () => {
  // 更新案由序号
  updateCausesOrder(formData.SelectedCauses)

  // 更新案由标签数组
  formData.SelectedCausesLabels = generateSelectedCausesLabels(formData.SelectedCauses)

  // 触发表单验证
  formRef.value?.validateField('SelectedCauses')
}

// 处理 Plaintiff Name 失去焦点事件，自动添加 ", an individual"
const handlePlaintiffNameBlur = (value) => {
  const currentValue = value || ''
  // 检查是否已经包含 ", an individual" 或为空
  if (currentValue && !currentValue.includes(', an individual')) {
    // 移除可能存在的尾随逗号和空格
    const cleanedValue = currentValue.replace(/,?\s*$/, '')
    const newValue = `${cleanedValue}, an individual`
    formStore.updateComplaintForm('PlaintiffName', newValue)
  }
}

// 监听表单数据变化，自动保存
watch(
  () => formData.value,
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

// TestDataTool 相关方法
const updateField = (field, value) => {
  formStore.updateComplaintForm(field, value)
}

// 特殊字段处理器
const specialHandlers = {
  // 如果有特殊字段需要处理，在这里添加
}

// 暴露方法给父组件
defineExpose({
  validate: () => formRef.value?.validate(),
  resetForm: () => formRef.value?.resetFields(),
  formRef
})
</script>

<style scoped>
.complaint-form {
  width: 100%;
}

/* 总损害赔偿字段特殊样式 */
:deep(.total-damage-field .el-input__wrapper) {
  background: linear-gradient(135deg, #ecfdf5, #d1fae5) !important;
  border-color: var(--success-color) !important;
  border-width: 2px !important;
}

:deep(.total-damage-field .el-input__inner) {
  color: var(--success-color) !important;
  font-weight: 700 !important;
  font-size: 16px !important;
}

:deep(.total-damage-field .calculated-label) {
  background: var(--success-color) !important;
  color: white !important;
}

/* Defendant Name Group */
.defendant-name-group {
  margin-bottom: var(--spacing-lg);
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
  .complaint-form :deep(.el-form-item__label) {
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

/* Causes of Action checkbox styles */
.causes-checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.cause-checkbox {
  display: flex !important;
  align-items: flex-start;
  margin-right: 0 !important;
  margin-bottom: 0 !important;
  line-height: 1.4;
  white-space: normal;
  word-wrap: break-word;
}

.cause-checkbox :deep(.el-checkbox__label) {
  padding-left: 8px;
  line-height: 1.4;
  white-space: normal;
  word-wrap: break-word;
  max-width: calc(100% - 30px);
}

.cause-checkbox :deep(.el-checkbox__input) {
  margin-top: 2px;
  flex-shrink: 0;
}

/* Cause label and order styling */
.cause-label {
  display: block;
  line-height: 1.4;
}

.cause-order {
  color: var(--el-color-primary);
  font-weight: 600;
  margin-left: 8px;
  font-size: 0.9em;
}

@media (max-width: 768px) {
  .causes-checkbox-group {
    gap: 10px;
  }

  .cause-checkbox :deep(.el-checkbox__label) {
    font-size: 14px;
    max-width: calc(100% - 25px);
  }

  .cause-order {
    font-size: 0.85em;
    margin-left: 6px;
  }
}
</style>
