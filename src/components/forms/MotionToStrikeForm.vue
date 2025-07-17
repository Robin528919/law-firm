<template>
  <div class="motion-to-strike-form">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="validationRules"
      label-width="160px"
      label-position="top"
      size="default"
      @submit.prevent="handleSubmit"
    >
      <!-- 基本信息组 -->
      <FormGroup
        title="Basic Information"
        description="Basic party and court information for the motion to strike"
        icon="User"
        variant="card"
        :columns="1"
      >
        <FormField
          label="Plaintiff Name"
          v-model="formData.PlaintiffName"
          prop="PlaintiffName"
          type="text"
          placeholder="e.g. James Doe"
          required
          description="Multiple plaintiffs separated by commas"
          @change="handlePlaintiffNameChange"
        />

        <FormField
          label="Defendant Name"
          v-model="formData.DefendantName"
          prop="DefendantName"
          type="text"
          placeholder="e.g. Chris Wu"
          required
          description="Multiple defendants separated by commas"
          @change="handleDefendantNameChange"
        />

        <FormField
          label="Court County Location"
          v-model="formData.CourtLocation"
          prop="CourtLocation"
          type="text"
          placeholder="e.g. LOS ANGELES"
          required
          description="County name where the court is located, use all capital letters"
        />

        <FormField
          label="Court Name"
          v-model="formData.CourtName"
          prop="CourtName"
          type="text"
          placeholder="e.g. STANLEY MOSK COURTHOUSE"
          required
          description="Court name"
        />

        <FormField
          label="Court Address"
          v-model="formData.CourtAddress"
          prop="CourtAddress"
          type="textarea"
          placeholder="e.g. 111 North Hill Street, Room 307 Los Angeles, CA 90012"
          :rows="2"
          required
          description="Detailed court address"
        />

        <FormField
          label="Case Number"
          v-model="formData.CaseNumber"
          prop="CaseNumber"
          type="text"
          placeholder="e.g. LASC123456"
          description="Case number"
        />

        <FormField
          label="Judge Name"
          v-model="formData.JudgeName"
          prop="JudgeName"
          type="text"
          placeholder="e.g. Michael Doe"
          description="Judge name without 'Hon.'"
        />
      </FormGroup>

      <!-- 听证信息组 -->
      <FormGroup
        title="Hearing Information"
        description="Hearing schedule and reservation details"
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

        <FormField
          label="Hearing Department"
          v-model="formData.HearingDept"
          prop="HearingDept"
          type="text"
          placeholder="e.g. 26"
          required
          description="Hearing department number"
        />

        <FormField
          label="Reservation ID"
          v-model="formData.ResID"
          prop="ResID"
          type="text"
          placeholder="e.g. 354359308862"
          required
          description="Reservation ID number"
        />
      </FormGroup>

      <!-- 案件信息组 -->
      <FormGroup
        title="Case Information"
        description="Case details and important dates"
        icon="FolderOpened"
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
          label="Case Type"
          v-model="formData.CaseType"
          prop="CaseType"
          type="select"
          :options="caseTypeOptions"
          placeholder="Select case type"
          required
        />

        <FormField
          label="Selected Causes of Action"
          v-model="formData.SelectedCauses"
          prop="SelectedCauses"
          type="select"
          multiple
          :options="motionCausesOptions"
          placeholder="Select multiple causes"
          description="Select multiple causes from complaint automation sheet"
          required
        />

        <el-form-item label="Answer Filing Date" prop="AnswerFilingDate">
          <el-date-picker
            v-model="formData.AnswerFilingDate"
            type="date"
            placeholder="Select answer filing date"
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

      <!-- 异议信息组 -->
      <FormGroup
        title="Demurrer Information"
        description="Affirmative defenses subject to the motion"
        icon="DocumentChecked"
        variant="bordered"
        :columns="1"
      >
        <FormField
          label="Affirmative Defenses Subject to the Demurrer"
          v-model="formData.ChosenAD"
          prop="ChosenAD"
          type="text"
          placeholder="e.g. First through Twenty-First"
          required
          description="Range of affirmative defenses subject to the motion"
        />
      </FormGroup>

      <!-- 服务信息组 -->
      <FormGroup
        title="Service Information"
        description="Counsel contact and service details"
        icon="Postcard"
        variant="card"
        :columns="1"
      >
        <FormField
          label="Service Info"
          v-model="formData.ServiceInfo"
          prop="ServiceInfo"
          type="textarea"
          placeholder="Counsel name, Firm Name, Address, Phone Number, Fax Number, Email Address, etc"
          :rows="4"
          description="Counsel name, firm name, address, phone, fax, email and other service information"
        />

        <FormField
          label="Server Name"
          v-model="formData.ServerName"
          prop="ServerName"
          type="text"
          placeholder="Who will serve the document"
          description="Name of document server"
        />
      </FormGroup>

      <!-- Meet & Confer 信息组 -->
      <FormGroup
        title="Meet & Confer Information"
        description="Meet and confer correspondence details"
        icon="ChatDotRound"
        variant="bordered"
        :columns="1"
      >
        <el-form-item label="Meet and Confer Date" prop="MnCDate">
          <el-date-picker
            v-model="formData.MnCDate"
            type="date"
            placeholder="The date the m&c letter was sent"
            style="width: 100%"
            value-format="YYYY-MM-DD"
            format="MMMM D, YYYY"
          />
        </el-form-item>

        <el-form-item label="Requested Response Date" prop="MnCRespDate">
          <el-date-picker
            v-model="formData.MnCRespDate"
            type="date"
            placeholder="The last date you gave OC to respond"
            style="width: 100%"
            value-format="YYYY-MM-DD"
            format="MMMM D, YYYY"
          />
        </el-form-item>

        <FormField
          label="Defendant's Response"
          v-model="formData.MnCResp"
          prop="MnCResp"
          type="textarea"
          placeholder="e.g. On July 21, 2025, Defendant's Counsel sent a letter for clarification"
          :rows="4"
          description="Defendant's response, can include multiple correspondence exchanges"
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

        <FormField
          label="Executed Date"
          :model-value="calculations.executedDate"
          type="text"
          :is-calculated="true"
          :display-value="calculations.executedDate"
          description="Current date, format: June 15, 2025"
        />
      </FormGroup>

      <!-- 测试数据工具 -->
      <TestDataTool
        :test-data="MOTION_TO_STRIKE_TEST_DATA"
        :form-data="formData"
        :update-field="updateField"
        form-name="MOTION TO STRIKE"
        :exclude-fields="['ExecutedDate']"
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
import {
  CASE_TYPE_OPTIONS,
  CAUSES_OF_ACTION,
  VALIDATION_RULES,
  MOTION_TO_STRIKE_TEST_DATA
} from '@/utils/constants'

