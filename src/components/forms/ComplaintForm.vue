<template>
  <div class="complaint-form">
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
        description="Basic party and court information for the complaint case"
        icon="User"
        variant="card"
        :columns="2"
      >
        <FormField
          label="Plaintiff Name"
          v-model="formData.plaintiffName"
          prop="plaintiffName"
          type="text"
          placeholder="e.g. James Doe, should be followed by individual designation"
          required
          description="Multiple plaintiffs separated by commas. Each name should be followed by an individual designation"
          @change="(value) => handleFieldChange(value, 'plaintiffName')"
        />
        
        <FormField
          label="Plaintiff's Job"
          v-model="formData.plaintiffJob"
          prop="plaintiffJob"
          type="text"
          placeholder="e.g. Chef"
          required
        />
        
        <FormField
          label="Defendant Name"
          v-model="formData.defendantName"
          prop="defendantName"
          type="text"
          placeholder="e.g. Chris Wu"
          required
          description="Can add multiple. If corporation, need to select state. For example, a California corporation."
          @change="(value) => handleFieldChange(value, 'defendantName')"
        />
        
        <FormField
          label="Court Location (County)"
          v-model="formData.courtLocation"
          prop="courtLocation"
          type="text"
          placeholder="e.g. LOS ANGELES (All Capital)"
          required
          description="Enter county name in all capital letters"
        />
        
        <FormField
          label="Court Name"
          v-model="formData.courtName"
          prop="courtName"
          type="text"
          placeholder="e.g. STANLEY MOSK COURTHOUSE"
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
        
        <FormField
          label="Judge Name"
          v-model="formData.judgeName"
          prop="judgeName"
          type="text"
          placeholder="e.g. Michael Doe"
        />
        
        <el-form-item label="Complaint Filing Date" prop="complaintFilingDate">
          <el-date-picker 
            v-model="formData.complaintFilingDate" 
            type="date" 
            placeholder="Select complaint filing date or expected filing date" 
            style="width: 100%" 
            value-format="YYYY-MM-DD"
            format="YYYY-MM-DD"
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
        <FormField
          label="Causes of Action"
          v-model="formData.selectedCauses"
          prop="selectedCauses"
          type="checkbox"
          :options="CAUSES_OF_ACTION"
          required
        />
      </FormGroup>

      <!-- Address Information -->
      <FormGroup
        title="Address Information"
        description="Residence and workplace address information of the parties"
        icon="LocationFilled"
        variant="default"
        :columns="2"
      >
        <FormField
          label="Plaintiff Residence (County, State)"
          v-model="formData.plaintiffResidence"
          prop="plaintiffResidence"
          type="text"
          placeholder="e.g. Los Angeles, California"
          required
        />
        
        <FormField
          label="Defendant Business Type"
          v-model="formData.defendantBusinessType"
          prop="defendantBusinessType"
          type="text"
          placeholder="e.g. restaurant"
          required
        />
        
        <FormField
          label="Defendant's Detailed Business Address"
          v-model="formData.defendantBusinessAddress"
          prop="defendantBusinessAddress"
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
        :columns="2"
      >
        <el-form-item label="Start Date of the Employment" prop="employmentStartDate">
          <el-date-picker 
            v-model="formData.employmentStartDate" 
            type="date" 
            placeholder="e.g. May 1, 2022" 
            style="width: 100%" 
            value-format="YYYY-MM-DD"
            format="YYYY-MM-DD"
          />
        </el-form-item>
        
        <el-form-item label="End Date of the Employment" prop="employmentEndDate">
          <el-date-picker 
            v-model="formData.employmentEndDate" 
            type="date" 
            placeholder="e.g. June 23, 2024" 
            style="width: 100%" 
            value-format="YYYY-MM-DD"
            format="YYYY-MM-DD"
          />
        </el-form-item>
        
        <FormField
          label="Plaintiff's Hourly Rate"
          v-model="formData.hourlyRate"
          prop="hourlyRate"
          type="number"
          placeholder="25"
          :min="0"
          :precision="2"
          required
          description="Need to be used to calculate unpaid wages, overtime, etc"
          @change="(value) => handleFieldChange(value, 'hourlyRate')"
        />
        
        <FormField
          label="Unpaid Hours"
          v-model="formData.unpaidHours"
          prop="unpaidHours"
          type="number"
          placeholder="300"
          :min="0"
          :precision="1"
          required
          @change="(value) => handleFieldChange(value, 'unpaidHours')"
        />
        
        <FormField
          label="How Many Actual Hours Did the Plaintiff Work Per Week"
          v-model="formData.weeklyHours"
          prop="weeklyHours"
          type="number"
          placeholder="80"
          :min="0"
          :precision="1"
          required
          @change="(value) => handleFieldChange(value, 'weeklyHours')"
        />
        
        <FormField
          label="How Many 2 * Overtime Hours Did the Plaintiff Work Per Week"
          v-model="formData.doubleOvertimeHours"
          prop="doubleOvertimeHours"
          type="number"
          placeholder="5"
          :min="0"
          :precision="1"
          @change="(value) => handleFieldChange(value, 'doubleOvertimeHours')"
        />
      </FormGroup>

      <!-- Other Information -->
      <FormGroup
        title="Other Information"
        description="Pay period, IWC order and other related information"
        icon="Setting"
        variant="bordered"
        :columns="2"
      >
        <FormField
          label="Pay Period Interval"
          v-model="formData.payPeriodInterval"
          prop="payPeriodInterval"
          type="select"
          placeholder="Select pay period interval"
          :options="PAY_PERIOD_OPTIONS"
          required
          description="Options: Daily, Weekly, Bi-Weekly, Monthly, Bi-Monthly, Quarterly"
        />
        
        <FormField
          label="What is the Applicable IWC Order (Number)"
          v-model="formData.iwcOrder"
          prop="iwcOrder"
          type="number"
          placeholder="5"
          :min="1"
          :precision="0"
          required
        />
        
        <FormField
          label="Payperiods"
          v-model="formData.payPeriods"
          prop="payPeriods"
          type="number"
          placeholder="20"
          :min="1"
          :precision="0"
          required
          @change="(value) => handleFieldChange(value, 'payPeriods')"
        />
        
        <FormField
          label="How Many Missed Meal Breaks Per Week"
          v-model="formData.missedMealBreaks"
          prop="missedMealBreaks"
          type="number"
          placeholder="5"
          :min="0"
          :precision="0"
          @change="(value) => handleFieldChange(value, 'missedMealBreaks')"
        />
        
        <FormField
          label="How Many Missed Rest Breaks Per Week"
          v-model="formData.missedRestBreaks"
          prop="missedRestBreaks"
          type="number"
          placeholder="5"
          :min="0"
          :precision="0"
          @change="(value) => handleFieldChange(value, 'missedRestBreaks')"
        />
        
        <FormField
          label="What is the Type of Unpaid Expense"
          v-model="formData.businessExpenseType"
          prop="businessExpenseType"
          type="text"
          placeholder="e.g. Gas"
        />
        
        <FormField
          label="What is the Amount of Unreimbursed Business Expense"
          v-model="formData.businessExpenseAmount"
          prop="businessExpenseAmount"
          type="number"
          placeholder="1,000"
          :min="0"
          :precision="2"
          @change="(value) => handleFieldChange(value, 'businessExpenseAmount')"
        />
      </FormGroup>

      <!-- Automatic Calculations -->
      <FormGroup
        title="Automatic Calculation Results"
        description="Legal-related data automatically calculated based on the above information"
        icon="Calculator"
        variant="card"
        :columns="2"
        badge="Auto-Calculated"
        badge-type="success"
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
        :columns="2"
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
        :columns="2"
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
    </el-form>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import FormGroup from '@/components/common/FormGroup.vue'
