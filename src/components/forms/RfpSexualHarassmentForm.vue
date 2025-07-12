<template>
  <div class="rfp-sexual-harassment-form">
    <el-form ref="formRef" :model="formStore.rfpSexualHarassmentForm" :rules="validationRules" label-width="200px">
      <!-- 基础信息 -->
      <FormGroup
        title="Basic Information"
        description="Plaintiff and defendant information"
        icon="User"
        variant="bordered"
        :columns="2"
      >
        <FormField
          label="Plaintiff Name"
          :model-value="formStore.rfpSexualHarassmentForm.PlaintiffName"
          @update:model-value="(value) => formStore.updateRfpSexualHarassmentForm('PlaintiffName', value)"
          prop="PlaintiffName"
          type="text"
          placeholder="e.g. Jane Doe, an individual"
          required
          description="Plaintiff name with individual designation"
          @blur="handlePlaintiffNameBlur"
        />

        <FormField
          label="Defendant Name"
          :model-value="formStore.rfpSexualHarassmentForm.DefendantName"
          @update:model-value="(value) => formStore.updateRfpSexualHarassmentForm('DefendantName', value)"
          prop="DefendantName"
          type="text"
          placeholder="e.g. ABC Corporation"
          required
          description="Defendant company or entity name"
        />

        <FormField
          label="Case Number"
          :model-value="formStore.rfpSexualHarassmentForm.CaseNumber"
          @update:model-value="(value) => formStore.updateRfpSexualHarassmentForm('CaseNumber', value)"
          prop="CaseNumber"
          type="text"
          placeholder="e.g. LASC123456"
          required
          description="Court case number"
        />

        <FormField
          label="Defendant's Detailed Business Address"
          :model-value="formStore.rfpSexualHarassmentForm.DefendantBusinessAddress"
          @update:model-value="(value) => formStore.updateRfpSexualHarassmentForm('DefendantBusinessAddress', value)"
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
        :columns="2"
      >
        <FormField
          label="Court Name"
          :model-value="formStore.rfpSexualHarassmentForm.CourtName"
          @update:model-value="(value) => formStore.updateRfpSexualHarassmentForm('CourtName', value)"
          prop="CourtName"
          type="text"
          placeholder="e.g. STANLEY MOSK COURTHOUSE"
          required
          description="Full court name (use capital letters)"
        />

        <FormField
          label="Court Location"
          :model-value="formStore.rfpSexualHarassmentForm.CourtLocation"
          @update:model-value="(value) => formStore.updateRfpSexualHarassmentForm('CourtLocation', value)"
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
        :columns="2"
      >
        <FormField
          label="Start Date of the Employment"
          :model-value="formStore.rfpSexualHarassmentForm.EmploymentStartDate"
          @update:model-value="(value) => formStore.updateRfpSexualHarassmentForm('EmploymentStartDate', value)"
          prop="EmploymentStartDate"
          type="date"
          placeholder="mm/dd/yyyy"
          required
          description="When the plaintiff started working"
        />

        <FormField
          label="End Date of the Employment"
          :model-value="formStore.rfpSexualHarassmentForm.EmploymentEndDate"
          @update:model-value="(value) => formStore.updateRfpSexualHarassmentForm('EmploymentEndDate', value)"
          prop="EmploymentEndDate"
          type="date"
          placeholder="mm/dd/yyyy"
          required
          description="When the plaintiff stopped working"
        />
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

      <!-- 开发测试工具 -->
      <FormGroup
        v-if="isDevelopmentMode"
        title="Development Tools"
        description="Testing utilities for development purposes"
        icon="Tools"
        variant="bordered"
        :columns="1"
      >
        <div class="test-tools">
          <el-button
            @click="fillTestData"
            type="warning"
            icon="DocumentCopy"
            size="default"
            :loading="fillingTestData"
          >
            Fill Test Data
          </el-button>
          <div class="test-info">
            <small>Environment: {{ API_CONFIG.ENVIRONMENT }} | App Env: {{ API_CONFIG.APP_ENV }}</small>
          </div>
        </div>
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
  VALIDATION_RULES,
  API_CONFIG,
  RFP_SEXUAL_HARASSMENT_TEST_DATA
} from '@/utils/constants'

// 使用表单状态管理
const formStore = useFormStore()
const formRef = ref()

// 计算字段
const calculations = computed(() => formStore.rfpSexualHarassmentCalculations)

// 开发测试相关状态
const isDevelopmentMode = computed(() => {
  return API_CONFIG.ENVIRONMENT === 'development' || API_CONFIG.APP_ENV === 'development' || API_CONFIG.DEBUG
})
const fillingTestData = ref(false)

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

// 填充测试数据方法
const fillTestData = async () => {
  fillingTestData.value = true
  
  try {
    // 填充所有测试数据
    Object.keys(RFP_SEXUAL_HARASSMENT_TEST_DATA).forEach(key => {
      formStore.updateRfpSexualHarassmentForm(key, RFP_SEXUAL_HARASSMENT_TEST_DATA[key])
    })
    
    // 短暂延迟模拟加载过程
    await new Promise(resolve => setTimeout(resolve, 300))
    
    console.log('RFP Sexual Harassment 测试数据已填充:', formStore.rfpSexualHarassmentForm)
    
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