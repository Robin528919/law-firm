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
      <!-- 基础信息 -->
      <FormGroup
        title="基础信息"
        description="起诉案件的基本信息和当事人资料"
        icon="User"
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
          label="原告职业"
          v-model="formData.plaintiffJob"
          prop="plaintiffJob"
          type="text"
          placeholder="请输入原告职业"
          required
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
        
        <FormField
          label="法院位置"
          v-model="formData.courtLocation"
          prop="courtLocation"
          type="text"
          placeholder="请输入法院所在县名（全大写）"
          required
          :tooltip="FIELD_TOOLTIPS.courtLocation"
        />
        
        <FormField
          label="法院名称"
          v-model="formData.courtName"
          prop="courtName"
          type="text"
          placeholder="请输入完整法院名称"
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
        
        <FormField
          label="法官姓名"
          v-model="formData.judgeName"
          prop="judgeName"
          type="text"
          placeholder="请输入主审法官姓名"
        />
        
        <FormField
          label="起诉日期"
          :model-value="formData.complaintFilingDate"
          prop="complaintFilingDate"
          type="date"
          placeholder="请选择起诉日期"
          required
          @change="(value) => handleFieldChange(value, 'complaintFilingDate')"
        />
      </FormGroup>

      <!-- 起诉原因选择 -->
      <FormGroup
        title="起诉原因"
        description="请选择适用的起诉原因，可多选"
        icon="DocumentChecked"
        variant="bordered"
        :columns="1"
      >
        <FormField
          label="起诉原因"
          v-model="formData.selectedCauses"
          prop="selectedCauses"
          type="checkbox"
          :options="CAUSES_OF_ACTION"
          required
        />
      </FormGroup>

      <!-- 地址信息 -->
      <FormGroup
        title="地址信息"
        description="当事人的居住地和工作地址信息"
        icon="LocationFilled"
        variant="default"
        :columns="2"
      >
        <FormField
          label="原告居住地"
          v-model="formData.plaintiffResidence"
          prop="plaintiffResidence"
          type="text"
          placeholder="例如：Los Angeles, California"
          required
        />
        
        <FormField
          label="被告业务类型"
          v-model="formData.defendantBusinessType"
          prop="defendantBusinessType"
          type="text"
          placeholder="例如：restaurant, retail store"
          required
        />
        
        <FormField
          label="被告详细地址"
          v-model="formData.defendantBusinessAddress"
          prop="defendantBusinessAddress"
          type="textarea"
          placeholder="请输入被告的详细业务地址（原告工作地点）"
          :rows="3"
          required
        />
      </FormGroup>

      <!-- 雇佣信息 -->
      <FormGroup
        title="雇佣信息"
        description="原告的雇佣期间和工作条件信息"
        icon="Briefcase"
        variant="card"
        :columns="2"
      >
        <FormField
          label="雇佣开始日期"
          :model-value="formData.employmentStartDate"
          prop="employmentStartDate"
          type="date"
          placeholder="请选择雇佣开始日期"
          required
          @change="(value) => handleFieldChange(value, 'employmentStartDate')"
        />
        
        <FormField
          label="雇佣结束日期"
          :model-value="formData.employmentEndDate"
          prop="employmentEndDate"
          type="date"
          placeholder="请选择雇佣结束日期"
          required
          @change="(value) => handleFieldChange(value, 'employmentEndDate')"
        />
        
        <FormField
          label="时薪"
          v-model="formData.hourlyRate"
          prop="hourlyRate"
          type="number"
          placeholder="请输入时薪金额"
          :min="0"
          :precision="2"
          required
          :tooltip="FIELD_TOOLTIPS.hourlyRate"
          @change="(value) => handleFieldChange(value, 'hourlyRate')"
        />
        
        <FormField
          label="未付小时数"
          v-model="formData.unpaidHours"
          prop="unpaidHours"
          type="number"
          placeholder="请输入未付工资的小时数"
          :min="0"
          :precision="1"
          required
          @change="(value) => handleFieldChange(value, 'unpaidHours')"
        />
        
        <FormField
          label="每周工作小时数"
          v-model="formData.weeklyHours"
          prop="weeklyHours"
          type="number"
          placeholder="请输入每周实际工作小时数"
          :min="0"
          :precision="1"
          required
          :tooltip="FIELD_TOOLTIPS.weeklyHours"
          @change="(value) => handleFieldChange(value, 'weeklyHours')"
        />
        
        <FormField
          label="双倍加班小时数"
          v-model="formData.doubleOvertimeHours"
          prop="doubleOvertimeHours"
          type="number"
          placeholder="请输入每周双倍加班小时数"
          :min="0"
          :precision="1"
          :tooltip="FIELD_TOOLTIPS.overtimeHours"
          @change="(value) => handleFieldChange(value, 'doubleOvertimeHours')"
        />
      </FormGroup>

      <!-- 其他信息 -->
      <FormGroup
        title="其他信息"
        description="薪资周期、工会秩序和其他相关信息"
        icon="Setting"
        variant="bordered"
        :columns="2"
      >
        <FormField
          label="薪资周期"
          v-model="formData.payPeriodInterval"
          prop="payPeriodInterval"
          type="select"
          placeholder="请选择薪资发放周期"
          :options="PAY_PERIOD_OPTIONS"
          required
        />
        
        <FormField
          label="IWC订单号"
          v-model="formData.iwcOrder"
          prop="iwcOrder"
          type="number"
          placeholder="请输入适用的IWC订单号"
          :min="1"
          :precision="0"
          required
        />
        
        <FormField
          label="薪资期数"
          v-model="formData.payPeriods"
          prop="payPeriods"
          type="number"
          placeholder="请输入薪资期数"
          :min="1"
          :precision="0"
          required
          @change="(value) => handleFieldChange(value, 'payPeriods')"
        />
        
        <FormField
          label="每周错过用餐时间"
          v-model="formData.missedMealBreaks"
          prop="missedMealBreaks"
          type="number"
          placeholder="请输入每周错过的用餐时间次数"
          :min="0"
          :precision="0"
          @change="(value) => handleFieldChange(value, 'missedMealBreaks')"
        />
        
        <FormField
          label="每周错过休息时间"
          v-model="formData.missedRestBreaks"
          prop="missedRestBreaks"
          type="number"
          placeholder="请输入每周错过的休息时间次数"
          :min="0"
          :precision="0"
          @change="(value) => handleFieldChange(value, 'missedRestBreaks')"
        />
        
        <FormField
          label="业务费用类型"
          v-model="formData.businessExpenseType"
          prop="businessExpenseType"
          type="text"
          placeholder="例如：汽油费、停车费等"
        />
        
        <FormField
          label="业务费用金额"
          v-model="formData.businessExpenseAmount"
          prop="businessExpenseAmount"
          type="number"
          placeholder="请输入未报销的业务费用总额"
          :min="0"
          :precision="2"
          @change="(value) => handleFieldChange(value, 'businessExpenseAmount')"
        />
      </FormGroup>

      <!-- 自动计算字段 -->
      <FormGroup
        title="自动计算结果"
        description="基于上述信息自动计算的法律相关数据"
        icon="Calculator"
        variant="card"
        :columns="2"
        badge="自动计算"
        badge-type="success"
      >
        <FormField
          label="雇佣周数"
          :model-value="calculations.doe"
          type="number"
          :is-calculated="true"
          :display-value="`${calculations.doe} 周`"
          :tooltip="FIELD_TOOLTIPS.doe"
        />
        
        <FormField
          label="1.5倍加班小时数"
          :model-value="calculations.oneAndHalfOvertimeHours"
          type="number"
          :is-calculated="true"
          :display-value="`${calculations.oneAndHalfOvertimeHours} 小时/周`"
        />
        
        <FormField
          label="总加班小时数"
          :model-value="calculations.overtimeHoursTotal"
          type="number"
          :is-calculated="true"
          :display-value="`${calculations.overtimeHoursTotal} 小时/周`"
        />
        
        <FormField
          label="加班状态"
          :model-value="calculations.overtimeStatus"
          type="text"
          :is-calculated="true"
          :display-value="calculations.overtimeStatus"
        />
        
        <FormField
          label="未付工资损害"
          :model-value="calculations.damageUnpaidWages"
          type="number"
          :is-calculated="true"
          :display-value="`$${calculations.damageUnpaidWages.toLocaleString()}`"
          :tooltip="FIELD_TOOLTIPS.damageCalculated"
        />
        
        <FormField
          label="用餐时间损害"
          :model-value="calculations.damageMealBreaks"
          type="number"
          :is-calculated="true"
          :display-value="`$${calculations.damageMealBreaks.toLocaleString()}`"
        />
        
        <FormField
          label="休息时间损害"
          :model-value="calculations.damageRestBreaks"
          type="number"
          :is-calculated="true"
          :display-value="`$${calculations.damageRestBreaks.toLocaleString()}`"
        />
        
        <FormField
          label="加班费损害"
          :model-value="calculations.damageOvertime"
          type="number"
          :is-calculated="true"
          :display-value="`$${calculations.damageOvertime.toLocaleString()}`"
        />
        
        <FormField
          label="等待时间损害"
          :model-value="calculations.damageWaitingTime"
          type="number"
          :is-calculated="true"
          :display-value="`$${calculations.damageWaitingTime.toLocaleString()}`"
        />
        
        <FormField
          label="工资单罚金"
          :model-value="calculations.wageStatementPenalty"
          type="number"
          :is-calculated="true"
          :display-value="`$${calculations.wageStatementPenalty.toLocaleString()}`"
        />
        
        <FormField
          label="总损害赔偿"
          :model-value="calculations.damageTotal"
          type="number"
          :is-calculated="true"
          :display-value="`$${calculations.damageTotal.toLocaleString()}`"
          class="total-damage-field"
        />
        
        <FormField
          label="预判利息"
          :model-value="calculations.preJudgmentInterest"
          type="number"
          :is-calculated="true"
          :display-value="`$${calculations.preJudgmentInterest.toFixed(2)}`"
        />
      </FormGroup>

      <!-- 语法助手 -->
      <FormGroup
        title="语法助手"
        description="根据当事人数量自动生成的语法形式"
        icon="ChatDotRound"
        variant="default"
        :columns="2"
      >
        <FormField
          label="原告复数形式1"
          :model-value="calculations.plaintiffPlurality1"
          type="text"
          :is-calculated="true"
          :display-value="calculations.plaintiffPlurality1"
        />
        
        <FormField
          label="原告复数形式2"
          :model-value="calculations.plaintiffPlurality2"
          type="text"
          :is-calculated="true"
          :display-value="calculations.plaintiffPlurality2"
        />
        
        <FormField
          label="被告复数形式1"
          :model-value="calculations.defendantPlurality1"
          type="text"
          :is-calculated="true"
          :display-value="calculations.defendantPlurality1"
        />
        
        <FormField
          label="被告复数形式2"
          :model-value="calculations.defendantPlurality2"
          type="text"
          :is-calculated="true"
          :display-value="calculations.defendantPlurality2"
        />
      </FormGroup>

      <!-- 重要日期 -->
      <FormGroup
        title="重要日期"
        description="根据起诉日期计算的法律时效和执行日期"
        icon="Calendar"
        variant="bordered"
        :columns="2"
      >
        <FormField
          label="执行日期"
          :model-value="calculations.executedDate"
          type="text"
          :is-calculated="true"
          :display-value="calculations.executedDate"
        />
        
        <FormField
          label="案件编号"
          :model-value="calculations.causeNumber"
          type="text"
          :is-calculated="true"
          :display-value="calculations.causeNumber"
        />
        
        <FormField
          label="3年诉讼时效"
          :model-value="calculations.sol3"
          type="text"
          :is-calculated="true"
          :display-value="calculations.sol3"
        />
        
        <FormField
          label="4年诉讼时效"
          :model-value="calculations.sol4"
          type="text"
          :is-calculated="true"
          :display-value="calculations.sol4"
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

// 表单数据
const formData = computed({
  get: () => formStore.complaintForm,
  set: (value) => {
    // 这里可以添加额外的处理逻辑
  }
})

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

// 字段变更处理
const handleFieldChange = (value, field) => {
  // 更新对应的字段
  if (field) {
    console.log(`更新字段 ${field}:`, value, typeof value)
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