// 使用表单状态管理
const formStore = useFormStore()
const formRef = ref()

// 表单数据 - 直接使用 ref，支持双向绑定
const formData = computed(() => formStore.motionToStrikeForm)

// 表单字段更新方法
const updateField = (field, value) => {
  formStore.updateMotionToStrikeForm(field, value)
}

// 特殊字段处理器
const specialHandlers = {
  TrialDate: (value) => {
    updateField('TrialDate', value)
  },
  SelectedCauses: (value) => {
    // 处理数组字段
    if (Array.isArray(value)) {
      updateField('SelectedCauses', value)
    }
  }
}

// 计算字段
const calculations = computed(() => formStore.motionToStrikeCalculations)

// Trial Date 相关状态
const trialDateMode = ref('notSet')
const trialDateValue = ref(null)

// 案件类型选项
const caseTypeOptions = CASE_TYPE_OPTIONS

// Motion to Strike 起诉原因选项（从 CAUSES_OF_ACTION 中提取，格式化为编号列表）
const motionCausesOptions = computed(() => {
  return CAUSES_OF_ACTION.map((cause, index) => {
    const cleanLabel = cause.label.split('(')[0].trim()
    return {
      label: `${index + 1})${cleanLabel}`,
      value: `${index + 1})${cleanLabel}`
    }
  })
})

// 验证规则
const validationRules = {
  PlaintiffName: [VALIDATION_RULES.required],
  DefendantName: [VALIDATION_RULES.required],
  CourtLocation: [VALIDATION_RULES.required],
  CourtName: [VALIDATION_RULES.required],
  CourtAddress: [VALIDATION_RULES.required],
  HearingDate: [VALIDATION_RULES.required, VALIDATION_RULES.date],
  HearingTime: [VALIDATION_RULES.required],
  HearingDept: [VALIDATION_RULES.required],
  ResID: [VALIDATION_RULES.required],
  ComplaintFilingDate: [VALIDATION_RULES.required, VALIDATION_RULES.date],
  CaseType: [VALIDATION_RULES.required],
  SelectedCauses: [VALIDATION_RULES.required],
  AnswerFilingDate: [VALIDATION_RULES.required, VALIDATION_RULES.date],
  ExecutedDate: [VALIDATION_RULES.required, VALIDATION_RULES.date],
  ChosenAD: [VALIDATION_RULES.required],
  MnCDate: [VALIDATION_RULES.required, VALIDATION_RULES.date],
  MnCRespDate: [VALIDATION_RULES.required, VALIDATION_RULES.date]
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
    formStore.updateMotionToStrikeForm('TrialDate', 'Not Set')
    trialDateValue.value = null
  } else {
    formStore.updateMotionToStrikeForm('TrialDate', trialDateValue.value)
  }
}

// Trial Date 值变更处理
const handleTrialDateChange = (value) => {
  formStore.updateMotionToStrikeForm('TrialDate', value)
}

// 原告姓名变更处理
const handlePlaintiffNameChange = (value) => {
  formStore.updateMotionToStrikeForm('PlaintiffName', value)
}

// 被告姓名变更处理
const handleDefendantNameChange = (value) => {
  formStore.updateMotionToStrikeForm('DefendantName', value)
}

// 监听名称变化，自动更新复数字段
watch(() => formData.PlaintiffName, () => {
  formStore.updateMotionToStrikeForm('PlaintiffPlurality1', calculations.value.plaintiffPlurality1)
}, { immediate: true })

watch(() => formData.DefendantName, () => {
  formStore.updateMotionToStrikeForm('DefendantPlurality1', calculations.value.defendantPlurality1)
}, { immediate: true })

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
    console.log('Motion to Strike 表单验证失败:', error)
    return false
  }
}

// 重置表单方法
const resetForm = () => {
  formStore.resetForm('motionToStrike')
  trialDateMode.value = 'notSet'
  trialDateValue.value = null
}

// 暴露方法给父组件
defineExpose({
  validate,
  resetForm
})
</script>

<style scoped>
.motion-to-strike-form {
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
</style> 