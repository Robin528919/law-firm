<template>
  <div class="rfp-sexual-harassment-form">
    <el-form ref="formRef" :model="formStore.rfpSexualHarassmentForm" :rules="validationRules" label-width="auto">
      <!-- 基础信息 -->
      <FormGroup
        title="Basic Information"
        description="Plaintiff and defendant information"
        icon="User"
        variant="bordered"
        :columns="1"
      >
        <FormField
          label="Plaintiff Name"
          v-model="formStore.rfpSexualHarassmentForm.PlaintiffName"
          prop="PlaintiffName"
          type="text"
          placeholder="e.g. Jane Doe, an individual"
          required
          description="Plaintiff name with individual designation"
          @blur="handlePlaintiffNameBlur"
        />

        <FormField
          label="Defendant Name"
          v-model="formStore.rfpSexualHarassmentForm.DefendantName"
          prop="DefendantName"
          type="text"
          placeholder="e.g. ABC Corporation"
          required
          description="Defendant company or entity name"
        />

        <FormField
          label="Case Number"
          v-model="formStore.rfpSexualHarassmentForm.CaseNumber"
          prop="CaseNumber"
          type="text"
          placeholder="e.g. LASC123456"
          required
          description="Court case number"
        />

        <FormField
          label="Defendant's Detailed Business Address"
          v-model="formStore.rfpSexualHarassmentForm.DefendantBusinessAddress"
          prop="DefendantBusinessAddress"
          type="text"
          placeholder="e.g. 1435 S. Vermont Avenue, Los Angeles, CA 90006"
          required
          description="Where the plaintiff worked"
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
          label="Court Name"
          v-model="formStore.rfpSexualHarassmentForm.CourtName"
          prop="CourtName"
          type="text"
          placeholder="e.g. STANLEY MOSK COURTHOUSE"
          required
          description="Full court name (use capital letters)"
        />

        <FormField
          label="Court Location"
          v-model="formStore.rfpSexualHarassmentForm.CourtLocation"
          prop="CourtLocation"
          type="text"
          placeholder="e.g. COUNTY OF LOS ANGELES, CENTRAL DISTRICT"
          required
          description="County and district (use capital letters)"
        />
      </FormGroup>

      <!-- 雇佣信息 -->
      <FormGroup
        title="Employment Information"
        description="Employment period and related dates"
        icon="Calendar"
        variant="bordered"
        :columns="1"
      >
        <el-form-item label="Start Date of the Employment" prop="EmploymentStartDate">
          <el-date-picker
             v-model="formStore.rfpSexualHarassmentForm.EmploymentStartDate"
            type="date"
            placeholder="e.g. May 1, 2022"
            style="width: 100%"
            value-format="YYYY-MM-DD"
            format="MMMM D, YYYY"
          />
        </el-form-item>
        <el-form-item label="End Date of the Employment" prop="EmploymentEndDate">
          <el-date-picker
           v-model="formStore.rfpSexualHarassmentForm.EmploymentEndDate"
            type="date"
            placeholder="e.g. May 1, 2022"
            style="width: 100%"
            value-format="YYYY-MM-DD"
            format="MMMM D, YYYY"
          />
        </el-form-item>
      </FormGroup>

      <!-- 自动计算字段 -->
      <FormGroup
        title="Grammar Helper"
        description="Automatically generated grammar forms based on number of parties"
        icon="ChatDotRound"
        variant="default"
        :columns="2"
      >
        <FormField
          label="Plaintiff Plurality"
          :model-value="calculations.plaintiffPlurality1"
          type="text"
          :is-calculated="true"
          :display-value="calculations.plaintiffPlurality1"
          description="Plaintiff or Plaintiffs - automatically applied based on single or multiple plaintiffs"
        />

        <FormField
          label="Defendant Plurality"
          :model-value="calculations.defendantPlurality1"
          type="text"
          :is-calculated="true"
          :display-value="calculations.defendantPlurality1"
          description="Defendant or Defendants - automatically applied based on single or multiple defendants"
        />
      </FormGroup>

      <!-- 测试数据工具 -->
      <TestDataTool
        :test-data="RFP_SEXUAL_HARASSMENT_TEST_DATA"
        :form-data="formData"
        :update-field="updateField"
        form-name="RFP SEXUAL HARASSMENT"
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
  RFP_SEXUAL_HARASSMENT_TEST_DATA
} from '@/utils/constants'

// 使用表单状态管理
const formStore = useFormStore()
const formRef = ref()

// 表单数据
const formData = computed(() => formStore.rfpSexualHarassmentForm)

// 计算字段
const calculations = computed(() => formStore.rfpSexualHarassmentCalculations)

// 表单字段更新方法
const updateField = (field, value) => {
  formStore.updateRfpSexualHarassmentForm(field, value)
}

// 验证规则
const validationRules = {
  PlaintiffName: [VALIDATION_RULES.required],
  DefendantName: [VALIDATION_RULES.required],
  CaseNumber: [VALIDATION_RULES.required],
  DefendantBusinessAddress: [VALIDATION_RULES.required],
  CourtName: [VALIDATION_RULES.required],
  CourtLocation: [VALIDATION_RULES.required],
  EmploymentStartDate: [VALIDATION_RULES.required, VALIDATION_RULES.date],
  EmploymentEndDate: [VALIDATION_RULES.required, VALIDATION_RULES.date]
}

// 处理 Plaintiff Name 失去焦点事件，自动添加 ", an individual"
const handlePlaintiffNameBlur = () => {
  const currentValue = formStore.rfpSexualHarassmentForm.PlaintiffName || ''
  // 检查是否已经包含 ", an individual" 或为空
  if (currentValue && !currentValue.includes(', an individual')) {
    // 移除可能存在的尾随逗号和空格
    const cleanedValue = currentValue.replace(/,?\s*$/, '')
    const newValue = `${cleanedValue}, an individual`
    formStore.updateRfpSexualHarassmentForm('PlaintiffName', newValue)
  }
}

// 监听表单数据变化，自动保存
watch(
  () => formStore.rfpSexualHarassmentForm,
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
  resetForm: () => formRef.value?.resetFields()
})
</script>

<style scoped>
.rfp-sexual-harassment-form {
  width: 100%;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .rfp-sexual-harassment-form :deep(.el-form-item__label) {
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
