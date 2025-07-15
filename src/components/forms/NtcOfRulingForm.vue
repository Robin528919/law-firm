<template>
  <div class="ntc-of-ruling-form">
    <el-form ref="formRef" :model="formData" :rules="validationRules" label-width="auto">
      <!-- 基础信息 -->
      <FormGroup
        title="Basic Information"
        description="Plaintiff, defendant and case information"
        icon="User"
        variant="bordered"
        :columns="1"
      >
        <FormField
          label="Plaintiff Name"
          v-model="formData.PlaintiffName"
          prop="PlaintiffName"
          type="text"
          placeholder="e.g. CARLOS LOYA"
          required
          description="Plaintiff name"
        />

        <FormField
          label="Defendant Name"
          v-model="formData.DefendantName"
          prop="DefendantName"
          type="text"
          placeholder="e.g. KELLWOOD APPAREL, LLC"
          required
          description="Defendant company or entity name"
        />

        <FormField
          label="Case Number"
          v-model="formData.CaseNumber"
          prop="CaseNumber"
          type="text"
          placeholder="e.g. 22STCV15872"
          required
          description="Court case number"
        />

        <FormField
          label="Judge Name"
          v-model="formData.JudgeName"
          prop="JudgeName"
          type="text"
          placeholder="e.g. Hon. Timothy P. Dillon"
          required
          description="Presiding judge name"
        />
      </FormGroup>

      <!-- 听证信息 -->
      <FormGroup
        title="Hearing Information"
        description="Hearing dates, times and department details"
        icon="Calendar"
        variant="bordered"
        :columns="1"
      >
        <FormField
          label="Hearing Department"
          v-model="formData.HearingDept"
          prop="HearingDept"
          type="text"
          placeholder='e.g. Dept. "73"'
          required
          description="Department for first hearing"
        />

        <el-form-item label="Hearing Date" prop="HearingDate">
          <el-date-picker
              v-model="formData.HearingDate"
              type="date"
              placeholder="e.g. July 21, 2025"
              style="width: 100%"
              value-format="MMMM D, YYYY"
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

        <el-form-item label="Hearing Date 2" prop="HearingDate2">
          <el-date-picker
              v-model="formData.HearingDate2"
              type="date"
              placeholder="e.g. July 8, 2025"
              style="width: 100%"
              value-format="MMMM D, YYYY"
              format="MMMM D, YYYY"
          />
        </el-form-item>

        <el-form-item label="Hearing Time 2" prop="HearingTime2">
          <el-time-select
            v-model="formData.HearingTime2"
            start="08:00"
            step="00:30"
            end="17:00"
            placeholder="Select hearing time"
            format="h:mm A"
            value-format="h:mm A"
            style="width: 100%"
          />
        </el-form-item>

        <FormField
          label="Hearing Department 2"
          v-model="formData.HearingDept2"
          prop="HearingDept2"
          type="text"
          placeholder="e.g. 7"
          description="Department for second hearing (if applicable)"
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
          description="County and jurisdiction (use capital letters)"
        />

        <FormField
          label="Court Name"
          v-model="formData.CourtName"
          prop="CourtName"
          type="text"
          placeholder="e.g. STANLEY MOSK COURTHOUSE"
          required
          description="Full court name (use capital letters)"
        />

        <FormField
          label="Court Address"
          v-model="formData.CourtAddress"
          prop="CourtAddress"
          type="textarea"
          placeholder="e.g. 111 North Hill Street, Room 307 Los Angeles, CA 90012"
          required
          description="Complete court address"
          :rows="3"
        />
      </FormGroup>

      <!-- 日期信息 -->
      <FormGroup
        title="Date Information"
        description="Important case dates and trial information"
        icon="Calendar"
        variant="bordered"
        :columns="1"
      >
        <el-form-item label="Complaint Filing Date" prop="ComplaintFilingDate">
          <el-date-picker
              v-model="formData.ComplaintFilingDate"
              type="date"
              placeholder="e.g. May 12, 2022"
              style="width: 100%"
              value-format="MMMM D, YYYY"
              format="MMMM D, YYYY"
          />
        </el-form-item>

        <FormField
          label="Trial Date"
          v-model="formData.TrialDate"
          prop="TrialDate"
          type="text"
          placeholder="e.g. July 22, 2024 or 'Not Set'"
          required
          description="Trial date or 'Not Set' if not scheduled"
        />

        <el-form-item label="Letter Date" prop="LetterDate">
          <el-date-picker
              v-model="formData.LetterDate"
              type="date"
              placeholder="e.g. October 3, 2023"
              style="width: 100%"
              value-format="MMMM D, YYYY"
              format="MMMM D, YYYY"
          />
        </el-form-item>

        <el-form-item label="Executed Date" prop="ExecutedDate">
          <el-date-picker
              v-model="formData.ExecutedDate"
              type="date"
              placeholder="e.g. October 3, 2023"
              style="width: 100%"
              value-format="MMMM D, YYYY"
              format="MMMM D, YYYY"
          />
        </el-form-item>
      </FormGroup>

      <!-- 送达信息 -->
      <FormGroup
        title="Service Information"
        description="Service details and server information"
        icon="Message"
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

        <FormField
          label="Executed Date (Auto)"
          :model-value="calculations.executedDate"
          type="text"
          :is-calculated="true"
          :display-value="calculations.executedDate"
          description="Current date in legal format"
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
  NTC_OF_RULING_TEST_DATA
} from '@/utils/constants'

// 使用表单状态管理
const formStore = useFormStore()
const formRef = ref()

// 表单数据 - 直接使用 ref，支持双向绑定
const formData = formStore.ntcOfRulingForm

// 计算字段
const calculations = computed(() => formStore.ntcOfRulingCalculations)

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
  JudgeName: [VALIDATION_RULES.required],
  HearingDept: [VALIDATION_RULES.required],
  HearingDate: [VALIDATION_RULES.required, VALIDATION_RULES.date],
  HearingTime: [VALIDATION_RULES.required],
  ComplaintFilingDate: [VALIDATION_RULES.required, VALIDATION_RULES.date],
  TrialDate: [VALIDATION_RULES.required],
  CourtLocation: [VALIDATION_RULES.required],
  CourtName: [VALIDATION_RULES.required],
  CourtAddress: [VALIDATION_RULES.required],
  LetterDate: [VALIDATION_RULES.required, VALIDATION_RULES.date],
  ServiceInfo: [VALIDATION_RULES.required],
  ExecutedDate: [VALIDATION_RULES.required, VALIDATION_RULES.date],
  ServerName: [VALIDATION_RULES.required]
}

// 监听表单数据变化，自动保存
watch(
  () => formStore.ntcOfRulingForm,
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
    Object.keys(NTC_OF_RULING_TEST_DATA).forEach(key => {
      formStore.updateNtcOfRulingForm(key, NTC_OF_RULING_TEST_DATA[key])
    })

    // 短暂延迟模拟加载过程
    await new Promise(resolve => setTimeout(resolve, 300))

    console.log('NTC of Ruling 测试数据已填充:', formStore.ntcOfRulingForm)

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
.ntc-of-ruling-form {
  width: 100%;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .ntc-of-ruling-form :deep(.el-form-item__label) {
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