import FormField from '@/components/common/FormField.vue'
import { useFormStore } from '@/stores/formStore'
import { 
  CAUSES_OF_ACTION, 
  PAY_PERIOD_OPTIONS, 
  FIELD_TOOLTIPS,
  VALIDATION_RULES 
} from '@/utils/constants'

// 使用表单状态管理
const formStore = useFormStore()
const formRef = ref()

// 表单数据 - 直接使用 ref，支持双向绑定
const formData = formStore.complaintForm

// 计算字段
const calculations = computed(() => formStore.complaintCalculations)

// 验证规则
const validationRules = {
  plaintiffName: [VALIDATION_RULES.required],
  plaintiffJob: [VALIDATION_RULES.required],
  defendantName: [VALIDATION_RULES.required],
  courtLocation: [VALIDATION_RULES.required],
  courtName: [VALIDATION_RULES.required],
  complaintFilingDate: [VALIDATION_RULES.required, VALIDATION_RULES.date],
  selectedCauses: [VALIDATION_RULES.required],
  plaintiffResidence: [VALIDATION_RULES.required],
  defendantBusinessType: [VALIDATION_RULES.required],
  defendantBusinessAddress: [VALIDATION_RULES.required],
  employmentStartDate: [VALIDATION_RULES.required, VALIDATION_RULES.date],
  employmentEndDate: [VALIDATION_RULES.required, VALIDATION_RULES.date],
  hourlyRate: [VALIDATION_RULES.required, VALIDATION_RULES.number],
  unpaidHours: [VALIDATION_RULES.required, VALIDATION_RULES.number],
  weeklyHours: [VALIDATION_RULES.required, VALIDATION_RULES.number],
  payPeriodInterval: [VALIDATION_RULES.required],
  iwcOrder: [VALIDATION_RULES.required, VALIDATION_RULES.number],
  payPeriods: [VALIDATION_RULES.required, VALIDATION_RULES.number]
}

// 字段变更处理（其他字段仍需要）
const handleFieldChange = (value, field) => {
  // 更新对应的字段
  if (field) {
    formStore.updateComplaintForm(field, value)
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

/* 响应式调整 */
@media (max-width: 768px) {
  .complaint-form :deep(.el-form-item__label) {
    font-size: 14px;
  }
}
</style> 